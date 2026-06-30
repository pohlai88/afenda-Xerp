import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const contractsRoot = join(repoRoot, "apps/erp/src/server/api/contracts");

interface ApiFamilyInvariantMapping {
  readonly invariant: string;
  readonly label: string;
  readonly surfaces: readonly {
    readonly relativePath: string;
    readonly exportMarkers: readonly string[];
  }[];
}

/** PAS-API-001 API-001–API-016 → family contract surfaces (S-track MVP locus). */
export const API_FAMILY_INVARIANT_MAP = [
  {
    invariant: "API-001",
    label: "Operation identity",
    surfaces: [
      {
        relativePath: "core/api-operation-id.contract.ts",
        exportMarkers: ["parseApiOperationId", "ApiOperationId"],
      },
    ],
  },
  {
    invariant: "API-002",
    label: "Operation registry",
    surfaces: [
      {
        relativePath: "core/api-registry.contract.ts",
        exportMarkers: [
          "buildApiOperationRegistry",
          "ApiOperationRegistryEntry",
        ],
      },
      {
        relativePath: "core/api-style.contract.ts",
        exportMarkers: ["ApiStyleBinding", "API_STYLE_BINDINGS"],
      },
    ],
  },
  {
    invariant: "API-003",
    label: "Schema authority",
    surfaces: [
      {
        relativePath: "core/api-validation.contract.ts",
        exportMarkers: ["parseApiSchemaAuthorityRef", "ApiSchemaAuthorityRef"],
      },
    ],
  },
  {
    invariant: "API-004",
    label: "Ingress validation policy",
    surfaces: [
      {
        relativePath: "core/api-validation.contract.ts",
        exportMarkers: [
          "resolveValidationDirectionPolicy",
          "ApiIngressValidationPolicy",
        ],
      },
    ],
  },
  {
    invariant: "API-005",
    label: "Egress validation policy",
    surfaces: [
      {
        relativePath: "core/api-validation.contract.ts",
        exportMarkers: [
          "resolveValidationDirectionPolicy",
          "ApiEgressValidationPolicy",
        ],
      },
    ],
  },
  {
    invariant: "API-006",
    label: "Actor policy",
    surfaces: [
      {
        relativePath: "core/api-policy.contract.ts",
        exportMarkers: ["resolveActorPolicy", "ApiActorPolicy"],
      },
    ],
  },
  {
    invariant: "API-007",
    label: "Operating context policy",
    surfaces: [
      {
        relativePath: "core/api-policy.contract.ts",
        exportMarkers: [
          "resolveOperatingContextPolicyDeclaration",
          "ApiOperatingContextPolicyDeclaration",
        ],
      },
    ],
  },
  {
    invariant: "API-008",
    label: "Permission declaration",
    surfaces: [
      {
        relativePath: "core/api-policy.contract.ts",
        exportMarkers: [
          "resolvePermissionDeclaration",
          "ApiPermissionDeclaration",
        ],
      },
    ],
  },
  {
    invariant: "API-009",
    label: "Error semantics",
    surfaces: [
      {
        relativePath: "api-error.contract.ts",
        exportMarkers: ["ApiGovernedErrorDoctrine", "toGovernedErrorDoctrine"],
      },
    ],
  },
  {
    invariant: "API-010",
    label: "Correlation identity",
    surfaces: [
      {
        relativePath: "core/api-audit-replay.contract.ts",
        exportMarkers: ["parseApiCorrelationId", "ApiCorrelationId"],
      },
    ],
  },
  {
    invariant: "API-011",
    label: "Audit replay minimum",
    surfaces: [
      {
        relativePath: "core/api-audit-replay.contract.ts",
        exportMarkers: [
          "buildAuditReplayMinimumRecord",
          "ApiAuditReplayMinimumRecord",
        ],
      },
    ],
  },
  {
    invariant: "API-012",
    label: "Lifecycle classification",
    surfaces: [
      {
        relativePath: "core/api-lifecycle.contract.ts",
        exportMarkers: [
          "mapRouteLifecycleToFamily",
          "ApiFamilyLifecycleStatus",
        ],
      },
      {
        relativePath: "lifecycle.contract.ts",
        exportMarkers: [
          "API_ROUTE_LIFECYCLE_STATUSES",
          "ApiRouteLifecycleStatus",
        ],
      },
    ],
  },
  {
    invariant: "API-013",
    label: "Breaking-change classification",
    surfaces: [
      {
        relativePath: "core/api-lifecycle.contract.ts",
        exportMarkers: ["resolveBreakingChangeClass", "ApiBreakingChangeClass"],
      },
    ],
  },
  {
    invariant: "API-014",
    label: "Consumer impact",
    surfaces: [
      {
        relativePath: "core/api-consumer-impact.contract.ts",
        exportMarkers: [
          "resolveConsumerImpactDeclaration",
          "ApiConsumerImpactClass",
        ],
      },
    ],
  },
  {
    invariant: "API-015",
    label: "Governance exceptions",
    surfaces: [
      {
        relativePath: "core/api-exception.contract.ts",
        exportMarkers: [
          "API_GOVERNANCE_EXCEPTION_REGISTRY",
          "collectGovernanceExceptionViolations",
        ],
      },
    ],
  },
  {
    invariant: "API-016",
    label: "Ownership metadata",
    surfaces: [
      {
        relativePath: "core/api-ownership.contract.ts",
        exportMarkers: [
          "resolveOperationOwnership",
          "ApiOperationOwnershipMetadata",
        ],
      },
    ],
  },
] as const satisfies readonly ApiFamilyInvariantMapping[];

