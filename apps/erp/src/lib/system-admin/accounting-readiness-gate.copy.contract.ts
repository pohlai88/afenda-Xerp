export const ACCOUNTING_READINESS_GATE_PANEL_TITLE =
  "Accounting readiness gate";

export const ACCOUNTING_READINESS_GATE_PANEL_DESCRIPTION =
  "Phase 9 foundation checklist with live structural and delegated gate status from the governance orchestrator. Automated pass does not replace Architecture Authority sign-off.";

export const ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_TITLE =
  "Phase 9 signed off";

export const ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_BODY =
  "Architecture Authority Phase 9 Accounting Readiness Gate passed on 2026-06-24. Foundation phase 14 Accounting Core Contracts may begin. Ledger posting, journal arithmetic, and @afenda/accounting runtime remain prohibited until Foundation phase 14 contract ADR is accepted.";

export const ACCOUNTING_READINESS_GATE_STATUS_LABELS = {
  pass: "Passing",
  fail: "Failing",
  skipped: "Not checked on this run",
} as const;

export const ACCOUNTING_READINESS_GATE_OVERALL_LABELS = {
  "automated-fail": "Automated delegated checks failing",
  "automated-pass": "Automated delegated checks passing — Phase 9 signed off",
  "evidence-fail": "Evidence checks failing",
  "evidence-pass":
    "Evidence checks passing — delegated gates not run on this page load",
} as const;

export const ACCOUNTING_READINESS_GATE_RUN_MODE_LABELS = {
  full: "Full delegated gate run",
  "structure-only": "Structure and evidence only (default page load)",
} as const;

export const ACCOUNTING_READINESS_GATE_REFRESH_SUBMIT_LABEL =
  "Run full delegated gate check";

export const ACCOUNTING_READINESS_GATE_REFRESH_PENDING_LABEL =
  "Running delegated gates…";

export const ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE =
  "Unable to run the full delegated gate check. Retry or run pnpm check:accounting-readiness-gate in CI.";

export const ACCOUNTING_READINESS_GATE_FOOTNOTE_LABEL =
  "Phase 9 signed off 2026-06-24 — see docs/architecture/phase-9-accounting-readiness-sign-off.md. Foundation phase 14 contracts only; no ledger posting without separate ADR acceptance.";

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

export interface AccountingReadinessGateRequirementCopy {
  readonly delegatedGates: readonly string[];
  readonly id: AccountingReadinessGateRequirementId;
  readonly number: number;
  readonly requirement: string;
  readonly testFiles: readonly string[];
}

/**
 * ERP display copy — mirrors accounting-readiness-gate-registry.mts metadata.
 * CI registry remains authoritative for gate orchestration.
 */
export const ACCOUNTING_READINESS_GATE_REQUIREMENT_COPY = [
  {
    number: 1,
    id: "multi-company-model",
    requirement: "Multi-company model documented",
    delegatedGates: ["check:multi-tenancy-glossary-first"],
    testFiles: [
      "apps/erp/src/lib/context/__tests__/resolve-legal-entity-context.test.ts",
    ],
  },
  {
    number: 2,
    id: "holding-subsidiary-minor-interest",
    requirement: "Holding / subsidiary / minor-interest model documented",
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
    delegatedGates: ["check:multi-tenancy-operating-context-resolver"],
    testFiles: ["apps/erp/src/__tests__/operating-context-integration.test.ts"],
  },
  {
    number: 4,
    id: "rbac-and-audit",
    requirement: "RBAC and audit proven",
    delegatedGates: ["check:multi-tenancy-enterprise-acceptance"],
    testFiles: ["apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts"],
  },
  {
    number: 5,
    id: "api-contract-governance",
    requirement: "API contract governance proven",
    delegatedGates: ["check:api-contracts"],
    testFiles: [],
  },
  {
    number: 6,
    id: "db-migration-governance",
    requirement: "DB migration governance proven",
    delegatedGates: ["quality:migrations"],
    testFiles: [],
  },
  {
    number: 7,
    id: "feature-manifest",
    requirement: "Feature manifest governance proven",
    delegatedGates: [],
    testFiles: [
      "apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts",
    ],
  },
  {
    number: 8,
    id: "system-admin-operational",
    requirement: "System Admin base operational",
    delegatedGates: [],
    testFiles: [
      "apps/erp/src/__tests__/system-admin.integration.test.tsx",
      "apps/erp/src/__tests__/system-admin-acceptance.test.ts",
    ],
  },
  {
    number: 9,
    id: "ci-quality-gates",
    requirement: "CI quality gates passing",
    delegatedGates: ["quality:release-gate", "check:accounting-readiness-gate"],
    testFiles: [],
  },
  {
    number: 10,
    id: "documentation-synchronized",
    requirement: "Documentation synchronized",
    delegatedGates: [
      "check:documentation-drift",
      "check:foundation-disposition",
    ],
    testFiles: [],
  },
] as const satisfies readonly AccountingReadinessGateRequirementCopy[];
