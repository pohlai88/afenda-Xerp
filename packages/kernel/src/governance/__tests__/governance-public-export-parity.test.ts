import { describe, expect, it } from "vitest";
import * as kernelRoot from "../../index.js";
import * as governanceBarrel from "../index.js";

const GOVERNANCE_ROOT_EXPORT_KEYS = [
  "getKernelBoundaryDriftEntry",
  "getKernelContractRule",
  "getKernelContractRuleByPasNumber",
  "getKernelDecisionMatrixRow",
  "getKernelImplementationSequenceStep",
  "getKernelProhibitedOwnershipConcern",
  "getKernelRuntimeRule",
  "isKernelBoundaryDriftEntryId",
  "isKernelBoundaryDriftPath",
  "isKernelContractRuleId",
  "isKernelDecisionMatrixRowId",
  "isKernelImplementationSequenceStepId",
  "isKernelProhibitedOwnershipConcernId",
  "isKernelRuntimeRuleId",
  "KERNEL_APPROVED_RUNTIME_PRIMITIVE_IDS",
  "KERNEL_APPROVED_RUNTIME_PRIMITIVES",
  "KERNEL_BOUNDARY_CANONICAL_PRIMITIVE_PATHS",
  "KERNEL_BOUNDARY_DRIFT_DISPOSITIONS",
  "KERNEL_BOUNDARY_DRIFT_ENTRIES",
  "KERNEL_BOUNDARY_DRIFT_ENTRY_IDS",
  "KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS",
  "KERNEL_BOUNDARY_DRIFT_POLICY",
  "KERNEL_BOUNDARY_DRIFT_REFACTOR_STATUSES",
  "KERNEL_CONTRACT_RULE_IDS",
  "KERNEL_CONTRACT_RULES",
  "KERNEL_CONTRACT_RULES_POLICY",
  "KERNEL_DECISION_MATRIX_POLICY",
  "KERNEL_DECISION_MATRIX_ROW_IDS",
  "KERNEL_DECISION_MATRIX_ROWS",
  "KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS",
  "KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_PATHS",
  "KERNEL_IMPLEMENTATION_SEQUENCE_POLICY",
  "KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS",
  "KERNEL_IMPLEMENTATION_SEQUENCE_STEPS",
  "KERNEL_PROHIBITED_OWNERSHIP_CATEGORIES",
  "KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS",
  "KERNEL_PROHIBITED_OWNERSHIP_CONCERNS",
  "KERNEL_PROHIBITED_OWNERSHIP_POLICY",
  "KERNEL_RUNTIME_RULE_IDS",
  "KERNEL_RUNTIME_RULES",
  "KERNEL_RUNTIME_RULES_AUTHORITY",
  "KERNEL_RUNTIME_RULES_POLICY",
  "kernelOwnsBoundaryConcern",
  "listKernelBoundaryDriftEntries",
  "listKernelContractRules",
  "listKernelDecisionMatrixRows",
  "listKernelImplementationSequenceSteps",
  "listKernelProhibitedOwnershipConcerns",
  "listKernelRuntimeRules",
] as const satisfies readonly (keyof typeof governanceBarrel)[];

describe("governance public export parity (PAS-001 §6.4 / root vs ./governance)", () => {
  it("re-exports every ./governance registry symbol from @afenda/kernel root", () => {
    for (const exportKey of GOVERNANCE_ROOT_EXPORT_KEYS) {
      expect(kernelRoot[exportKey], exportKey).toBe(
        governanceBarrel[exportKey]
      );
    }
  });

  it("preserves reference identity for policy singletons across barrels", () => {
    expect(kernelRoot.KERNEL_BOUNDARY_DRIFT_POLICY).toBe(
      governanceBarrel.KERNEL_BOUNDARY_DRIFT_POLICY
    );
    expect(kernelRoot.KERNEL_CONTRACT_RULES_POLICY).toBe(
      governanceBarrel.KERNEL_CONTRACT_RULES_POLICY
    );
    expect(kernelRoot.KERNEL_DECISION_MATRIX_POLICY).toBe(
      governanceBarrel.KERNEL_DECISION_MATRIX_POLICY
    );
    expect(kernelRoot.KERNEL_PROHIBITED_OWNERSHIP_POLICY).toBe(
      governanceBarrel.KERNEL_PROHIBITED_OWNERSHIP_POLICY
    );
    expect(kernelRoot.KERNEL_RUNTIME_RULES_POLICY).toBe(
      governanceBarrel.KERNEL_RUNTIME_RULES_POLICY
    );
  });
});
