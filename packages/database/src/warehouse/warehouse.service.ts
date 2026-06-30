import { and, asc, desc, eq, ilike, lt, or, type SQL } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { rethrowPostgresUniqueViolation } from "../postgres/postgres-error.contract.js";
import { companies } from "../schema/company.schema.js";
import {
  WAREHOUSES_TENANT_WAREHOUSE_CODE_UNIQUE_INDEX,
  warehouses,
} from "../schema/warehouse.schema.js";
import {
  buildWarehouseInsertRow,
  buildWarehouseUpdatePatch,
  type WarehouseAuthorityRecord,
  type WarehouseUpdatePatch,
  type WarehouseWriteInput,
} from "./warehouse.contract.js";

export class WarehouseScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WarehouseScopeMismatchError";
  }
}

export class WarehouseNotFoundError extends Error {
  constructor(warehouseId: string) {
    super(`Warehouse "${warehouseId}" was not found.`);
    this.name = "WarehouseNotFoundError";
  }
}

export class WarehouseCodeConflictError extends Error {
  constructor(warehouseCode: string) {
    super(
      warehouseCode.length > 0
        ? `Warehouse code "${warehouseCode}" already exists for this company.`
        : "Warehouse code already exists for this company."
    );
    this.name = "WarehouseCodeConflictError";
  }
}

export interface WarehouseAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertWarehouseInput = WarehouseWriteInput & {
  readonly audit: WarehouseAuditContext;
};

export type UpdateWarehouseInput = WarehouseUpdatePatch & {
  readonly audit: WarehouseAuditContext;
};

export interface WarehouseMutationResult {
  readonly id: string;
}

const WAREHOUSE_LIST_DEFAULT_LIMIT = 100;
const WAREHOUSE_LIST_MAX_LIMIT = 100;

export interface WarehouseListSortField {
  readonly direction: "asc" | "desc";
  readonly field: "displayName" | "updatedAt" | "warehouseCode";
}

export interface ListWarehousesByTenantCompanyInput {
  readonly companyId: string;
  readonly cursor?: string;
  readonly filter?: {
    readonly status?: string;
  };
  readonly limit?: number;
  readonly q?: string;
  readonly sort?: readonly WarehouseListSortField[];
  readonly tenantId: string;
}

export interface CursorPaginatedResult<TItem> {
  readonly hasMore: boolean;
  readonly items: readonly TItem[];
  readonly nextCursor: string | null;
}

function mapWarehouseRow(row: {
  id: string;
  tenantId: string;
  companyId: string;
  warehouseCode: string;
  displayName: string;
  status: WarehouseAuthorityRecord["status"];
}): WarehouseAuthorityRecord {
  return {
    warehouseId: row.id,
    tenantId: row.tenantId,
    companyId: row.companyId,
    warehouseCode: row.warehouseCode,
    displayName: row.displayName,
    status: row.status,
  };
}

async function assertWarehouseCompanyScope(
  tenantId: string,
  companyId: string,
  db: AfendaDatabase
): Promise<void> {
  const [company] = await db
    .select({ tenantId: companies.tenantId })
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (!company || company.tenantId !== tenantId) {
    throw new WarehouseScopeMismatchError(
      "Warehouse company must belong to the warehouse tenant."
    );
  }
}

async function recordWarehouseAuditEvent(
  action: "inventory.warehouse.create" | "inventory.warehouse.update",
  warehouseId: string,
  tenantId: string,
  audit: WarehouseAuditContext,
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
      targetType: "warehouse",
      targetId: warehouseId,
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

export async function insertWarehouse(
  input: InsertWarehouseInput,
  db: AfendaDatabase = getDb()
): Promise<WarehouseMutationResult> {
  const row = buildWarehouseInsertRow(input);
  await assertWarehouseCompanyScope(row.tenantId, row.companyId, db);

  let inserted: {
    id: string;
    tenantId: string;
    companyId: string;
    warehouseCode: string;
    displayName: string;
    status: WarehouseAuthorityRecord["status"];
  };

  try {
    const [result] = await db.insert(warehouses).values(row).returning({
      id: warehouses.id,
      tenantId: warehouses.tenantId,
      companyId: warehouses.companyId,
      warehouseCode: warehouses.warehouseCode,
      displayName: warehouses.displayName,
      status: warehouses.status,
    });

    if (!result) {
      throw new Error("Warehouse insert did not return a row id.");
    }

    inserted = result;
  } catch (error: unknown) {
    rethrowPostgresUniqueViolation(error, {
      [WAREHOUSES_TENANT_WAREHOUSE_CODE_UNIQUE_INDEX]: () =>
        new WarehouseCodeConflictError(row.warehouseCode),
    });
  }

  await recordWarehouseAuditEvent(
    "inventory.warehouse.create",
    inserted.id,
    inserted.tenantId,
    input.audit,
    {
      companyId: inserted.companyId,
      warehouseCode: inserted.warehouseCode,
      displayName: inserted.displayName,
      status: inserted.status,
    },
    db
  );

  return { id: inserted.id };
}

export async function updateWarehouse(
  warehouseId: string,
  tenantId: string,
  input: UpdateWarehouseInput,
  db: AfendaDatabase = getDb()
): Promise<WarehouseMutationResult> {
  const patch = buildWarehouseUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Warehouse update requires at least one field.");
  }

  let updated: { id: string };

  try {
    const [result] = await db
      .update(warehouses)
      .set(patch)
      .where(
        and(eq(warehouses.id, warehouseId), eq(warehouses.tenantId, tenantId))
      )
      .returning({ id: warehouses.id });

    if (!result) {
      throw new WarehouseNotFoundError(warehouseId);
    }

    updated = result;
  } catch (error: unknown) {
    if (error instanceof WarehouseNotFoundError) {
      throw error;
    }

    rethrowPostgresUniqueViolation(error, {
      [WAREHOUSES_TENANT_WAREHOUSE_CODE_UNIQUE_INDEX]: () =>
        new WarehouseCodeConflictError(patch.warehouseCode ?? ""),
    });
  }

  await recordWarehouseAuditEvent(
    "inventory.warehouse.update",
    updated.id,
    tenantId,
    input.audit,
    {
      warehouseCode: patch.warehouseCode ?? null,
      displayName: patch.displayName ?? null,
      status: patch.status ?? null,
    },
    db
  );

  return { id: updated.id };
}

