import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = join(process.cwd());
const scanRoots = [join(docsRoot, "src"), join(docsRoot, "content")];

const bannedRuntimeImports = [
  "@afenda/erp",
  "@afenda/database",
  "@afenda/auth",
  "@afenda/permissions",
  "@afenda/kernel",
  "@afenda/appshell",
  "@afenda/ui",
] as const;

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
  it("does not import @afenda/erp in docs app source or content", () => {
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

describe("@afenda/docs no afenda runtime imports", () => {
  it("does not import banned @afenda/* runtime packages", () => {
    const violations: { file: string; pkg: string }[] = [];

    for (const root of scanRoots) {
      for (const filePath of collectSourceFiles(root)) {
        const content = readFileSync(filePath, "utf8");
        for (const pkg of bannedRuntimeImports) {
          if (hasRuntimeImport(content, pkg)) {
            violations.push({ file: filePath, pkg });
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("allows dev-only @afenda/typescript-config in package.json only", () => {
    const pkgJson = readFileSync(join(docsRoot, "package.json"), "utf8");
    expect(pkgJson).toContain("@afenda/typescript-config");
  });
});
