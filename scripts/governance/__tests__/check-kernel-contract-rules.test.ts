import { describe, expect, it } from "vitest";

import {
  checkKernelContractRules,
  formatKernelContractRulesViolations,
} from "../check-kernel-contract-rules.mts";

describe("check-kernel-contract-rules", () => {
  it("passes on the current repository state", () => {
    const violations = checkKernelContractRules();

    expect(violations, formatKernelContractRulesViolations(violations)).toEqual(
      []
    );
  });

  it("formats violations for diagnostics", () => {
    const formatted = formatKernelContractRulesViolations([
      {
        rule: "contract-readonly-property",
        file: "packages/kernel/src/contracts/example.contract.ts",
        message: 'Property "field" must be readonly (PAS §9 rule 5)',
      },
    ]);

    expect(formatted).toContain("[contract-readonly-property]");
    expect(formatted).toContain("example.contract.ts");
  });
});
