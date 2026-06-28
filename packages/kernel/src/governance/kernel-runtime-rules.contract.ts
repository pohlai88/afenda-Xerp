/**
 * PAS-001 §10 — kernel runtime rules registry.
 *
 * Authority-only metadata: documents when kernel runtime code is permitted and
 * which approved propagation primitive exists. No runtime enforcement of domain behavior.
 */

import type { RepoRelativePath } from "../contracts/platform/platform-entity-authority.contract.js";

export const KERNEL_RUNTIME_RULES_AUTHORITY = "PAS-001 §10" as const;

export const KERNEL_RUNTIME_RULE_IDS = [
  "zero-external-dependencies",
  "no-forbidden-runtime-access",
  "cross-package-execution-safety",
  "tested-for-isolation",
  "fail-closed",
  "no-application-specific-behavior",
  "kernel-approved-context-frame-fields",
] as const;

export type KernelRuntimeRuleId = (typeof KERNEL_RUNTIME_RULE_IDS)[number];

export interface KernelRuntimeRule {
  readonly enforcementGate: string | null;
  readonly id: KernelRuntimeRuleId;
  readonly label: string;
  readonly order: number;
}

export const KERNEL_RUNTIME_RULES = {
  "zero-external-dependencies": {
    id: "zero-external-dependencies",
    order: 1,
    label: "It has zero external dependencies.",
    enforcementGate: "check:kernel-zero-runtime-deps",
  },
  "no-forbidden-runtime-access": {
    id: "no-forbidden-runtime-access",
    order: 2,
    label:
      "It does not access database, HTTP, filesystem, auth, permission engine, observability sink, UI runtime, or environment secrets.",
    enforcementGate: null,
  },
  "cross-package-execution-safety": {
    id: "cross-package-execution-safety",
    order: 3,
    label: "It supports cross-package execution safety.",
    enforcementGate: null,
  },
  "tested-for-isolation": {
    id: "tested-for-isolation",
    order: 4,
    label: "It is tested for isolation.",
    enforcementGate: "check:kernel-propagation-isolation",
  },
  "fail-closed": {
    id: "fail-closed",
    order: 5,
    label: "It fails closed.",
    enforcementGate: "check:kernel-propagation-isolation",
  },
  "no-application-specific-behavior": {
    id: "no-application-specific-behavior",
    order: 6,
    label: "It has no application-specific behavior.",
    enforcementGate: null,
  },
  "kernel-approved-context-frame-fields": {
    id: "kernel-approved-context-frame-fields",
    order: 7,
    label: "It carries only kernel-approved context frame fields.",
    enforcementGate: "check:kernel-propagation-isolation",
  },
} satisfies Record<KernelRuntimeRuleId, KernelRuntimeRule>;

export const KERNEL_APPROVED_RUNTIME_PRIMITIVE_IDS = [
  "async-context-propagation",
] as const;

export type KernelApprovedRuntimePrimitiveId =
  (typeof KERNEL_APPROVED_RUNTIME_PRIMITIVE_IDS)[number];

export interface KernelApprovedRuntimePrimitive {
  readonly apiSurface: readonly string[];
  readonly evidencePaths: readonly RepoRelativePath[];
  readonly id: KernelApprovedRuntimePrimitiveId;
  readonly label: string;
}

export const KERNEL_APPROVED_RUNTIME_PRIMITIVES = {
  "async-context-propagation": {
    id: "async-context-propagation",
    label: "Async context propagation only.",
    evidencePaths: [
      "packages/kernel/src/propagation/kernel-context-frame.contract.ts",
      "packages/kernel/src/propagation/kernel-context-frame.assert.ts",
      "packages/kernel/src/propagation/kernel-context-frame.parser.ts",
      "packages/kernel/src/propagation/kernel-context.ts",
      "packages/kernel/src/propagation/index.ts",
      "packages/kernel/src/propagation/__tests__/kernel-context.test.ts",
    ],
    apiSurface: [
      "kernelContext.run",
      "kernelContext.get",
      "kernelContext.fork",
    ],
  },
} satisfies Record<
  KernelApprovedRuntimePrimitiveId,
  KernelApprovedRuntimePrimitive
>;

export const KERNEL_RUNTIME_RULES_POLICY = {
  authority: KERNEL_RUNTIME_RULES_AUTHORITY,
  pasSection: "10",
  ruleCount: KERNEL_RUNTIME_RULE_IDS.length,
  approvedPrimitiveCount: KERNEL_APPROVED_RUNTIME_PRIMITIVE_IDS.length,
  constitutionalRule:
    "Kernel runtime code is allowed only when all seven PAS §10 rules hold. Everything else must remain contracts, pure helpers, or registries.",
} as const;

const RULE_ID_SET = new Set<string>(KERNEL_RUNTIME_RULE_IDS);

export function isKernelRuntimeRuleId(
  value: string
): value is KernelRuntimeRuleId {
  return RULE_ID_SET.has(value);
}

export function getKernelRuntimeRule(
  id: KernelRuntimeRuleId
): KernelRuntimeRule {
  return KERNEL_RUNTIME_RULES[id];
}

export function listKernelRuntimeRules(): readonly KernelRuntimeRule[] {
  return KERNEL_RUNTIME_RULE_IDS.map((id) => KERNEL_RUNTIME_RULES[id]);
}
