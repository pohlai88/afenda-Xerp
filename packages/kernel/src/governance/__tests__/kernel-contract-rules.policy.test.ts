import { describe, expect, it } from "vitest";

import {
  getKernelContractRule,
  getKernelContractRuleByPasNumber,
  isKernelContractRuleId,
  KERNEL_CONTRACT_RULE_IDS,
  KERNEL_CONTRACT_RULES,
  KERNEL_CONTRACT_RULES_POLICY,
  listKernelContractRules,
} from "../kernel-contract-rules.policy.js";

const PAS_SECTION_9_DESCRIPTIONS = [
  "TypeScript strict mode.",
  "No project-internal imports except within kernel.",
  "JSON-serializable wire shape where used across boundaries.",
  "Branded IDs for cross-package identifiers.",
  "readonly object properties.",
  "Explicit null for absent runtime context.",
  "No silent fallback to tenant/company/org.",
  "No untyped string for governed IDs.",
  "No hidden business logic.",
  "No side effects during import.",
  "No duplicated current-source contract pattern.",
  "No greenfield replacement of existing brand or error helpers.",
  "No source-incompatible example stubs in canonical docs.",
] as const;

describe("kernel contract rules policy (PAS §9)", () => {
  it("registers exactly 13 PAS §9 rules", () => {
    expect(KERNEL_CONTRACT_RULE_IDS).toHaveLength(13);
    expect(KERNEL_CONTRACT_RULES).toHaveLength(13);
    expect(KERNEL_CONTRACT_RULES_POLICY.ruleCount).toBe(13);
    expect(listKernelContractRules()).toHaveLength(13);
  });

  it("matches PAS §9 descriptions verbatim and in order", () => {
    const descriptions = listKernelContractRules().map(
      (rule) => rule.description
    );
    expect(descriptions).toEqual([...PAS_SECTION_9_DESCRIPTIONS]);
  });

  it("numbers rules 1 through 13 without gaps", () => {
    const numbers = listKernelContractRules().map((rule) => rule.pasRuleNumber);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it("maps every rule id to a registry row", () => {
    for (const id of KERNEL_CONTRACT_RULE_IDS) {
      expect(isKernelContractRuleId(id)).toBe(true);
      expect(getKernelContractRule(id).id).toBe(id);
      expect(
        getKernelContractRuleByPasNumber(
          getKernelContractRule(id).pasRuleNumber
        )?.id
      ).toBe(id);
    }
  });

  it("documents delegated gates for cross-cutting rules", () => {
    expect(KERNEL_CONTRACT_RULES_POLICY.delegatedGateIds).toContain(
      "check:kernel-identity-surface"
    );
    expect(KERNEL_CONTRACT_RULES_POLICY.directGateId).toBe(
      "check:kernel-contract-rules"
    );
    expect(
      getKernelContractRule("json-serializable-wire-shape").enforcementGate
    ).toBe("pnpm check:kernel-events-wire-serializable");
  });

  it("keeps the policy JSON-serializable", () => {
    expect(() => JSON.stringify(KERNEL_CONTRACT_RULES_POLICY)).not.toThrow();
    expect(() => JSON.stringify(listKernelContractRules())).not.toThrow();
  });
});
