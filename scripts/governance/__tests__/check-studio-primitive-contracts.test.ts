import { describe, expect, it } from "vitest";

import { checkStudioPrimitiveContracts } from "../check-studio-primitive-contracts.mjs";

describe("check-studio-primitive-contracts", () => {
  it("passes when all Base UI widget primitives have contract + adapter import + T1 test", () => {
    const violations = checkStudioPrimitiveContracts();
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
