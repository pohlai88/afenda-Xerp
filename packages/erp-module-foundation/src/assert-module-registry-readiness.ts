import { collectModuleReadinessFailures } from "./assert-module-readiness.js";
import { collectModuleStatusRequirementFailures } from "./assert-module-status-requirements.js";
import { assertRuntimeModuleKvCatalogParityForModule } from "./define-erp-runtime-module-registry.js";
import type {
  ErpModuleFoundationBundle,
  ErpRuntimeModuleDefinition,
  ErpRuntimeModuleRegistryBundle,
  ModuleRegistryAssertionResult,
} from "./erp-module-foundation.types.js";
import { ModuleRegistryAssertionError } from "./erp-module-foundation.types.js";
import {
  errorFinding,
  type ModuleReadinessFinding,
} from "./internal/findings.js";

function collectCrossModulePermissionKeyFailures(
  bundles: readonly ErpModuleFoundationBundle[]
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const seen = new Map<string, string>();

  for (const bundle of bundles) {
    for (const key of bundle.permissionBinding.kernelPermissionKeys) {
      const owner = seen.get(key);
      if (owner && owner !== bundle.module.slug) {
        findings.push(
          errorFinding(
            "permissions",
            "REGISTRY_DUPLICATE_PERMISSION_KEY",
            `duplicate permission key "${key}" across modules "${owner}" and "${bundle.module.slug}"`
          )
        );
      } else {
        seen.set(key, bundle.module.slug);
      }
    }
  }

  return findings;
}

function collectCrossModuleMetadataFailures(
  bundles: readonly ErpModuleFoundationBundle[]
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const surfaceIds = new Map<string, string>();
  const routes = new Map<string, string>();

  for (const bundle of bundles) {
    for (const surface of bundle.metadataBinding.surfaces) {
      const surfaceOwner = surfaceIds.get(surface.surfaceId);
      if (surfaceOwner && surfaceOwner !== bundle.module.slug) {
        findings.push(
          errorFinding(
            "metadata",
            "REGISTRY_DUPLICATE_METADATA_SURFACE",
            `duplicate metadata surfaceId "${surface.surfaceId}" across "${surfaceOwner}" and "${bundle.module.slug}"`
          )
        );
      } else {
        surfaceIds.set(surface.surfaceId, bundle.module.slug);
      }

      const routeOwner = routes.get(surface.route);
      if (routeOwner && routeOwner !== bundle.module.slug) {
        findings.push(
          errorFinding(
            "metadata",
            "REGISTRY_DUPLICATE_METADATA_ROUTE",
            `duplicate metadata route "${surface.route}" across "${routeOwner}" and "${bundle.module.slug}"`
          )
        );
      } else {
        routes.set(surface.route, bundle.module.slug);
      }
    }
  }

  return findings;
}

function collectCrossModuleAuditFailures(
  bundles: readonly ErpModuleFoundationBundle[]
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const seen = new Map<string, string>();

  for (const bundle of bundles) {
    for (const action of bundle.auditMap.actions) {
      const owner = seen.get(action);
      if (owner && owner !== bundle.module.slug) {
        findings.push(
          errorFinding(
            "audit",
            "REGISTRY_DUPLICATE_AUDIT_ACTION",
            `duplicate audit action "${action}" across "${owner}" and "${bundle.module.slug}"`
          )
        );
      } else {
        seen.set(action, bundle.module.slug);
      }
    }
  }

  return findings;
}

function collectCrossModuleEventFailures(
  bundles: readonly ErpModuleFoundationBundle[]
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const seen = new Map<string, string>();

  for (const bundle of bundles) {
    for (const event of bundle.eventCatalog.events) {
      const owner = seen.get(event);
      if (owner && owner !== bundle.module.slug) {
        findings.push(
          errorFinding(
            "outbox",
            "REGISTRY_DUPLICATE_EVENT",
            `duplicate event "${event}" across "${owner}" and "${bundle.module.slug}"`
          )
        );
      } else {
        seen.set(event, bundle.module.slug);
      }
    }
  }

  return findings;
}

