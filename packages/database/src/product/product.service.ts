import { and, asc, desc, eq, ilike, lt, or, type SQL } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { rethrowPostgresUniqueViolation } from "../postgres/postgres-error.contract.js";
import {
  PRODUCTS_TENANT_SKU_UNIQUE_INDEX,
  products,
} from "../schema/product.schema.js";
import {
  buildProductInsertRow,
  buildProductUpdatePatch,
  type ProductAuthorityRecord,
  type ProductUpdatePatch,
  type ProductWriteInput,
} from "./product.contract.js";

export class ProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`Product "${productId}" was not found.`);
    this.name = "ProductNotFoundError";
  }
}

export class ProductSkuConflictError extends Error {
  constructor(sku: string) {
    super(
      sku.length > 0
        ? `Product SKU "${sku}" already exists for this tenant.`
        : "Product SKU already exists for this tenant."
    );
    this.name = "ProductSkuConflictError";
  }
}

export interface ProductAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertProductInput = ProductWriteInput & {
  readonly audit: ProductAuditContext;
};

export type UpdateProductInput = ProductUpdatePatch & {
  readonly audit: ProductAuditContext;
};

export interface ProductMutationResult {
  readonly id: string;
}

const PRODUCT_LIST_DEFAULT_LIMIT = 100;
const PRODUCT_LIST_MAX_LIMIT = 100;

export interface ProductListSortField {
  readonly direction: "asc" | "desc";
  readonly field: "displayName" | "sku" | "updatedAt";
}

export interface ListProductsByTenantInput {
  readonly cursor?: string;
  readonly filter?: {
    readonly status?: string;
  };
  readonly limit?: number;
  readonly q?: string;
  readonly sort?: readonly ProductListSortField[];
  readonly tenantId: string;
}

export interface CursorPaginatedResult<TItem> {
  readonly hasMore: boolean;
  readonly items: readonly TItem[];
  readonly nextCursor: string | null;
}

function mapProductRow(row: {
  id: string;
  tenantId: string;
  sku: string;
  displayName: string;
  status: ProductAuthorityRecord["status"];
}): ProductAuthorityRecord {
  return {
    productId: row.id,
    tenantId: row.tenantId,
    sku: row.sku,
    displayName: row.displayName,
    status: row.status,
  };
}

async function recordProductAuditEvent(
  action: "inventory.product.create" | "inventory.product.update",
  productId: string,
  tenantId: string,
  audit: ProductAuditContext,
  metadata: Record<string, string | null>,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      tenantId,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "inventory",
      action,
      targetType: "product",
      targetId: productId,
      result: "success",
      source: audit.source ?? "api",
      correlationId: audit.correlationId,
      ipAddress: audit.ipAddress ?? null,
      userAgent: audit.userAgent ?? null,
      metadata,
    },
    db
  );
}

export async function insertProduct(
  input: InsertProductInput,
  db: AfendaDatabase = getDb()
): Promise<ProductMutationResult> {
  const row = buildProductInsertRow(input);

  let inserted: {
    id: string;
    tenantId: string;
    sku: string;
    displayName: string;
    status: ProductAuthorityRecord["status"];
  };

  try {
    const [result] = await db.insert(products).values(row).returning({
      id: products.id,
      tenantId: products.tenantId,
      sku: products.sku,
      displayName: products.displayName,
      status: products.status,
    });

    if (!result) {
      throw new Error("Product insert did not return a row id.");
    }

    inserted = result;
  } catch (error: unknown) {
    rethrowPostgresUniqueViolation(error, {
      [PRODUCTS_TENANT_SKU_UNIQUE_INDEX]: () =>
        new ProductSkuConflictError(row.sku),
    });
  }

  await recordProductAuditEvent(
    "inventory.product.create",
    inserted.id,
    inserted.tenantId,
    input.audit,
    {
      sku: inserted.sku,
      displayName: inserted.displayName,
      status: inserted.status,
    },
    db
  );

  return { id: inserted.id };
}

