/**
 * PAS-001 §11 — recommended kernel addition sequence (authority registry only).
 *
 * Documents delivery order and evidence paths for cross-package kernel contracts.
 * Does not execute migrations, authorization, or domain runtime.
 */

import type { RepoRelativePath } from "../contracts/platform/platform-entity-authority.contract.js";

export const KERNEL_IMPLEMENTATION_SEQUENCE_PAS_SECTION = "11" as const;

export const KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS = [
  "primitive-reference-brands",
  "localization-context-shape",
  "app-error-enrichment",
  "problem-detail-wire",
  "execution-context-tracing",
  "cross-package-lifecycle-vocabulary",
  "policy-decision-vocabulary",
  "json-wire-utilities",
  "async-context-propagation",
  "domain-event-envelope",
  "governance-scripts",
] as const;

export type KernelImplementationSequenceStepId =
  (typeof KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS)[number];

export interface KernelImplementationSequenceStep {
  readonly evidencePaths: readonly RepoRelativePath[];
  readonly gateScripts: readonly string[];
  readonly id: KernelImplementationSequenceStepId;
  readonly label: string;
  readonly order: number;
}

export const KERNEL_IMPLEMENTATION_SEQUENCE_STEPS = [
  {
    id: "primitive-reference-brands",
    order: 1,
    label:
      "Add primitive brands: `LocaleCode`, `TimezoneId`, `DateFormat`, `NumberFormat`, `CurrencyCode`, `CountryCode`, `UomCode`, `DocumentId`, `AssetId`.",
    evidencePaths: [
      "packages/kernel/src/identity/primitives/primitive-reference.registry.ts",
      "packages/kernel/src/identity/families/business-reference-id.contract.ts",
    ],
    gateScripts: [],
  },
  {
    id: "localization-context-shape",
    order: 2,
    label: "Add `LocalizationContext` shape.",
    evidencePaths: [
      "packages/kernel/src/context/localization-context.contract.ts",
    ],
    gateScripts: [],
  },
  {
    id: "app-error-enrichment",
    order: 3,
    label:
      "Enrich `AppError` through current `AppError` / `AppErrors.*` style.",
    evidencePaths: ["packages/kernel/src/contracts/app-error.contract.ts"],
    gateScripts: [],
  },
  {
    id: "problem-detail-wire",
    order: 4,
    label: "Add RFC 9457-aligned `ProblemDetail` wire contract.",
    evidencePaths: ["packages/kernel/src/contracts/problem-detail.contract.ts"],
    gateScripts: [],
  },
  {
    id: "execution-context-tracing",
    order: 5,
    label: "Add optional `traceId` and `spanId` to `ExecutionContext`.",
    evidencePaths: [
      "packages/kernel/src/contracts/execution-context.contract.ts",
    ],
    gateScripts: [],
  },
  {
    id: "cross-package-lifecycle-vocabulary",
    order: 6,
    label:
      "Add generic lifecycle / approval / document-state vocabulary only if cross-package and non-domain-specific.",
    evidencePaths: [
      "packages/kernel/src/context/lifecycle.contract.ts",
      "packages/kernel/src/contracts/accounting-domain/posting-status.contract.ts",
    ],
    gateScripts: [],
  },
  {
    id: "policy-decision-vocabulary",
    order: 7,
    label: "Add policy decision vocabulary.",
    evidencePaths: [
      "packages/kernel/src/policy/policy-decision.contract.ts",
      "packages/kernel/src/policy/policy-denial-reason.contract.ts",
    ],
    gateScripts: [],
  },
  {
    id: "json-wire-utilities",
    order: 8,
    label: "Add strict JSON-safe wire utility types.",
    evidencePaths: ["packages/kernel/src/contracts/json-wire.contract.ts"],
    gateScripts: [],
  },
  {
    id: "async-context-propagation",
    order: 9,
    label: "Add async context propagation.",
    evidencePaths: [
      "packages/kernel/src/propagation/kernel-context.ts",
      "packages/kernel/src/propagation/kernel-context-frame.contract.ts",
    ],
    gateScripts: ["check:kernel-propagation-isolation"],
  },
  {
    id: "domain-event-envelope",
    order: 10,
    label: "Add domain event envelope.",
    evidencePaths: ["packages/kernel/src/events/domain-event.contract.ts"],
    gateScripts: ["check:kernel-events-wire-serializable"],
  },
  {
    id: "governance-scripts",
    order: 11,
    label:
      "Add governance scripts for propagation isolation, event wire serializability, and zero runtime dependencies.",
    evidencePaths: [
      "scripts/governance/check-kernel-propagation-isolation.mts",
      "scripts/governance/check-kernel-events-wire-serializable.mts",
      "scripts/governance/check-kernel-zero-runtime-deps.mts",
    ],
    gateScripts: [
      "check:kernel-propagation-isolation",
      "check:kernel-events-wire-serializable",
      "check:kernel-zero-runtime-deps",
    ],
  },
] as const satisfies readonly KernelImplementationSequenceStep[];

export const KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS = [
  "FiscalCalendarContext",
  "CurrencyContext",
  "fiscal period state outside already-approved accounting-domain vocabulary",
  "fiscal year start month",
  "period open/close/lock runtime status",
  "functional/base/reporting currency decisions",
  "currency conversion",
  "locale resolver",
  "formatting implementation",
] as const;

export type KernelImplementationSequenceDeferredAddition =
  (typeof KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS)[number];

export const KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_PATHS = [
  "packages/kernel/src/context/currency-context.contract.ts",
  "packages/kernel/src/context/fiscal-calendar-context.contract.ts",
] as const satisfies readonly RepoRelativePath[];

export const KERNEL_IMPLEMENTATION_SEQUENCE_POLICY = {
  pasSection: KERNEL_IMPLEMENTATION_SEQUENCE_PAS_SECTION,
  stepCount: KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS.length,
  deferredAdditions: KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS,
  deferredPaths: KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_PATHS,
  registryIsAuthorityOnly: true,
} as const;

export function getKernelImplementationSequenceStep(
  id: KernelImplementationSequenceStepId
): KernelImplementationSequenceStep {
  const step = KERNEL_IMPLEMENTATION_SEQUENCE_STEPS.find(
    (candidate) => candidate.id === id
  );

  if (!step) {
    throw new Error(`Unknown kernel implementation sequence step: ${id}`);
  }

  return step;
}

export function listKernelImplementationSequenceSteps(): readonly KernelImplementationSequenceStep[] {
  return KERNEL_IMPLEMENTATION_SEQUENCE_STEPS;
}

export function isKernelImplementationSequenceStepId(
  value: string
): value is KernelImplementationSequenceStepId {
  return (
    KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS as readonly string[]
  ).includes(value);
}
