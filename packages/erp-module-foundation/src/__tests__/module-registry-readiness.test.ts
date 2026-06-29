import { describe, expect, it } from "vitest";
import {
  buildProcurementFoundationBundle,
  collectErpRuntimeModuleRegistryFailures,
  defineErpRuntimeModule,
  defineErpRuntimeModuleRegistry,
} from "../index.js";

const KV_CATALOG = { procurement: "KV-PROC" } as const;

function procurementModule(
  overrides?: Partial<ReturnType<typeof defineErpRuntimeModule>>
) {
  return defineErpRuntimeModule({
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
    lifecycle: "contracts_only",
    runtimeStatus: "wire_only",
    ...overrides,
  });
}

describe("registry bundle exact parity", () => {
  it("fails when registry module has no foundation bundle", () => {
    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurementModule()],
    });

    const failures = collectErpRuntimeModuleRegistryFailures({
      registry,
      erpDomainModuleKvIds: KV_CATALOG,
      bundles: [],
    });

    expect(
      failures.some((f) =>
        f.includes('registry module "procurement" missing foundation bundle')
      )
    ).toBe(true);
  });

  it("fails on duplicate foundation bundle for the same slug", () => {
    const bundle = buildProcurementFoundationBundle();
    const registry = defineErpRuntimeModuleRegistry({
      modules: [procurementModule()],
    });

    const failures = collectErpRuntimeModuleRegistryFailures({
      registry,
      erpDomainModuleKvIds: KV_CATALOG,
      bundles: [bundle, bundle],
    });

    expect(
      failures.some((f) =>
        f.includes('duplicate foundation bundle for module "procurement"')
      )
    ).toBe(true);
  });
});
