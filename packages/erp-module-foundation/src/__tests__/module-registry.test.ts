import { describe, expect, it } from "vitest";
import {
  assertErpRuntimeModuleRegistry,
  buildProcurementFoundationBundle,
  collectErpRuntimeModuleRegistryFailures,
  defineErpRuntimeModule,
  defineErpRuntimeModuleRegistry,
  type ErpRuntimeModuleDefinition,
  type ModuleAuditMapDefinition,
  type ModuleEventCatalogDefinition,
  type ModuleOperationCatalogDefinition,
  ModuleRegistryAssertionError,
  REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE,
} from "../index.js";

const KV_CATALOG = {
  procurement: "KV-PROC",
  inventory: "KV-INV",
} as const;

function inventoryModule(
  overrides?: Partial<ErpRuntimeModuleDefinition>
): ErpRuntimeModuleDefinition {
  return defineErpRuntimeModule({
    slug: "inventory",
    kvId: "KV-INV",
    permissionNamespace: "inventory",
    routeSlug: "inventory",
    runtimePackage: "@afenda/inventory",
    wirePackage: "@afenda/kernel/erp-domain/inventory",
    ownerPackage: "@afenda/database",
    databaseOwner: "@afenda/database",
    appOwner: "apps/erp",
    permissionOwner: "@afenda/permissions",
    knowledgeOwner: "@afenda/enterprise-knowledge",
    lifecycle: "runtime",
    runtimeStatus: "foundation_authorized",
    ...overrides,
  });
}

