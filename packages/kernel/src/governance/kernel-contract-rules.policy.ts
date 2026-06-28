/**
 * PAS-001 §9 — kernel contract rules policy registry.
 *
 * Authority-only metadata: documents the 14 contract rules every kernel contract
 * must satisfy and which governance gates enforce each rule.
 */

export const KERNEL_CONTRACT_RULE_IDS = [
  "typescript-strict-mode",
  "no-project-internal-imports",
  "json-serializable-wire-shape",
  "branded-cross-package-ids",
  "readonly-object-properties",
  "explicit-null-absent-context",
  "no-silent-tenant-fallback",
  "no-untyped-governed-id-strings",
  "no-hidden-business-logic",
  "no-import-side-effects",
  "no-duplicated-contract-pattern",
  "no-greenfield-brand-error-replacement",
  "no-incompatible-doc-stubs",
  "wire-context-module-triad",
] as const;

export type KernelContractRuleId = (typeof KERNEL_CONTRACT_RULE_IDS)[number];

export interface KernelContractRule {
  readonly description: string;
  readonly enforcementGate: string | null;
  readonly id: KernelContractRuleId;
  readonly pasRuleNumber: number;
  readonly pasSection: "9";
}

export const KERNEL_CONTRACT_RULES = {
  "typescript-strict-mode": {
    id: "typescript-strict-mode",
    pasSection: "9",
    pasRuleNumber: 1,
    description: "TypeScript strict mode.",
    enforcementGate: "pnpm --filter @afenda/kernel typecheck",
  },
  "no-project-internal-imports": {
    id: "no-project-internal-imports",
    pasSection: "9",
    pasRuleNumber: 2,
    description: "No project-internal imports except within kernel.",
    enforcementGate: "pnpm check:kernel-contract-rules",
  },
  "json-serializable-wire-shape": {
    id: "json-serializable-wire-shape",
    pasSection: "9",
    pasRuleNumber: 3,
    description: "JSON-serializable wire shape where used across boundaries.",
    enforcementGate: "pnpm check:kernel-events-wire-serializable",
  },
  "branded-cross-package-ids": {
    id: "branded-cross-package-ids",
    pasSection: "9",
    pasRuleNumber: 4,
    description: "Branded IDs for cross-package identifiers.",
    enforcementGate: "pnpm check:kernel-identity-surface",
  },
  "readonly-object-properties": {
    id: "readonly-object-properties",
    pasSection: "9",
    pasRuleNumber: 5,
    description: "readonly object properties.",
    enforcementGate: "pnpm check:kernel-contract-rules",
  },
  "explicit-null-absent-context": {
    id: "explicit-null-absent-context",
    pasSection: "9",
    pasRuleNumber: 6,
    description: "Explicit null for absent runtime context.",
    enforcementGate: "pnpm check:kernel-context-surface",
  },
  "no-silent-tenant-fallback": {
    id: "no-silent-tenant-fallback",
    pasSection: "9",
    pasRuleNumber: 7,
    description: "No silent fallback to tenant/company/org.",
    enforcementGate: "pnpm check:kernel-context-surface",
  },
  "no-untyped-governed-id-strings": {
    id: "no-untyped-governed-id-strings",
    pasSection: "9",
    pasRuleNumber: 8,
    description: "No untyped string for governed IDs.",
    enforcementGate: "pnpm check:kernel-identity-surface",
  },
  "no-hidden-business-logic": {
    id: "no-hidden-business-logic",
    pasSection: "9",
    pasRuleNumber: 9,
    description: "No hidden business logic.",
    enforcementGate: "pnpm check:kernel-prohibited-ownership",
  },
  "no-import-side-effects": {
    id: "no-import-side-effects",
    pasSection: "9",
    pasRuleNumber: 10,
    description: "No side effects during import.",
    enforcementGate: "pnpm check:kernel-contract-rules",
  },
  "no-duplicated-contract-pattern": {
    id: "no-duplicated-contract-pattern",
    pasSection: "9",
    pasRuleNumber: 11,
    description: "No duplicated current-source contract pattern.",
    enforcementGate: "pnpm check:kernel-contract-rules",
  },
  "no-greenfield-brand-error-replacement": {
    id: "no-greenfield-brand-error-replacement",
    pasSection: "9",
    pasRuleNumber: 12,
    description:
      "No greenfield replacement of existing brand or error helpers.",
    enforcementGate: "pnpm check:kernel-identity-surface",
  },
  "no-incompatible-doc-stubs": {
    id: "no-incompatible-doc-stubs",
    pasSection: "9",
    pasRuleNumber: 13,
    description: "No source-incompatible example stubs in canonical docs.",
    enforcementGate: null,
  },
  "wire-context-module-triad": {
    id: "wire-context-module-triad",
    pasSection: "9",
    pasRuleNumber: 14,
    description:
      "Wire context triad — *.contract.ts, *.assert.ts, *.parser.ts for wire ingress; branded context only after validation.",
    enforcementGate: "pnpm check:kernel-context-wire-triad",
  },
} satisfies Record<KernelContractRuleId, KernelContractRule>;

export const KERNEL_CONTRACT_RULES_POLICY = {
  pasSection: "9",
  ruleCount: KERNEL_CONTRACT_RULE_IDS.length,
  delegatedGateIds: [
    "check:kernel-events-wire-serializable",
    "check:kernel-identity-surface",
    "check:kernel-context-surface",
    "check:kernel-context-wire-triad",
    "check:kernel-prohibited-ownership",
    "check:kernel-zero-runtime-deps",
  ],
  directGateId: "check:kernel-contract-rules",
  retiredPlatformIdPaths:
    "packages/kernel/src/identity/governance/identity-module-layout.contract.ts",
} as const;

const RULE_ID_SET = new Set<string>(KERNEL_CONTRACT_RULE_IDS);

export function isKernelContractRuleId(
  value: string
): value is KernelContractRuleId {
  return RULE_ID_SET.has(value);
}

export function getKernelContractRule(
  id: KernelContractRuleId
): KernelContractRule {
  return KERNEL_CONTRACT_RULES[id];
}

export function listKernelContractRules(): readonly KernelContractRule[] {
  return KERNEL_CONTRACT_RULE_IDS.map((id) => KERNEL_CONTRACT_RULES[id]);
}

export function getKernelContractRuleByPasNumber(
  pasRuleNumber: number
): KernelContractRule | undefined {
  return listKernelContractRules().find(
    (rule) => rule.pasRuleNumber === pasRuleNumber
  );
}
