import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export const docsBannedRuntimeImports = [
  "@afenda/erp",
  "@afenda/database",
  "@afenda/auth",
  "@afenda/permissions",
  "@afenda/kernel",
  "@afenda/appshell",
  "@afenda/ui",
] as const;

export type DocsBannedRuntimeImport = (typeof docsBannedRuntimeImports)[number];

const defaultSkipDirectories = new Set(["node_modules", ".next", ".source"]);

export function collectDocsSourceFiles(
  dir: string,
  acc: string[] = []
): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (defaultSkipDirectories.has(entry)) {
        continue;
      }
      collectDocsSourceFiles(fullPath, acc);
      continue;
    }
    if (/\.(tsx?|mdx)$/.test(entry)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

export function hasRuntimeImport(content: string, specifier: string): boolean {
  const escaped = specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const importPattern = new RegExp(
    `(?:from\\s+['"]${escaped}['"]|import\\(['"]${escaped}['"]\\)|require\\(['"]${escaped}['"]\\))`
  );
  return importPattern.test(content);
}

export function hasErpPathImport(content: string): boolean {
  return /(?:from|import)\s+['"][^'"]*apps\/erp/.test(content);
}

export function findBannedRuntimeImportViolations(
  scanRoots: readonly string[]
): { file: string; pkg: DocsBannedRuntimeImport }[] {
  const violations: { file: string; pkg: DocsBannedRuntimeImport }[] = [];

  for (const root of scanRoots) {
    for (const filePath of collectDocsSourceFiles(root)) {
      const content = readFileSync(filePath, "utf8");
      for (const pkg of docsBannedRuntimeImports) {
        if (hasRuntimeImport(content, pkg)) {
          violations.push({ file: filePath, pkg });
        }
      }
    }
  }

  return violations;
}

export function findErpCouplingViolations(
  scanRoots: readonly string[]
): string[] {
  const violations: string[] = [];

  for (const root of scanRoots) {
    for (const filePath of collectDocsSourceFiles(root)) {
      const content = readFileSync(filePath, "utf8");
      if (
        hasRuntimeImport(content, "@afenda/erp") ||
        hasErpPathImport(content)
      ) {
        violations.push(filePath);
      }
    }
  }

  return violations;
}
