import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const contextRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN_ACCOUNTING_PATTERNS = [
  /journal\.post/i,
  /insertJournal/i,
  /postJournal/i,
  /\bledger\b/i,
  /consolidationElimination/i,
  /TIP-013/i,
  /general_ledger/i,
  /chart_of_accounts/i,
] as const;

function collectContextSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectContextSourceFiles(absolutePath));
      continue;
    }

    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("accounting-readiness integration — operating context resolver", () => {
  it("loads ownership interests and consolidation scope in spine modules", () => {
    const consolidationSource = readFileSync(
      join(contextRoot, "resolve-consolidation-scope.server.ts"),
      "utf8"
    );
    const ownershipLoaderSource = readFileSync(
      join(contextRoot, "load-operating-context-ownership-interests.server.ts"),
      "utf8"
    );

    expect(consolidationSource).toContain("resolveConsolidationScope");
    expect(ownershipLoaderSource).toContain("toOwnershipInterestContext");
    expect(consolidationSource).not.toContain("ownershipInterests: []");
    expect(consolidationSource).not.toContain("consolidationScope: null,");
  });

  it("maps database ownership records into kernel context", () => {
    const source = readFileSync(
      join(contextRoot, "to-ownership-interest-context.ts"),
      "utf8"
    );

    expect(source).toContain("consolidationTreatment");
    expect(source).toContain("childLegalEntityId");
  });

  it("exposes resolveAccountingReadinessContext at the ERP trust boundary", () => {
    const source = readFileSync(
      join(contextRoot, "resolve-accounting-readiness.server.ts"),
      "utf8"
    );

    expect(source).toContain("toAccountingReadinessContext");
    expect(source).not.toContain("@afenda/accounting");
  });
});

describe("accounting-readiness integration — prohibited accounting work", () => {
  it("does not introduce journal, ledger, or TIP-013 code in context layer", () => {
    const violations: string[] = [];

    for (const filePath of collectContextSourceFiles(contextRoot)) {
      const content = readFileSync(filePath, "utf8");
      for (const pattern of FORBIDDEN_ACCOUNTING_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(`${filePath} matched ${pattern.source}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