export async function findWarehouseById(
  input: { readonly tenantId: string; readonly warehouseId: string },
  db: AfendaDatabase = getDb()
): Promise<WarehouseAuthorityRecord | null> {
  const [row] = await db
    .select({
      id: warehouses.id,
      tenantId: warehouses.tenantId,
      companyId: warehouses.companyId,
      warehouseCode: warehouses.warehouseCode,
      displayName: warehouses.displayName,
      status: warehouses.status,
    })
    .from(warehouses)
    .where(
      and(
        eq(warehouses.id, input.warehouseId),
        eq(warehouses.tenantId, input.tenantId)
      )
    )
    .limit(1);

  return row ? mapWarehouseRow(row) : null;
}

export async function listWarehousesByTenantCompany(
  input: ListWarehousesByTenantCompanyInput,
  db: AfendaDatabase = getDb()
): Promise<CursorPaginatedResult<WarehouseAuthorityRecord>> {
  const limit = Math.min(
    input.limit ?? WAREHOUSE_LIST_DEFAULT_LIMIT,
    WAREHOUSE_LIST_MAX_LIMIT
  );
  const fetchLimit = limit + 1;

  const conditions: SQL[] = [
    eq(warehouses.tenantId, input.tenantId),
    eq(warehouses.companyId, input.companyId),
  ];

  if (input.filter?.status !== undefined) {
    conditions.push(
      eq(
        warehouses.status,
        input.filter.status as WarehouseAuthorityRecord["status"]
      )
    );
  }

  if (input.q !== undefined && input.q.trim().length > 0) {
    const pattern = `%${input.q.trim()}%`;
    conditions.push(
      or(
        ilike(warehouses.warehouseCode, pattern),
        ilike(warehouses.displayName, pattern)
      ) as SQL
    );
  }

  if (input.cursor !== undefined) {
    const [cursorRow] = await db
      .select({
        createdAt: warehouses.createdAt,
        id: warehouses.id,
      })
      .from(warehouses)
      .where(
        and(
          eq(warehouses.tenantId, input.tenantId),
          eq(warehouses.companyId, input.companyId),
          eq(warehouses.id, input.cursor)
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
        lt(warehouses.createdAt, cursorRow.createdAt),
        and(
          eq(warehouses.createdAt, cursorRow.createdAt),
          lt(warehouses.id, cursorRow.id)
        )
      ) as SQL
    );
  }

  const orderClauses =
    input.cursor !== undefined ||
    input.sort === undefined ||
    input.sort.length === 0
      ? [desc(warehouses.createdAt), desc(warehouses.id)]
      : resolveWarehouseOrderClauses(input.sort);

  const rows = await db
    .select({
      id: warehouses.id,
      tenantId: warehouses.tenantId,
      companyId: warehouses.companyId,
      warehouseCode: warehouses.warehouseCode,
      displayName: warehouses.displayName,
      status: warehouses.status,
    })
    .from(warehouses)
    .where(and(...conditions))
    .orderBy(...orderClauses)
    .limit(fetchLimit);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const items = pageRows.map(mapWarehouseRow);
  const lastItem = items.at(-1);

  return {
    hasMore,
    items,
    nextCursor: hasMore && lastItem !== undefined ? lastItem.warehouseId : null,
  };
}

function resolveWarehouseOrderClauses(sort: readonly WarehouseListSortField[]) {
  const clauses = sort.flatMap((entry) => {
    const direction = entry.direction === "asc" ? asc : desc;
    switch (entry.field) {
      case "displayName":
        return [direction(warehouses.displayName), desc(warehouses.id)];
      case "warehouseCode":
        return [direction(warehouses.warehouseCode), desc(warehouses.id)];
      case "updatedAt":
        return [direction(warehouses.updatedAt), desc(warehouses.id)];
      default:
        return [];
    }
  });

  if (clauses.length === 0) {
    return [desc(warehouses.createdAt), desc(warehouses.id)];
  }

  return clauses;
}
