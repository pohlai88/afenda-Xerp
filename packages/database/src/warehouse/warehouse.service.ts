import { and, eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { rethrowPostgresUniqueViolation } from "../postgres/postgres-error.contract.js";
import { companies } from "../schema/company.schema.js";
import {
  WAREHOUSES_TENANT_COMPANY_CODE_UNIQUE_INDEX,
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
      [WAREHOUSES_TENANT_COMPANY_CODE_UNIQUE_INDEX]: () =>
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
      [WAREHOUSES_TENANT_COMPANY_CODE_UNIQUE_INDEX]: () =>
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
  input: {
    readonly companyId: string;
    readonly limit?: number;
    readonly tenantId: string;
  },
  db: AfendaDatabase = getDb()
): Promise<readonly WarehouseAuthorityRecord[]> {
  const limit = Math.min(
    input.limit ?? WAREHOUSE_LIST_DEFAULT_LIMIT,
    WAREHOUSE_LIST_DEFAULT_LIMIT
  );

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
    .where(
      and(
        eq(warehouses.tenantId, input.tenantId),
        eq(warehouses.companyId, input.companyId)
      )
    )
    .limit(limit);

  return rows.map(mapWarehouseRow);
}
