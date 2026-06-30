import { and, asc, desc, eq, lt, or, type SQL, sql } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { products } from "../schema/product.schema.js";
import {
  STOCK_LEVELS_TENANT_COMPANY_PRODUCT_WAREHOUSE_UNIQUE_INDEX,
  stockLevels,
} from "../schema/stock-level.schema.js";
import { stockMovements } from "../schema/stock-movement.schema.js";
import { warehouses } from "../schema/warehouse.schema.js";
import type {
  StockLevelRecord,
  StockMovementWriteInput,
} from "./stock.contract.js";

export class StockScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StockScopeMismatchError";
  }
}

export class StockProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`Product "${productId}" was not found.`);
    this.name = "StockProductNotFoundError";
  }
}

export class StockWarehouseNotFoundError extends Error {
  constructor(warehouseId: string) {
    super(`Warehouse "${warehouseId}" was not found.`);
    this.name = "StockWarehouseNotFoundError";
  }
}

export class StockInsufficientQuantityError extends Error {
  readonly productId: string;
  readonly quantityDelta: string;
  readonly quantityOnHand: string;
  readonly warehouseId: string;

  constructor(input: {
    readonly productId: string;
    readonly quantityDelta: string;
    readonly quantityOnHand: string;
    readonly warehouseId: string;
  }) {
    super(
      `Insufficient quantity on hand for product "${input.productId}" in warehouse "${input.warehouseId}": on hand ${input.quantityOnHand}, delta ${input.quantityDelta}.`
    );
    this.name = "StockInsufficientQuantityError";
    this.productId = input.productId;
    this.quantityDelta = input.quantityDelta;
    this.quantityOnHand = input.quantityOnHand;
    this.warehouseId = input.warehouseId;
  }
}

export interface StockAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type RecordStockMovementInput = StockMovementWriteInput & {
  readonly audit: StockAuditContext;
};

export interface StockMovementMutationResult {
  readonly movementId: string;
  readonly quantityOnHand: string;
}

const STOCK_LEVEL_LIST_DEFAULT_LIMIT = 200;
const STOCK_LEVEL_LIST_MAX_LIMIT = 100;

export interface StockLevelListSortField {
  readonly direction: "asc" | "desc";
  readonly field: "productId" | "quantityOnHand" | "updatedAt";
}

export interface ListStockLevelsByTenantInput {
  readonly companyId?: string;
  readonly cursor?: string;
  readonly filter?: {
    readonly productId?: string;
    readonly warehouseId?: string;
  };
  readonly limit?: number;
  readonly sort?: readonly StockLevelListSortField[];
  readonly tenantId: string;
}

export interface CursorPaginatedResult<TItem> {
  readonly hasMore: boolean;
  readonly items: readonly TItem[];
  readonly nextCursor: string | null;
}

