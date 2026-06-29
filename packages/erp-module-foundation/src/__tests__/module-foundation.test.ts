import { describe, expect, it } from "vitest";
import {
  assertErpRuntimeModuleRegistry,
  assertModuleReadiness,
  buildProcurementFoundationBundle,
  collectModuleReadinessFailures,
  defineErpRuntimeModule,
  defineErpRuntimeModuleRegistry,
  defineModuleAuditMap,
  defineModuleMetadataBinding,
  defineModuleOutboxContract,
  defineModulePermissionBinding,
  ModuleReadinessAssertionError,
  ModuleRegistryAssertionError,
} from "../index.js";

const PAS_001B_KV_CATALOG = {
  procurement: "KV-PROC",
  inventory: "KV-INV",
  accounting: "KV-ACCT",
} as const;

const PROCUREMENT_KERNEL_PERMISSION_KEYS = [
  "procurement.requisition_read",
  "procurement.requisition_create",
  "procurement.purchaseOrder_read",
] as const;

function baseModuleInput(
  overrides?: Partial<Parameters<typeof defineErpRuntimeModule>[0]>
) {
  return {
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
    lifecycle: "foundation" as const,
    runtimeStatus: "foundation_authorized" as const,
    ...overrides,
  };
}

describe("erp-module-foundation define helpers", () => {
  it("defines a governed ERP runtime module identity with KV catalog parity", () => {
    const module = defineErpRuntimeModule({
      ...baseModuleInput(),
      erpDomainModuleKvIds: PAS_001B_KV_CATALOG,
    });

    expect(module.kvId).toBe("KV-PROC");
    expect(module.permissionNamespace).toBe("procurement");
  });

  it("rejects KV catalog mismatch", () => {
    expect(() =>
      defineErpRuntimeModule({
        ...baseModuleInput({ kvId: "KV-INV" }),
        erpDomainModuleKvIds: PAS_001B_KV_CATALOG,
      })
    ).toThrow(/KV catalog parity/);
  });

  it("enforces exact permission parity when configured", () => {
    expect(() =>
      defineModulePermissionBinding({
        module: "procurement",
        kvId: "KV-PROC",
        permissionNamespace: "procurement",
        permissionParity: "exact",
        kernelPermissionKeys: [...PROCUREMENT_KERNEL_PERMISSION_KEYS],
        registryPermissionKeys: ["procurement.requisition_read"],
      })
    ).toThrow(/permission parity exact/);
  });

  it("rejects empty registryPermissionKeys when subset_allowed", () => {
    expect(() =>
      defineModulePermissionBinding({
        module: "procurement",
        kvId: "KV-PROC",
        permissionNamespace: "procurement",
        permissionParity: "subset_allowed",
        kernelPermissionKeys: [...PROCUREMENT_KERNEL_PERMISSION_KEYS],
        registryPermissionKeys: [],
      })
    ).toThrow(/non-empty registryPermissionKeys/);
  });

  it("rejects non-prefixed audit actions in module_prefixed mode", () => {
    expect(() =>
      defineModuleAuditMap({
        module: "procurement",
        kvId: "KV-PROC",
        actions: ["requisition.submitted"],
      })
    ).toThrow(/must be prefixed/);
  });

  it("rejects weak metadata routes", () => {
    expect(() =>
      defineModuleMetadataBinding({
        module: "procurement",
        kvId: "KV-PROC",
        surfaces: [
          {
            surfaceId: "procurement.test",
            route: "/system/procurement-test",
            routeKind: "erp_module_page",
            permissionKey: "procurement.requisition_read",
            operatingContextRequired: true,
          },
        ],
      })
    ).toThrow(/erp_module_page route must match/);
  });

  it("collects outbox failures when event is missing from catalog", () => {
    const bundle = buildProcurementFoundationBundle();
    const broken = {
      ...bundle,
      outboxContract: defineModuleOutboxContract({
        module: "procurement",
        entries: [
          {
            event: "procurement.unknown.event",
            requirement: "required",
          },
        ],
      }),
    };

    const failures = collectModuleReadinessFailures(broken);
    expect(failures.some((failure) => failure.includes("outbox event"))).toBe(
      true
    );
  });
});

