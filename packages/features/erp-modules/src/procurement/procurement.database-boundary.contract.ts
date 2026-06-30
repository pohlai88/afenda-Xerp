/** ERP-PROC-OP-003 — planned database boundary declaration (serializable; zero runtime deps). */

export const PROCUREMENT_DATABASE_BOUNDARY_SLICE_ID =
  "ERP-PROC-OP-003" as const;

export const PROCUREMENT_DATABASE_BOUNDARY_STATUS = "declared" as const;

interface PlannedDatabaseTable {
  readonly canonicalIdField: string;
  readonly companyScoped: boolean;
  readonly internalPkField: string;
  readonly migrationStatus: "deferred";
  readonly plannedSchemaPath: string;
  readonly rlsExpectation: string;
  readonly tableName: string;
  readonly tenantScoped: true;
}

interface ProcurementDatabaseBoundaryContract {
  readonly kvId: string;
  readonly module: string;
  readonly schemaOwner: string;
  readonly tables: readonly PlannedDatabaseTable[];
}

export const PROCUREMENT_DATABASE_BOUNDARY_CONTRACT = {
  schemaOwner: "@afenda/database",
  kvId: "KV-PROC",
  module: "procurement",
  tables: [
    {
      tableName: "suppliers",
      tenantScoped: true,
      companyScoped: true,
      canonicalIdField: "supplier_id",
      internalPkField: "id",
      rlsExpectation:
        "tenant_company_isolation — promote from PLATFORM_ENTITY_TABLE_REGISTRY deferred row after RLS ADR",
      migrationStatus: "deferred",
      plannedSchemaPath: "packages/database/src/schema/supplier.schema.ts",
    },
    {
      tableName: "purchase_requisitions",
      tenantScoped: true,
      companyScoped: true,
      canonicalIdField: "requisition_id",
      internalPkField: "id",
      rlsExpectation: "tenant_company_isolation — RLS ADR pending",
      migrationStatus: "deferred",
      plannedSchemaPath:
        "packages/database/src/schema/purchase-requisition.schema.ts",
    },
    {
      tableName: "purchase_orders",
      tenantScoped: true,
      companyScoped: true,
      canonicalIdField: "purchase_order_id",
      internalPkField: "id",
      rlsExpectation: "tenant_company_isolation — RLS ADR pending",
      migrationStatus: "deferred",
      plannedSchemaPath:
        "packages/database/src/schema/purchase-order.schema.ts",
    },
    {
      tableName: "procurement_rfqs",
      tenantScoped: true,
      companyScoped: true,
      canonicalIdField: "rfq_id",
      internalPkField: "id",
      rlsExpectation: "tenant_company_isolation — RLS ADR pending",
      migrationStatus: "deferred",
      plannedSchemaPath:
        "packages/database/src/schema/procurement-rfq.schema.ts",
    },
  ],
} as const satisfies ProcurementDatabaseBoundaryContract;

export const PROCUREMENT_DATABASE_BOUNDARY_ATTESTATION = {
  sliceId: PROCUREMENT_DATABASE_BOUNDARY_SLICE_ID,
  status: PROCUREMENT_DATABASE_BOUNDARY_STATUS,
  authorizedAt: "2026-06-30",
  schemaOwner: PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.schemaOwner,
  contractPath:
    "packages/features/erp-modules/src/procurement/procurement.database-boundary.contract.ts",
  migrationsProhibitedUntil:
    "RLS ADR acceptance + authorized ERP-MODULES migration slice",
  adrAuthority: "docs/adr/ADR-0031-procurement-runtime-authority-boundary.md",
} as const;
