import { describe, expect, it } from "vitest";
import {
  assertModuleStatusRequirements,
  buildProcurementFoundationBundle,
  collectModuleStatusRequirementFailures,
  defineErpRuntimeModule,
  defineModuleDatabaseBoundary,
  defineModuleOperationCatalog,
  defineModulePermissionBinding,
} from "../index.js";

function verifiedModule(
  bundle: ReturnType<typeof buildProcurementFoundationBundle>
) {
  return defineErpRuntimeModule({
    ...bundle.module,
    runtimeStatus: "foundation_verified",
    lifecycle: "foundation",
  });
}

describe("collectModuleStatusRequirementFailures", () => {
  it("passes for foundation_authorized with deferred permission parity", () => {
    const bundle = buildProcurementFoundationBundle();
    expect(collectModuleStatusRequirementFailures(bundle)).toEqual([]);
  });

  it("fails foundation_verified when permissionParity is deferred", () => {
    const bundle = buildProcurementFoundationBundle();
    const verified = {
      ...bundle,
      module: verifiedModule(bundle),
    };
    const failures = collectModuleStatusRequirementFailures(verified);
    expect(failures.some((f) => f.includes("permissionParity"))).toBe(true);
  });

  it("fails foundation_verified without contextSpineConsumer", () => {
    const bundle = buildProcurementFoundationBundle();
    const { contextSpineConsumer: _, ...withoutSpine } = bundle;
    const verified = {
      ...withoutSpine,
      module: verifiedModule(bundle),
      permissionBinding: defineModulePermissionBinding({
        ...bundle.permissionBinding,
        permissionParity: "subset_allowed",
        registryPermissionKeys: ["procurement.requisition_read"],
      }),
    };
    const failures = collectModuleStatusRequirementFailures(verified);
    expect(failures.some((f) => f.includes("contextSpineConsumer"))).toBe(true);
  });

  it("fails runtime_authorized without databaseBoundary", () => {
    const bundle = buildProcurementFoundationBundle();
    const runtime = {
      ...bundle,
      module: defineErpRuntimeModule({
        ...bundle.module,
        runtimeStatus: "runtime_authorized",
        lifecycle: "runtime",
      }),
      permissionBinding: defineModulePermissionBinding({
        module: "procurement",
        kvId: "KV-PROC",
        permissionNamespace: "procurement",
        permissionParity: "exact",
        kernelPermissionKeys: ["procurement.requisition_read"],
        registryPermissionKeys: ["procurement.requisition_read"],
      }),
    };
    const failures = collectModuleStatusRequirementFailures(runtime);
    expect(failures.some((f) => f.includes("databaseBoundary"))).toBe(true);
  });

  it("fails runtime_authorized without operationCatalog", () => {
    const bundle = buildProcurementFoundationBundle();
    const runtime = {
      ...bundle,
      module: defineErpRuntimeModule({
        ...bundle.module,
        runtimeStatus: "runtime_authorized",
        lifecycle: "runtime",
      }),
      permissionBinding: defineModulePermissionBinding({
        module: "procurement",
        kvId: "KV-PROC",
        permissionNamespace: "procurement",
        permissionParity: "exact",
        kernelPermissionKeys: ["procurement.requisition_read"],
        registryPermissionKeys: ["procurement.requisition_read"],
      }),
      databaseBoundary: defineModuleDatabaseBoundary({
        module: "procurement",
        kvId: "KV-PROC",
        tables: [
          {
            tableName: "purchase_requisitions",
            tenantScoped: true,
            companyScoped: true,
            canonicalIdField: "requisition_id",
            internalPkField: "id",
            rlsExpectation: "tenant_company_isolation",
            migrationPath: "packages/database/src/migrations/procurement/x.sql",
            ownershipRegistryRow: "PKGR05",
            auditFields: ["created_at"],
          },
        ],
      }),
    };
    const failures = collectModuleStatusRequirementFailures(runtime);
    expect(failures.some((f) => f.includes("operationCatalog"))).toBe(true);
  });

  it("passes runtime_authorized when all runtime artifacts present", () => {
    const bundle = buildProcurementFoundationBundle();
    const runtime = {
      ...bundle,
      module: defineErpRuntimeModule({
        ...bundle.module,
        runtimeStatus: "runtime_authorized",
        lifecycle: "runtime",
      }),
      permissionBinding: defineModulePermissionBinding({
        module: "procurement",
        kvId: "KV-PROC",
        permissionNamespace: "procurement",
        permissionParity: "exact",
        kernelPermissionKeys: ["procurement.requisition_read"],
        registryPermissionKeys: ["procurement.requisition_read"],
      }),
      databaseBoundary: defineModuleDatabaseBoundary({
        module: "procurement",
        kvId: "KV-PROC",
        tables: [
          {
            tableName: "purchase_requisitions",
            tenantScoped: true,
            companyScoped: true,
            canonicalIdField: "requisition_id",
            internalPkField: "id",
            rlsExpectation: "tenant_company_isolation",
            migrationPath: "packages/database/src/migrations/procurement/x.sql",
            ownershipRegistryRow: "PKGR05",
            auditFields: ["created_at"],
          },
        ],
      }),
      operationCatalog: defineModuleOperationCatalog({
        module: "procurement",
        kvId: "KV-PROC",
        operations: [
          {
            operationId: "procurement.requisition.submit",
            permissionKey: "procurement.requisition_read",
            auditAction: "procurement.requisition.submitted",
            outboxDecision: "not_required",
            contextRequirement: "required",
            uiWaiver: true,
            testEvidence:
              "packages/erp-module-foundation/src/__tests__/x.test.ts",
          },
        ],
      }),
    };
    expect(() => assertModuleStatusRequirements(runtime)).not.toThrow();
  });

  it("skips checks for wire_only status", () => {
    const bundle = buildProcurementFoundationBundle();
    expect(collectModuleStatusRequirementFailures(bundle)).toEqual([]);
  });

  it("skips checks for blocked status", () => {
    const bundle = buildProcurementFoundationBundle();
    const blocked = {
      ...bundle,
      module: defineErpRuntimeModule({
        ...bundle.module,
        runtimeStatus: "blocked",
      }),
    };
    expect(collectModuleStatusRequirementFailures(blocked)).toEqual([]);
  });
});