function parseStockQuantity(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid stock quantity "${value}".`);
  }

  return parsed;
}

function computeQuantityOnHandAfterDelta(
  currentQuantityOnHand: string,
  quantityDelta: string
): number {
  return (
    parseStockQuantity(currentQuantityOnHand) +
    parseStockQuantity(quantityDelta)
  );
}

async function assertSufficientQuantityOnHand(
  input: Pick<
    StockMovementWriteInput,
    "tenantId" | "companyId" | "productId" | "warehouseId" | "quantityDelta"
  >,
  db: AfendaDatabase
): Promise<void> {
  const [existingLevel] = await db
    .select({ quantityOnHand: stockLevels.quantityOnHand })
    .from(stockLevels)
    .where(
      and(
        eq(stockLevels.tenantId, input.tenantId),
        eq(stockLevels.companyId, input.companyId),
        eq(stockLevels.productId, input.productId),
        eq(stockLevels.warehouseId, input.warehouseId)
      )
    )
    .limit(1);

  const nextQuantityOnHand = computeQuantityOnHandAfterDelta(
    existingLevel?.quantityOnHand ?? "0",
    input.quantityDelta
  );

  if (nextQuantityOnHand < 0) {
    throw new StockInsufficientQuantityError({
      productId: input.productId,
      quantityDelta: input.quantityDelta,
      quantityOnHand: existingLevel?.quantityOnHand ?? "0",
      warehouseId: input.warehouseId,
    });
  }
}

function mapStockLevelRow(row: {
  tenantId: string;
  companyId: string;
  productId: string;
  warehouseId: string;
  quantityOnHand: string;
}): StockLevelRecord {
  return {
    tenantId: row.tenantId,
    companyId: row.companyId,
    productId: row.productId,
    warehouseId: row.warehouseId,
    quantityOnHand: row.quantityOnHand,
  };
}

async function assertStockMasterDataScope(
  input: Pick<
    StockMovementWriteInput,
    "tenantId" | "companyId" | "productId" | "warehouseId"
  >,
  db: AfendaDatabase
): Promise<void> {
  const [product] = await db
    .select({ tenantId: products.tenantId })
    .from(products)
    .where(
      and(
        eq(products.id, input.productId),
        eq(products.tenantId, input.tenantId)
      )
    )
    .limit(1);

  if (!product) {
    throw new StockProductNotFoundError(input.productId);
  }

  const [warehouse] = await db
    .select({
      tenantId: warehouses.tenantId,
      companyId: warehouses.companyId,
    })
    .from(warehouses)
    .where(
      and(
        eq(warehouses.id, input.warehouseId),
        eq(warehouses.tenantId, input.tenantId)
      )
    )
    .limit(1);

  if (!warehouse) {
    throw new StockWarehouseNotFoundError(input.warehouseId);
  }

  if (warehouse.companyId !== input.companyId) {
    throw new StockScopeMismatchError(
      "Warehouse company must match the stock movement company scope."
    );
  }
}

async function recordStockAuditEvent(
  action: "inventory.stock.adjust",
  movementId: string,
  tenantId: string,
  audit: StockAuditContext,
  metadata: Record<string, string>,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      action,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      correlationId: audit.correlationId,
      ipAddress: audit.ipAddress ?? null,
      metadata,
      module: "inventory",
      result: "success",
      source: audit.source ?? "api",
      targetId: movementId,
      targetType: "stock_movement",
      tenantId,
      userAgent: audit.userAgent ?? null,
    },
    db
  );
}

export async function listStockLevelsByTenant(
  input: ListStockLevelsByTenantInput
): Promise<CursorPaginatedResult<StockLevelRecord>> {
  const db = getDb();
  const limit = Math.min(
    input.limit ?? STOCK_LEVEL_LIST_DEFAULT_LIMIT,
    STOCK_LEVEL_LIST_MAX_LIMIT
  );
  const fetchLimit = limit + 1;

  const conditions: SQL[] = [eq(stockLevels.tenantId, input.tenantId)];
  if (input.companyId !== undefined) {
    conditions.push(eq(stockLevels.companyId, input.companyId));
  }

  if (input.filter?.productId !== undefined) {
    conditions.push(eq(stockLevels.productId, input.filter.productId));
  }

  if (input.filter?.warehouseId !== undefined) {
    conditions.push(eq(stockLevels.warehouseId, input.filter.warehouseId));
  }

  if (input.cursor !== undefined) {
    const [cursorRow] = await db
      .select({
        id: stockLevels.id,
        updatedAt: stockLevels.updatedAt,
      })
      .from(stockLevels)
      .where(
        and(
          eq(stockLevels.tenantId, input.tenantId),
          eq(stockLevels.id, input.cursor)
        )
      )
      .limit(1);

    if (cursorRow === undefined) {
      return {
        hasMore: false,
        items: [],
        nextCursor: null,
      };
    }

    conditions.push(
      or(
        lt(stockLevels.updatedAt, cursorRow.updatedAt),
        and(
          eq(stockLevels.updatedAt, cursorRow.updatedAt),
          lt(stockLevels.id, cursorRow.id)
        )
      ) as SQL
    );
  }

  const orderClauses =
    input.cursor !== undefined ||
    input.sort === undefined ||
    input.sort.length === 0
      ? [desc(stockLevels.updatedAt), desc(stockLevels.id)]
      : resolveStockLevelOrderClauses(input.sort);

  const rows = await db
    .select({
      tenantId: stockLevels.tenantId,
      companyId: stockLevels.companyId,
      productId: stockLevels.productId,
      warehouseId: stockLevels.warehouseId,
      quantityOnHand: stockLevels.quantityOnHand,
      id: stockLevels.id,
    })
    .from(stockLevels)
    .where(and(...conditions))
    .orderBy(...orderClauses)
    .limit(fetchLimit);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const items = pageRows.map((row) =>
    mapStockLevelRow({
      tenantId: row.tenantId,
      companyId: row.companyId,
      productId: row.productId,
      warehouseId: row.warehouseId,
      quantityOnHand: row.quantityOnHand,
    })
  );
  const lastRow = pageRows.at(-1);

  return {
    hasMore,
    items,
    nextCursor: hasMore && lastRow !== undefined ? lastRow.id : null,
  };
}

function resolveStockLevelOrderClauses(
  sort: readonly StockLevelListSortField[]
) {
  const clauses = sort.flatMap((entry) => {
    const direction = entry.direction === "asc" ? asc : desc;
    switch (entry.field) {
      case "productId":
        return [direction(stockLevels.productId), desc(stockLevels.id)];
      case "quantityOnHand":
        return [direction(stockLevels.quantityOnHand), desc(stockLevels.id)];
      case "updatedAt":
        return [direction(stockLevels.updatedAt), desc(stockLevels.id)];
      default:
        return [];
    }
  });

  if (clauses.length === 0) {
    return [desc(stockLevels.updatedAt), desc(stockLevels.id)];
  }

  return clauses;
}

export async function recordStockMovement(
  input: RecordStockMovementInput
): Promise<StockMovementMutationResult> {
  const db = getDb();

  return db.transaction(async (tx) => {
    await assertStockMasterDataScope(input, tx);
    await assertSufficientQuantityOnHand(input, tx);

    const [movement] = await tx
      .insert(stockMovements)
      .values({
        tenantId: input.tenantId,
        companyId: input.companyId,
        productId: input.productId,
        warehouseId: input.warehouseId,
        movementType: input.movementType,
        quantityDelta: input.quantityDelta,
        reason: input.reason ?? null,
      })
      .returning({ id: stockMovements.id });

    if (!movement) {
      throw new Error("Stock movement insert did not return an identifier.");
    }

    const [level] = await tx
      .insert(stockLevels)
      .values({
        tenantId: input.tenantId,
        companyId: input.companyId,
        productId: input.productId,
        warehouseId: input.warehouseId,
        quantityOnHand: input.quantityDelta,
      })
      .onConflictDoUpdate({
        target: [
          stockLevels.tenantId,
          stockLevels.companyId,
          stockLevels.productId,
          stockLevels.warehouseId,
        ],
        set: {
          quantityOnHand: sql`${stockLevels.quantityOnHand} + ${input.quantityDelta}`,
          updatedAt: sql`now()`,
        },
      })
      .returning({ quantityOnHand: stockLevels.quantityOnHand });

    if (!level) {
      throw new Error("Stock level upsert did not return quantity on hand.");
    }

    await recordStockAuditEvent(
      "inventory.stock.adjust",
      movement.id,
      input.tenantId,
      input.audit,
      {
        companyId: input.companyId,
        movementType: input.movementType,
        productId: input.productId,
        quantityDelta: input.quantityDelta,
        warehouseId: input.warehouseId,
      },
      tx
    );

    return {
      movementId: movement.id,
      quantityOnHand: level.quantityOnHand,
    };
  });
}

export { STOCK_LEVELS_TENANT_COMPANY_PRODUCT_WAREHOUSE_UNIQUE_INDEX };