function collectCrossModuleOperationFailures(
  bundles: readonly ErpModuleFoundationBundle[]
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const seen = new Map<string, string>();

  for (const bundle of bundles) {
    if (!bundle.operationCatalog) {
      continue;
    }
    for (const operation of bundle.operationCatalog.operations) {
      const owner = seen.get(operation.operationId);
      if (owner && owner !== bundle.module.slug) {
        findings.push(
          errorFinding(
            "operations",
            "REGISTRY_DUPLICATE_OPERATION",
            `duplicate operationId "${operation.operationId}" across "${owner}" and "${bundle.module.slug}"`
          )
        );
      } else {
        seen.set(operation.operationId, bundle.module.slug);
      }
    }
  }

  return findings;
}

function collectCatalogCoverageFailures(
  input: ErpRuntimeModuleRegistryBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const blocked = new Set(input.blockedModuleSlugs ?? []);
  const registrySlugs = new Set(input.registry.modules.map((m) => m.slug));

  if (input.requireFullCatalogCoverage) {
    for (const slug of Object.keys(input.erpDomainModuleKvIds)) {
      if (blocked.has(slug)) {
        continue;
      }
      if (!registrySlugs.has(slug)) {
        findings.push(
          errorFinding(
            "registry",
            "REGISTRY_CATALOG_SLUG_MISSING",
            `PAS-001B catalog slug "${slug}" missing from registry (not blocked)`
          )
        );
      }
    }
  }

  for (const module of input.registry.modules) {
    if (
      !(input.erpDomainModuleKvIds[module.slug] || blocked.has(module.slug))
    ) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_KV_CATALOG_MISSING",
          `registry module "${module.slug}" missing from erpDomainModuleKvIds catalog`
        )
      );
    }
  }

  return findings;
}

function collectBundleSlugParityFailures(
  input: ErpRuntimeModuleRegistryBundle
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const bundleCounts = new Map<string, number>();

  for (const bundle of input.bundles) {
    const slug = bundle.module.slug;
    bundleCounts.set(slug, (bundleCounts.get(slug) ?? 0) + 1);
  }

  for (const [slug, count] of bundleCounts) {
    if (count > 1) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_DUPLICATE_BUNDLE",
          `duplicate foundation bundle for module "${slug}"`
        )
      );
    }
  }

  const registrySlugs = new Set(input.registry.modules.map((m) => m.slug));
  for (const slug of registrySlugs) {
    const count = bundleCounts.get(slug) ?? 0;
    if (count === 0) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_MISSING_BUNDLE",
          `registry module "${slug}" missing foundation bundle`
        )
      );
    }
  }

  for (const bundle of input.bundles) {
    if (!registrySlugs.has(bundle.module.slug)) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_BUNDLE_NOT_REGISTERED",
          `bundle module "${bundle.module.slug}" missing from registry.modules`
        )
      );
    }
  }

  return findings;
}

function collectBundleRegistryModuleParityFailures(
  bundle: ErpModuleFoundationBundle,
  registryModule: ErpRuntimeModuleDefinition | undefined
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const slug = bundle.module.slug;

  if (!registryModule) {
    return findings;
  }

  const fields: Array<{
    label: string;
    bundleValue: string;
    registryValue: string;
  }> = [
    {
      label: "kvId",
      bundleValue: bundle.module.kvId,
      registryValue: registryModule.kvId,
    },
    {
      label: "runtimePackage",
      bundleValue: bundle.module.runtimePackage,
      registryValue: registryModule.runtimePackage,
    },
    {
      label: "wirePackage",
      bundleValue: bundle.module.wirePackage,
      registryValue: registryModule.wirePackage,
    },
    {
      label: "runtimeStatus",
      bundleValue: bundle.module.runtimeStatus,
      registryValue: registryModule.runtimeStatus,
    },
    {
      label: "permissionNamespace",
      bundleValue: bundle.module.permissionNamespace,
      registryValue: registryModule.permissionNamespace,
    },
    {
      label: "routeSlug",
      bundleValue: bundle.module.routeSlug,
      registryValue: registryModule.routeSlug,
    },
  ];

  for (const field of fields) {
    if (field.bundleValue !== field.registryValue) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_MODULE_FIELD_MISMATCH",
          `bundle "${slug}": ${field.label} "${field.bundleValue}" !== registry "${field.registryValue}"`
        )
      );
    }
  }

  return findings;
}

