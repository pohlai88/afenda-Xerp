import { describe, expect, it } from "vitest";

import {
  checkKernelForbiddenRuntimeAccess,
  formatKernelForbiddenRuntimeAccessViolations,
} from "../check-kernel-forbidden-runtime-access.mts";

describe("check-kernel-forbidden-runtime-access", () => {
  it("passes on the current repository state", () => {
    const violations = checkKernelForbiddenRuntimeAccess();

    expect(
      violations,
      formatKernelForbiddenRuntimeAccessViolations(violations)
    ).toEqual([]);
  });

  it("formats violations for diagnostics", () => {
    const formatted = formatKernelForbiddenRuntimeAccessViolations([
      {
        rule: "forbidden-process-env",
        file: "packages/kernel/src/example.ts",
        message: "Kernel must not read process.env (PAS §10 rule 2).",
      },
    ]);

    expect(formatted).toContain("[forbidden-process-env]");
    expect(formatted).toContain("example.ts");
  });
});