export async function updateProduct(
  productId: string,
  tenantId: string,
  input: UpdateProductInput,
  db: AfendaDatabase = getDb()
): Promise<ProductMutationResult> {
  const patch = buildProductUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Product update requires at least one field.");
  }

  let updated: { id: string };

  try {
    const [result] = await db
      .update(products)
      .set(patch)
      .where(and(eq(products.id, productId), eq(products.tenantId, tenantId)))
      .returning({ id: products.id });

    if (!result) {
      throw new ProductNotFoundError(productId);
    }

    updated = result;
  } catch (error: unknown) {
    if (error instanceof ProductNotFoundError) {
      throw error;
    }

    rethrowPostgresUniqueViolation(error, {
      [PRODUCTS_TENANT_SKU_UNIQUE_INDEX]: () =>
        new ProductSkuConflictError(patch.sku ?? productId),
    });
  }

  await recordProductAuditEvent(
    "inventory.product.update",
    updated.id,
    tenantId,
    input.audit,
    {
      sku: patch.sku ?? null,
      displayName: patch.displayName ?? null,
      status: patch.status ?? null,
    },
    db
  );

  return { id: updated.id };
}

export async function findProductById(
  input: { readonly productId: string; readonly tenantId: string },
  db: AfendaDatabase = getDb()
): Promise<ProductAuthorityRecord | null> {
  const [row] = await db
    .select({
      id: products.id,
      tenantId: products.tenantId,
      sku: products.sku,
      displayName: products.displayName,
      status: products.status,
    })
    .from(products)
    .where(
      and(
        eq(products.id, input.productId),
        eq(products.tenantId, input.tenantId)
      )
    )
    .limit(1);

  return row ? mapProductRow(row) : null;
}

export async function listProductsByTenant(
  input: ListProductsByTenantInput,
  db: AfendaDatabase = getDb()
): Promise<CursorPaginatedResult<ProductAuthorityRecord>> {
  const limit = Math.min(
    input.limit ?? PRODUCT_LIST_DEFAULT_LIMIT,
    PRODUCT_LIST_MAX_LIMIT
  );
  const fetchLimit = limit + 1;

  const conditions: SQL[] = [eq(products.tenantId, input.tenantId)];

  if (input.filter?.status !== undefined) {
    conditions.push(
      eq(
        products.status,
        input.filter.status as ProductAuthorityRecord["status"]
      )
    );
  }

  if (input.q !== undefined && input.q.trim().length > 0) {
    const pattern = `%${input.q.trim()}%`;
    conditions.push(
      or(
        ilike(products.sku, pattern),
        ilike(products.displayName, pattern)
      ) as SQL
    );
  }

  if (input.cursor !== undefined) {
    const [cursorRow] = await db
      .select({
        createdAt: products.createdAt,
        id: products.id,
      })
      .from(products)
      .where(
        and(
          eq(products.tenantId, input.tenantId),
          eq(products.id, input.cursor)
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
        lt(products.createdAt, cursorRow.createdAt),
        and(
          eq(products.createdAt, cursorRow.createdAt),
          lt(products.id, cursorRow.id)
        )
      ) as SQL
    );
  }

  const orderClauses =
    input.cursor !== undefined ||
    input.sort === undefined ||
    input.sort.length === 0
      ? [desc(products.createdAt), desc(products.id)]
      : resolveProductOrderClauses(input.sort);

  const rows = await db
    .select({
      id: products.id,
      tenantId: products.tenantId,
      sku: products.sku,
      displayName: products.displayName,
      status: products.status,
    })
    .from(products)
    .where(and(...conditions))
    .orderBy(...orderClauses)
    .limit(fetchLimit);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const items = pageRows.map(mapProductRow);
  const lastItem = items.at(-1);

  return {
    hasMore,
    items,
    nextCursor: hasMore && lastItem !== undefined ? lastItem.productId : null,
  };
}

function resolveProductOrderClauses(
  sort: readonly ProductListSortField[] | undefined
) {
  const clauses =
    sort === undefined || sort.length === 0
      ? [desc(products.createdAt), desc(products.id)]
      : sort.flatMap((entry) => {
          const direction = entry.direction === "asc" ? asc : desc;
          switch (entry.field) {
            case "displayName":
              return [direction(products.displayName), desc(products.id)];
            case "sku":
              return [direction(products.sku), desc(products.id)];
            case "updatedAt":
              return [direction(products.updatedAt), desc(products.id)];
            default:
              return [];
          }
        });

  if (clauses.length === 0) {
    return [desc(products.createdAt), desc(products.id)];
  }

  return clauses;
}
