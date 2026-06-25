import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scanRoots = [join(process.cwd(), "src"), join(process.cwd(), "content")];

function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (
        entry === "node_modules" ||
        entry === ".next" ||
        entry === ".source"
      ) {
        continue;
      }
      collectSourceFiles(fullPath, acc);
      continue;
    }
    if (/\.(tsx?|mdx)$/.test(entry)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function hasRuntimeImport(content: string, specifier: string): boolean {
  const escaped = specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const importPattern = new RegExp(
    `(?:from\\s+['"]${escaped}['"]|import\\(['"]${escaped}['"]\\)|require\\(['"]${escaped}['"]\\))`
  );
  return importPattern.test(content);
}

function hasErpPathImport(content: string): boolean {
  return /(?:from|import)\s+['"][^'"]*apps\/erp/.test(content);
}

describe("@afenda/docs no ERP runtime coupling", () => {
  it("does not import apps/erp paths or @afenda/erp package", () => {
    const violations: string[] = [];

    for (const root of scanRoots) {
      for (const filePath of collectSourceFiles(root)) {
        const content = readFileSync(filePath, "utf8");
        if (
          hasRuntimeImport(content, "@afenda/erp") ||
          hasErpPathImport(content)
        ) {
          violations.push(filePath);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