/** REST surfaces must bind family authority via core barrel or explicit core/*.contract (no fork). */
const REST_BINDING_IMPORT_SURFACES = [
  {
    relativePath: "api-contract-registry.ts",
    requiredAny: ["./core/index", "./core/api-registry.contract"],
  },
  {
    relativePath: "api-contract.ts",
    requiredAny: [
      "./core/index",
      "./core/api-policy.contract",
      "./core/api-validation.contract",
      "./core/api-consumer-impact.contract",
      "./core/api-ownership.contract",
      "./core/api-exception.contract",
    ],
    /** When using barrel, policy/validation/exception must still be reachable via re-export. */
    requiredAllWhenBarrel: ['export * from "./core/index"'],
  },
  {
    relativePath: "api-envelope.contract.ts",
    requiredAny: ["./core/api-audit-replay.contract", "./core/index"],
  },
  {
    relativePath: "openapi/build-afenda-openapi-document.ts",
    requiredAny: ["../api-contract"],
  },
] as const;

function collectInvariantSurfaceViolations(): string[] {
  const violations: string[] = [];

  for (const mapping of API_FAMILY_INVARIANT_MAP) {
    for (const surface of mapping.surfaces) {
      const absolutePath = join(contractsRoot, surface.relativePath);

      if (!existsSync(absolutePath)) {
        violations.push(
          `${mapping.invariant} (${mapping.label}): missing contract surface ${surface.relativePath}`
        );
        continue;
      }

      const source = readFileSync(absolutePath, "utf8");

      for (const marker of surface.exportMarkers) {
        if (!source.includes(marker)) {
          violations.push(
            `${mapping.invariant} (${mapping.label}): ${surface.relativePath} missing marker ${marker}`
          );
        }
      }
    }
  }

  return violations;
}

function collectRestBindingImportViolations(): string[] {
  const violations: string[] = [];

  for (const surface of REST_BINDING_IMPORT_SURFACES) {
    const absolutePath = join(contractsRoot, surface.relativePath);

    if (!existsSync(absolutePath)) {
      violations.push(`REST binding: missing surface ${surface.relativePath}`);
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    const matchesAny = surface.requiredAny.some((requiredImport) =>
      source.includes(requiredImport)
    );

    if (!matchesAny) {
      violations.push(
        `REST binding fork risk: ${surface.relativePath} must import family authority from one of: ${surface.requiredAny.join(", ")}`
      );
      continue;
    }

    if ("requiredAllWhenBarrel" in surface && source.includes("./core/index")) {
      for (const marker of surface.requiredAllWhenBarrel) {
        if (!source.includes(marker)) {
          violations.push(
            `REST binding fork risk: ${surface.relativePath} uses core barrel but missing ${marker}`
          );
        }
      }
    }
  }

  return violations;
}

async function collectRuntimeRegistryViolations(): Promise<string[]> {
  const violations: string[] = [];

  const [registryModule, coreModule] = await Promise.all([
    import("../../apps/erp/src/server/api/contracts/api-contract-registry.ts"),
    import("../../apps/erp/src/server/api/contracts/core/index.ts"),
  ]);

  if (registryModule.API_OPERATION_REGISTRY.length === 0) {
    violations.push("API_OPERATION_REGISTRY is empty");
  }

  if (
    registryModule.API_CONTRACTS.length !==
    registryModule.API_OPERATION_REGISTRY.length
  ) {
    violations.push("API_CONTRACTS and API_OPERATION_REGISTRY length mismatch");
  }

  const requiredCoreExports = [
    "parseApiOperationId",
    "buildApiOperationRegistry",
    "resolveValidationDirectionPolicy",
    "resolveConsumerImpactDeclaration",
    "resolveOperationOwnership",
    "collectGovernanceExceptionViolations",
  ] as const;

  for (const exportName of requiredCoreExports) {
    if (!(exportName in coreModule)) {
      violations.push(`core/index.ts missing export: ${exportName}`);
    }
  }

  return violations;
}

async function main(): Promise<void> {
  const violations = [
    ...collectInvariantSurfaceViolations(),
    ...collectRestBindingImportViolations(),
    ...(await collectRuntimeRegistryViolations()),
  ];

  if (violations.length > 0) {
    console.error("PAS-API-001 family conformance failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log(
    `PAS-API-001 family conformance passed (${API_FAMILY_INVARIANT_MAP.length} invariants traced)`
  );
}

await main();