describe("assertModuleReadiness", () => {
  it("passes when required dimensions have evidence", () => {
    const result = assertModuleReadiness(
      buildProcurementFoundationBundle({
        authority:
          "docs/PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md",
        knowledge: "packages/enterprise-knowledge/src/data/atoms.json",
        ownership:
          "docs/PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md",
        contextSpine:
          "apps/erp/src/lib/context/resolve-operating-context.server.ts",
        permissions:
          "packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts",
        audit:
          "packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts",
        tests:
          "packages/erp-module-foundation/src/__tests__/module-foundation.test.ts",
        gates: "scripts/governance/check-procurement-domain-contracts.mts",
      })
    );

    expect(result.ok).toBe(true);
    expect(result.module).toBe("procurement");
  });

  it("fails when required readiness evidence is missing", () => {
    const bundle = buildProcurementFoundationBundle();

    expect(() => assertModuleReadiness(bundle)).toThrow(
      ModuleReadinessAssertionError
    );

    const failures = collectModuleReadinessFailures(bundle);
    expect(failures.some((failure) => failure.includes("authority"))).toBe(
      true
    );
  });
});

describe("assertErpRuntimeModuleRegistry", () => {
  it("passes for non-duplicated registry entries with KV catalog parity", () => {
    const procurement = defineErpRuntimeModule(baseModuleInput());
    const registry = defineErpRuntimeModuleRegistry({ modules: [procurement] });
    const bundle = buildProcurementFoundationBundle({
      authority: "docs/PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md",
      knowledge: "packages/enterprise-knowledge/src/data/atoms.json",
      ownership:
        "docs/PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md",
      contextSpine:
        "apps/erp/src/lib/context/resolve-operating-context.server.ts",
      permissions:
        "packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts",
      audit:
        "packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts",
      tests:
        "packages/erp-module-foundation/src/__tests__/module-foundation.test.ts",
      gates: "scripts/governance/check-erp-module-foundation.mts",
    });

    const alignedBundle = {
      ...bundle,
      module: procurement,
    };

    const result = assertErpRuntimeModuleRegistry({
      registry,
      erpDomainModuleKvIds: PAS_001B_KV_CATALOG,
      bundles: [alignedBundle],
    });

    expect(result.ok).toBe(true);
    expect(result.moduleCount).toBe(1);
  });

  it("fails on duplicate permission keys across module bundles", () => {
    const procurement = defineErpRuntimeModule(baseModuleInput());
    const inventory = defineErpRuntimeModule({
      slug: "inventory",
      kvId: "KV-INV",
      permissionNamespace: "inventory",
      routeSlug: "inventory",
      runtimePackage: "@afenda/database",
      wirePackage: "@afenda/kernel/erp-domain/inventory",
      ownerPackage: "@afenda/database",
      databaseOwner: "@afenda/database",
      appOwner: "apps/erp",
      permissionOwner: "@afenda/permissions",
      knowledgeOwner: "@afenda/enterprise-knowledge",
      lifecycle: "runtime",
      runtimeStatus: "runtime_authorized",
    });

    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurement, inventory],
    });

    const procurementBundle = buildProcurementFoundationBundle();
    const inventoryBundle = {
      ...procurementBundle,
      module: inventory,
      permissionBinding: defineModulePermissionBinding({
        module: "inventory",
        kvId: "KV-INV",
        permissionNamespace: "procurement",
        kernelPermissionKeys: ["procurement.requisition_read"],
      }),
    };

    expect(() =>
      assertErpRuntimeModuleRegistry({
        registry,
        erpDomainModuleKvIds: PAS_001B_KV_CATALOG,
        bundles: [procurementBundle, inventoryBundle],
      })
    ).toThrow(ModuleRegistryAssertionError);
  });
});