describe("registry cross-module enforcement", () => {
  it("rejects duplicate wirePackage in registry definition", () => {
    const moduleA = defineErpRuntimeModule({
      slug: "procurement",
      kvId: "KV-PROC",
      permissionNamespace: "procurement",
      routeSlug: "procurement",
      runtimePackage: "@afenda/procurement",
      wirePackage: "@afenda/kernel/erp-domain/procurement",
      ownerPackage: "@afenda/procurement",
      databaseOwner: "@afenda/database",
      appOwner: "apps/erp",
      permissionOwner: "@afenda/permissions",
      knowledgeOwner: "@afenda/enterprise-knowledge",
      lifecycle: "foundation",
      runtimeStatus: "foundation_authorized",
    });
    const moduleB = {
      slug: "inventory",
      kvId: "KV-INV",
      permissionNamespace: "inventory",
      routeSlug: "inventory",
      runtimePackage: "@afenda/inventory",
      wirePackage: "@afenda/kernel/erp-domain/procurement",
      ownerPackage: "@afenda/database",
      databaseOwner: "@afenda/database",
      appOwner: "apps/erp",
      permissionOwner: "@afenda/permissions",
      knowledgeOwner: "@afenda/enterprise-knowledge",
      lifecycle: "runtime",
      runtimeStatus: "runtime_authorized",
    } as ErpRuntimeModuleDefinition;

    expect(() =>
      defineErpRuntimeModuleRegistry({ modules: [moduleA, moduleB] })
    ).toThrow(/wire package/);
  });

  it("detects duplicate audit actions across bundles", () => {
    const procurement = buildProcurementFoundationBundle();
    const sharedAction = "procurement.requisition.submitted";
    const inventoryBundle = {
      ...procurement,
      module: inventoryModule(),
      auditMap: {
        module: "inventory",
        kvId: "KV-INV",
        auditNamespaceMode: "module_prefixed",
        actions: [sharedAction],
      } as ModuleAuditMapDefinition,
    };

    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurement.module, inventoryModule()],
    });

    const failures = collectErpRuntimeModuleRegistryFailures({
      registry,
      erpDomainModuleKvIds: KV_CATALOG,
      bundles: [procurement, inventoryBundle],
      blockedModuleSlugs: [],
    });

    expect(failures.some((f) => f.includes("duplicate audit action"))).toBe(
      true
    );
  });

  it("detects duplicate events across bundles", () => {
    const procurement = buildProcurementFoundationBundle();
    const sharedEvent = "procurement.requisition.submitted";
    const inventoryBundle = {
      ...procurement,
      module: inventoryModule(),
      eventCatalog: {
        module: "inventory",
        events: [sharedEvent],
      } as ModuleEventCatalogDefinition,
    };

    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurement.module, inventoryModule()],
    });

    const failures = collectErpRuntimeModuleRegistryFailures({
      registry,
      erpDomainModuleKvIds: KV_CATALOG,
      bundles: [procurement, inventoryBundle],
    });

    expect(failures.some((f) => f.includes("duplicate event"))).toBe(true);
  });

  it("detects duplicate operationId across bundles", () => {
    const procurement = buildProcurementFoundationBundle();
    const sharedOperationId = "procurement.requisition.submit";
    const procurementWithOps = {
      ...procurement,
      operationCatalog: {
        module: "procurement",
        kvId: "KV-PROC",
        operations: [
          {
            operationId: sharedOperationId,
            permissionKey: "procurement.requisition_read",
            auditAction: "procurement.requisition.submitted",
            outboxDecision: "not_required",
            contextRequirement: "public_read_waived",
            contextWaiverReason: "read-only list surface",
            uiWaiver: true,
            testEvidence: "x.test.ts",
          },
        ],
      } as ModuleOperationCatalogDefinition,
    };
    const inventoryBundle = {
      ...procurementWithOps,
      module: inventoryModule(),
      operationCatalog: {
        module: "inventory",
        kvId: "KV-INV",
        operations: [
          {
            operationId: sharedOperationId,
            permissionKey: "procurement.requisition_read",
            auditAction: "procurement.requisition.submitted",
            outboxDecision: "not_required",
            contextRequirement: "public_read_waived",
            contextWaiverReason: "read-only list surface",
            uiWaiver: true,
            testEvidence: "x.test.ts",
          },
        ],
      } as ModuleOperationCatalogDefinition,
    };

    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurement.module, inventoryModule()],
    });

    const failures = collectErpRuntimeModuleRegistryFailures({
      registry,
      erpDomainModuleKvIds: KV_CATALOG,
      bundles: [procurementWithOps, inventoryBundle],
    });

    expect(failures.some((f) => f.includes("duplicate operationId"))).toBe(
      true
    );
  });

  it("passes partial catalog coverage when blocked waiver is declared", () => {
    const procurement = REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE;
    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurement.module],
    });

    const result = assertErpRuntimeModuleRegistry({
      registry,
      erpDomainModuleKvIds: KV_CATALOG,
      bundles: [procurement],
      blockedModuleSlugs: ["inventory"],
    });

    expect(result.ok).toBe(true);
  });

  it("rejects deprecated modules in active registry", () => {
    const deprecatedModule = defineErpRuntimeModule({
      slug: "procurement",
      kvId: "KV-PROC",
      permissionNamespace: "procurement",
      routeSlug: "procurement",
      runtimePackage: "@afenda/procurement",
      wirePackage: "@afenda/kernel/erp-domain/procurement",
      ownerPackage: "@afenda/procurement",
      databaseOwner: "@afenda/database",
      appOwner: "apps/erp",
      permissionOwner: "@afenda/permissions",
      knowledgeOwner: "@afenda/enterprise-knowledge",
      lifecycle: "foundation",
      runtimeStatus: "deprecated",
    });
    const registry = defineErpRuntimeModuleRegistry({
      modules: [deprecatedModule],
    });

    expect(() =>
      assertErpRuntimeModuleRegistry({
        registry,
        erpDomainModuleKvIds: { procurement: "KV-PROC" },
        bundles: [],
      })
    ).toThrow(ModuleRegistryAssertionError);
  });

  it("flags catalog slug missing when requireFullCatalogCoverage is enabled", () => {
    const procurement = buildProcurementFoundationBundle();
    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurement.module],
    });

    const failures = collectErpRuntimeModuleRegistryFailures({
      registry,
      erpDomainModuleKvIds: KV_CATALOG,
      bundles: [procurement],
      requireFullCatalogCoverage: true,
    });

    expect(
      failures.some((f) => f.includes('catalog slug "inventory" missing'))
    ).toBe(true);
  });

  it("runs per-bundle readiness inside registry assert", () => {
    const procurement = buildProcurementFoundationBundle();
    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurement.module],
    });
    const brokenBundle = {
      ...procurement,
      outboxContract: {
        ...procurement.outboxContract,
        entries: [
          {
            event: "procurement.unknown.event",
            requirement: "required" as const,
          },
        ],
      },
    };

    const failures = collectErpRuntimeModuleRegistryFailures({
      registry,
      erpDomainModuleKvIds: { procurement: "KV-PROC" },
      bundles: [brokenBundle],
    });

    expect(
      failures.some(
        (f) =>
          f.includes('registry bundle "procurement"') && f.includes("outbox")
      )
    ).toBe(true);
  });
});