function collectPerBundleReadinessFailures(
  bundles: readonly ErpModuleFoundationBundle[],
  registryModulesBySlug: ReadonlyMap<string, ErpRuntimeModuleDefinition>
): ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];

  for (const bundle of bundles) {
    const slug = bundle.module.slug;
    const prefix = `registry bundle "${slug}"`;

    findings.push(
      ...collectBundleRegistryModuleParityFailures(
        bundle,
        registryModulesBySlug.get(slug)
      )
    );

    for (const failure of collectModuleStatusRequirementFailures(bundle)) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_STATUS_REQUIREMENT",
          `${prefix}: ${failure}`
        )
      );
    }

    for (const failure of collectModuleReadinessFailures(bundle)) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_MODULE_READINESS",
          `${prefix}: ${failure}`
        )
      );
    }
  }

  return findings;
}

export function collectErpRuntimeModuleRegistryFindings(
  input: ErpRuntimeModuleRegistryBundle
): readonly ModuleReadinessFinding[] {
  const findings: ModuleReadinessFinding[] = [];
  const registryModulesBySlug = new Map(
    input.registry.modules.map((module) => [module.slug, module] as const)
  );

  for (const module of input.registry.modules) {
    if (module.runtimeStatus === "deprecated") {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_DEPRECATED_MODULE",
          `deprecated module "${module.slug}" must not appear in active registry`
        )
      );
    }

    if (module.runtimeStatus === "blocked") {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_BLOCKED_MODULE",
          `blocked module "${module.slug}" must not appear in active registry.modules — use blockedModuleSlugs waiver only`
        )
      );
    }

    try {
      assertRuntimeModuleKvCatalogParityForModule({
        module,
        erpDomainModuleKvIds: input.erpDomainModuleKvIds,
      });
    } catch (error) {
      findings.push(
        errorFinding(
          "registry",
          "REGISTRY_KV_PARITY",
          error instanceof Error ? error.message : String(error)
        )
      );
    }
  }

  findings.push(
    ...collectCrossModulePermissionKeyFailures(input.bundles),
    ...collectCrossModuleMetadataFailures(input.bundles),
    ...collectCrossModuleAuditFailures(input.bundles),
    ...collectCrossModuleEventFailures(input.bundles),
    ...collectCrossModuleOperationFailures(input.bundles),
    ...collectCatalogCoverageFailures(input),
    ...collectBundleSlugParityFailures(input),
    ...collectPerBundleReadinessFailures(input.bundles, registryModulesBySlug)
  );

  return findings;
}

export function collectErpRuntimeModuleRegistryFailures(
  input: ErpRuntimeModuleRegistryBundle
): readonly string[] {
  return collectErpRuntimeModuleRegistryFindings(input).map(
    (finding) => finding.message
  );
}

export function assertErpRuntimeModuleRegistry(
  input: ErpRuntimeModuleRegistryBundle
): ModuleRegistryAssertionResult {
  const failures = collectErpRuntimeModuleRegistryFailures(input);

  if (failures.length > 0) {
    throw new ModuleRegistryAssertionError(failures);
  }

  return {
    ok: true,
    moduleCount: input.registry.modules.length,
    checkedAt: new Date().toISOString(),
  } as const;
}
