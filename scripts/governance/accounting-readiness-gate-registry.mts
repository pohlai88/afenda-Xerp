/**
 * Phase 9 Accounting Readiness Gate registry (ADR-0010).
 *
 * Maps each pre-accounting-foundation-roadmap Phase 9 requirement to delegated
 * governance gates and contract-test evidence — no duplicate gate logic.
 */

export const ACCOUNTING_READINESS_GATE_SURFACE_RULE =
  "accounting-readiness-gate-is-canonical-phase-9-matrix" as const;

export const ACCOUNTING_READINESS_DELIVERY_DOC =
  "docs/adr/ADR-0010-no-accounting-before-foundation-gate.md" as const;

export const PHASE_9_ROADMAP_DOC =
  "docs/architecture/_afenda-erp-master-plan.llms.md" as const;

export type AccountingReadinessGateRequirementId =
  | "multi-company-model"
  | "holding-subsidiary-minor-interest"
  | "operating-context"
  | "rbac-and-audit"
  | "api-contract-governance"
  | "db-migration-governance"
  | "feature-manifest"
  | "system-admin-operational"
  | "ci-quality-gates"
  | "documentation-synchronized";

export interface AccountingReadinessGateRequirement {
  readonly delegatedGates: readonly string[];
  readonly id: AccountingReadinessGateRequirementId;
  readonly number: number;
  readonly requirement: string;
  readonly roadmapMarker: string;
  readonly testFiles?: readonly string[];
}

/** One row per Phase 9 requirement in pre-accounting-foundation-roadmap.md §Foundation Phase 9. */
export const ACCOUNTING_READINESS_GATE_REQUIREMENTS = [
  {
    number: 1,
    id: "multi-company-model",
    requirement: "Multi-company model documented",
    roadmapMarker: "Multi-company model documented",
    delegatedGates: ["check:multi-tenancy-glossary-first"],
    testFiles: [
      "apps/erp/src/lib/context/__tests__/resolve-legal-entity-context.test.ts",
    ],
  },
  {
    number: 2,
    id: "holding-subsidiary-minor-interest",
    requirement: "Holding / subsidiary / minor-interest model documented",
    roadmapMarker: "Holding / subsidiary / minor-interest model documented",
    delegatedGates: ["check:multi-tenancy-authority-design"],
    testFiles: [
      "apps/erp/src/lib/context/__tests__/to-ownership-interest-context.test.ts",
      "packages/database/src/__tests__/ownership-interest.contract.test.ts",
    ],
  },
  {
    number: 3,
    id: "operating-context",
    requirement: "Tenant / company / org / workspace context proven",
    roadmapMarker: "Tenant / company / org / workspace context proven",
    delegatedGates: ["check:multi-tenancy-operating-context-resolver"],
    testFiles: ["apps/erp/src/__tests__/operating-context-integration.test.ts"],
  },
  {
    number: 4,
    id: "rbac-and-audit",
    requirement: "RBAC and audit proven",
    roadmapMarker: "RBAC and audit proven",
    delegatedGates: ["check:multi-tenancy-enterprise-acceptance"],
    testFiles: ["apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts"],
  },
  {
    number: 5,
    id: "api-contract-governance",
    requirement: "API contract governance proven",
    roadmapMarker: "API contract governance proven",
    delegatedGates: ["check:api-contracts"],
  },
  {
    number: 6,
    id: "db-migration-governance",
    requirement: "DB migration governance proven",
    roadmapMarker: "DB migration governance proven",
    delegatedGates: ["quality:migrations"],
  },
  {
    number: 7,
    id: "feature-manifest",
    requirement: "Feature manifest governance proven",
    roadmapMarker: "Feature manifest governance proven",
    testFiles: [
      "apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts",
    ],
  },
  {
    number: 8,
    id: "system-admin-operational",
    requirement: "System Admin base operational",
    roadmapMarker: "System Admin base operational",
    testFiles: [
      "apps/erp/src/__tests__/system-admin.integration.test.tsx",
      "apps/erp/src/__tests__/system-admin-acceptance.test.ts",
    ],
  },
  {
    number: 9,
    id: "ci-quality-gates",
    requirement: "CI quality gates passing",
    roadmapMarker: "CI quality gates passing",
    delegatedGates: ["quality:release-gate", "check:accounting-readiness-gate"],
  },
  {
    number: 10,
    id: "documentation-synchronized",
    requirement: "Documentation synchronized",
    roadmapMarker: "Documentation synchronized",
    delegatedGates: [
      "check:documentation-drift",
      "check:foundation-disposition",
    ],
  },
] as const satisfies readonly AccountingReadinessGateRequirement[];

export const ACCOUNTING_READINESS_GATE_CHECK_SCRIPT =
  "scripts/governance/check-accounting-readiness-gate.mts" as const;

export const ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT =
  "check:accounting-readiness-gate" as const;
