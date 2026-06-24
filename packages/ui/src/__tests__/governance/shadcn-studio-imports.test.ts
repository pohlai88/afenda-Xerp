/** @vitest-environment node */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const stagingRoot = join(packageRoot, "src/components/shadcn-studio");

const ALIAS_IMPORT = /^\s*import\s+(?:type\s+)?[\s\S]*?\sfrom\s+["']@\//u;

function stripQuotedLiterals(source: string): string {
  return source
    .replace(/`[\s\S]*?`/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, '""');
}

function collectStagingFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectStagingFiles(full));
      continue;
    }
    if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

const stagingFiles = collectStagingFiles(stagingRoot);

describe("shadcn-studio staging: internal relative imports", () => {
  it("includes staging reference files", () => {
    expect(stagingFiles.length).toBeGreaterThan(0);
  });

  for (const absPath of stagingFiles) {
    const rel = absPath
      .replace(`${packageRoot}\\`, "")
      .replace(`${packageRoot}/`, "");

    it(`${rel}: no @/ alias imports (use ../../ relative paths)`, () => {
      const source = stripQuotedLiterals(readFileSync(absPath, "utf8"));
      const aliasImportLines = source
        .split("\n")
        .filter((line) => ALIAS_IMPORT.test(line));

      expect(
        aliasImportLines,
        aliasImportLines.length > 0
          ? `Replace MCP alias imports with relative paths:\n${aliasImportLines.join("\n")}`
          : undefined
      ).toEqual([]);
    });
  }
});
