import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const executionContextContractPath = join(
  fileURLToPath(
    new URL("../contracts/execution-context.contract.ts", import.meta.url)
  )
);

describe("execution context export parity (PAS-001 §4.3)", () => {
  it("does not export assertExecutionContext from execution-context.contract.ts", () => {
    const source = readFileSync(executionContextContractPath, "utf8");

    expect(source).not.toMatch(
      /export\s+(async\s+)?function\s+assertExecutionContext\b/
    );
    expect(source).not.toMatch(/export\s*\{[^}]*\bassertExecutionContext\b/);
    expect(source).not.toMatch(/export\s+const\s+assertExecutionContext\b/);
  });
});
