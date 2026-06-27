/**
 * PAS-001 §7 — kernel decision matrix registry.
 *
 * Authority-only metadata: documents which cross-package concerns belong in the
 * kernel versus application, domain, or persistence layers. No runtime enforcement.
 */

export const KERNEL_DECISION_MATRIX_ROW_IDS = [
  "id-crossing-package-boundaries",
  "primitive-localization-format-code-crossing-packages",
  "uom-code-crossing-packages",
  "date-number-formatting-implementation",
  "selected-locale-timezone-date-format-value",
  "functional-base-reporting-currency-decision",
  "fiscal-calendar-or-fiscal-period-behavior",
  "database-table-or-query",
  "resolver-that-loads-real-data",
  "permission-decision-word",
  "actual-permission-evaluation",
  "lifecycle-state-used-across-packages",
  "business-process",
  "wire-safe-event-envelope",
  "event-dispatch-or-retry",
  "accounting-vocabulary",
  "ledger-posting-calculation",
  "country-uom-master-row-ownership",
  "cross-package-business-record-reference-id",
  "required-by-only-one-package",
] as const;

export type KernelDecisionMatrixRowId =
  (typeof KERNEL_DECISION_MATRIX_ROW_IDS)[number];

export type KernelDecisionMatrixBelongsInKernel = true | false | "id-only";

export interface KernelDecisionMatrixRow {
  readonly belongsInKernel: KernelDecisionMatrixBelongsInKernel;
  readonly id: KernelDecisionMatrixRowId;
  readonly question: string;
  readonly yesOutcome: string;
}

export const KERNEL_DECISION_MATRIX_ROWS = {
  "id-crossing-package-boundaries": {
    id: "id-crossing-package-boundaries",
    question: "Is it an ID crossing package boundaries?",
    yesOutcome: "Branded ID",
    belongsInKernel: true,
  },
  "primitive-localization-format-code-crossing-packages": {
    id: "primitive-localization-format-code-crossing-packages",
    question: "Is it a primitive localization/format code crossing packages?",
    yesOutcome: "Branded primitive or localization context shape",
    belongsInKernel: true,
  },
  "uom-code-crossing-packages": {
    id: "uom-code-crossing-packages",
    question: "Is it a UOM code crossing packages?",
    yesOutcome: "Branded UomCode primitive",
    belongsInKernel: true,
  },
  "date-number-formatting-implementation": {
    id: "date-number-formatting-implementation",
    question: "Is it date/number formatting implementation?",
    yesOutcome: "Rendering/application behavior",
    belongsInKernel: false,
  },
  "selected-locale-timezone-date-format-value": {
    id: "selected-locale-timezone-date-format-value",
    question: "Is it selected locale/timezone/date-format value?",
    yesOutcome: "User/company/location setting",
    belongsInKernel: false,
  },
  "functional-base-reporting-currency-decision": {
    id: "functional-base-reporting-currency-decision",
    question: "Is it functional/base/reporting currency decision?",
    yesOutcome: "Finance/accounting/legal-entity configuration",
    belongsInKernel: false,
  },
  "fiscal-calendar-or-fiscal-period-behavior": {
    id: "fiscal-calendar-or-fiscal-period-behavior",
    question: "Is it fiscal calendar or fiscal period behavior?",
    yesOutcome: "Finance/accounting configuration",
    belongsInKernel: false,
  },
  "database-table-or-query": {
    id: "database-table-or-query",
    question: "Is it a database table or query?",
    yesOutcome: "Persistence",
    belongsInKernel: false,
  },
  "resolver-that-loads-real-data": {
    id: "resolver-that-loads-real-data",
    question: "Is it a resolver that loads real data?",
    yesOutcome: "Application/database behavior",
    belongsInKernel: false,
  },
  "permission-decision-word": {
    id: "permission-decision-word",
    question: "Is it a permission decision word?",
    yesOutcome: "Shared vocabulary",
    belongsInKernel: true,
  },
  "actual-permission-evaluation": {
    id: "actual-permission-evaluation",
    question: "Is it actual permission evaluation?",
    yesOutcome: "Runtime logic",
    belongsInKernel: false,
  },
  "lifecycle-state-used-across-packages": {
    id: "lifecycle-state-used-across-packages",
    question: "Is it a lifecycle state used across packages?",
    yesOutcome: "Shared vocabulary",
    belongsInKernel: true,
  },
  "business-process": {
    id: "business-process",
    question: "Is it a business process?",
    yesOutcome: "Domain behavior",
    belongsInKernel: false,
  },
  "wire-safe-event-envelope": {
    id: "wire-safe-event-envelope",
    question: "Is it a wire-safe event envelope?",
    yesOutcome: "Shared integration vocabulary",
    belongsInKernel: true,
  },
  "event-dispatch-or-retry": {
    id: "event-dispatch-or-retry",
    question: "Is it event dispatch or retry?",
    yesOutcome: "Execution runtime",
    belongsInKernel: false,
  },
  "accounting-vocabulary": {
    id: "accounting-vocabulary",
    question: "Is it accounting vocabulary?",
    yesOutcome: "Cross-domain contract",
    belongsInKernel: true,
  },
  "ledger-posting-calculation": {
    id: "ledger-posting-calculation",
    question: "Is it ledger/posting/calculation?",
    yesOutcome: "Accounting runtime",
    belongsInKernel: false,
  },
  "country-uom-master-row-ownership": {
    id: "country-uom-master-row-ownership",
    question: "Is it country/UOM master-row ownership?",
    yesOutcome: "Reference-data/domain persistence",
    belongsInKernel: false,
  },
  "cross-package-business-record-reference-id": {
    id: "cross-package-business-record-reference-id",
    question: "Is it a cross-package business record reference ID?",
    yesOutcome: "Business reference identity",
    belongsInKernel: "id-only",
  },
  "required-by-only-one-package": {
    id: "required-by-only-one-package",
    question: "Is it required by only one package?",
    yesOutcome: "Local concern",
    belongsInKernel: false,
  },
} satisfies Record<KernelDecisionMatrixRowId, KernelDecisionMatrixRow>;

export const KERNEL_DECISION_MATRIX_POLICY = {
  pasSection: "7",
  rowCount: KERNEL_DECISION_MATRIX_ROW_IDS.length,
  constitutionalRule:
    "Kernel owns cross-package vocabulary, branded IDs, wire-safe contracts, and shared integration shapes. Persistence, resolvers, evaluation runtime, domain processes, and accounting execution belong elsewhere.",
} as const;

const ROW_ID_SET = new Set<string>(KERNEL_DECISION_MATRIX_ROW_IDS);

export function isKernelDecisionMatrixRowId(
  value: string
): value is KernelDecisionMatrixRowId {
  return ROW_ID_SET.has(value);
}

export function getKernelDecisionMatrixRow(
  id: KernelDecisionMatrixRowId
): KernelDecisionMatrixRow {
  return KERNEL_DECISION_MATRIX_ROWS[id];
}

export function listKernelDecisionMatrixRows(): readonly KernelDecisionMatrixRow[] {
  return KERNEL_DECISION_MATRIX_ROW_IDS.map(
    (id) => KERNEL_DECISION_MATRIX_ROWS[id]
  );
}

export function kernelOwnsBoundaryConcern(
  id: KernelDecisionMatrixRowId
): boolean {
  const belongsInKernel = KERNEL_DECISION_MATRIX_ROWS[id].belongsInKernel;
  return belongsInKernel === true || belongsInKernel === "id-only";
}
