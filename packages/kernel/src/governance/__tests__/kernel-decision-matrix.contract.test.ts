import { describe, expect, it } from "vitest";
import {
  getKernelDecisionMatrixRow,
  isKernelDecisionMatrixRowId,
  KERNEL_DECISION_MATRIX_POLICY,
  KERNEL_DECISION_MATRIX_ROW_IDS,
  KERNEL_DECISION_MATRIX_ROWS,
  type KernelDecisionMatrixBelongsInKernel,
  kernelOwnsBoundaryConcern,
  listKernelDecisionMatrixRows,
} from "../index.js";

const PAS_SECTION_7_QUESTIONS = [
  "Is it an ID crossing package boundaries?",
  "Is it a primitive localization/format code crossing packages?",
  "Is it a UOM code crossing packages?",
  "Is it date/number formatting implementation?",
  "Is it selected locale/timezone/date-format value?",
  "Is it functional/base/reporting currency decision?",
  "Is it fiscal calendar or fiscal period behavior?",
  "Is it a database table or query?",
  "Is it a resolver that loads real data?",
  "Is it a permission decision word?",
  "Is it actual permission evaluation?",
  "Is it a lifecycle state used across packages?",
  "Is it a business process?",
  "Is it a wire-safe event envelope?",
  "Is it event dispatch or retry?",
  "Is it accounting vocabulary?",
  "Is it ledger/posting/calculation?",
  "Is it country/UOM master-row ownership?",
  "Is it a cross-package business record reference ID?",
  "Is it required by only one package?",
] as const;

const PAS_SECTION_7_YES_OUTCOMES = [
  "Branded ID",
  "Branded primitive or localization context shape",
  "Branded UomCode primitive",
  "Rendering/application behavior",
  "User/company/location setting",
  "Finance/accounting/legal-entity configuration",
  "Finance/accounting configuration",
  "Persistence",
  "Application/database behavior",
  "Shared vocabulary",
  "Runtime logic",
  "Shared vocabulary",
  "Domain behavior",
  "Shared integration vocabulary",
  "Execution runtime",
  "Cross-domain contract",
  "Accounting runtime",
  "Reference-data/domain persistence",
  "Business reference identity",
  "Local concern",
] as const;

const PAS_SECTION_7_BELONGS_IN_KERNEL: readonly KernelDecisionMatrixBelongsInKernel[] =
  [
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    "id-only",
    false,
  ];

describe("kernel decision matrix (PAS §7)", () => {
  it("registers exactly 20 PAS decision rows", () => {
    expect(KERNEL_DECISION_MATRIX_ROW_IDS).toHaveLength(20);
    expect(KERNEL_DECISION_MATRIX_POLICY.rowCount).toBe(20);
    expect(listKernelDecisionMatrixRows()).toHaveLength(20);
  });

  it("matches PAS §7 questions verbatim and in order", () => {
    const questions = listKernelDecisionMatrixRows().map((row) => row.question);
    expect(questions).toEqual([...PAS_SECTION_7_QUESTIONS]);
  });

  it("matches PAS §7 yes outcomes verbatim and in order", () => {
    const yesOutcomes = listKernelDecisionMatrixRows().map(
      (row) => row.yesOutcome
    );
    expect(yesOutcomes).toEqual([...PAS_SECTION_7_YES_OUTCOMES]);
  });

  it("matches PAS §7 belongs-in-kernel verdicts and in order", () => {
    const belongsInKernel = listKernelDecisionMatrixRows().map(
      (row) => row.belongsInKernel
    );
    expect(belongsInKernel).toEqual([...PAS_SECTION_7_BELONGS_IN_KERNEL]);
  });

  it("maps every row id to a registry row", () => {
    for (const id of KERNEL_DECISION_MATRIX_ROW_IDS) {
      expect(KERNEL_DECISION_MATRIX_ROWS[id].id).toBe(id);
      expect(isKernelDecisionMatrixRowId(id)).toBe(true);
      expect(getKernelDecisionMatrixRow(id).question.length).toBeGreaterThan(0);
    }
  });

  it("kernelOwnsBoundaryConcern returns true for yes and id-only rows", () => {
    expect(kernelOwnsBoundaryConcern("id-crossing-package-boundaries")).toBe(
      true
    );
    expect(
      kernelOwnsBoundaryConcern("cross-package-business-record-reference-id")
    ).toBe(true);
    expect(kernelOwnsBoundaryConcern("business-process")).toBe(false);
    expect(kernelOwnsBoundaryConcern("database-table-or-query")).toBe(false);
  });

  it("rejects unknown row ids", () => {
    expect(isKernelDecisionMatrixRowId("id-crossing-package-boundaries")).toBe(
      true
    );
    expect(isKernelDecisionMatrixRowId("unknown-concern")).toBe(false);
  });

  it("remains JSON-serializable for documentation and drift gates", () => {
    const serialized = JSON.parse(
      JSON.stringify({
        policy: KERNEL_DECISION_MATRIX_POLICY,
        rows: listKernelDecisionMatrixRows(),
      })
    ) as {
      policy: typeof KERNEL_DECISION_MATRIX_POLICY;
      rows: ReturnType<typeof listKernelDecisionMatrixRows>;
    };

    expect(serialized.policy.pasSection).toBe("7");
    expect(serialized.rows).toHaveLength(20);
  });
});
