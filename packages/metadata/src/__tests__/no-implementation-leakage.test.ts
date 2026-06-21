import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const PROHIBITED_IMPORTS = [
  "react",
  "react-dom",
  "next",
  "@afenda/metadata-ui",
  "@afenda/appshell",
  "@afenda/ui",
  "@afenda/permissions",
  "@afenda/database",
  "drizzle-orm",
] as const;

const PROHIBITED_PATTERNS = [
  '"use client"',
  '"use server"',
  ".tsx",
  ".css",
  ".module.css",
  "tailwind",
  "className",
  "JSX",
] as const;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectSourceFiles(fullPath));
      continue;
    }
    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("no implementation leakage", () => {
  it("does not import prohibited packages or use UI/runtime patterns", () => {
    const srcRoot = join(fileURLToPath(new URL("../", import.meta.url)));
    const sourceFiles = collectSourceFiles(srcRoot);

    expect(sourceFiles.length).toBeGreaterThan(0);

    for (const filePath of sourceFiles) {
      const contents = readFileSync(filePath, "utf8");
      const relativePath = filePath
        .replace(`${srcRoot}\\`, "")
        .replace(`${srcRoot}/`, "");

      for (const prohibitedImport of PROHIBITED_IMPORTS) {
        expect(
          contents.includes(`from "${prohibitedImport}"`) ||
            contents.includes(`from '${prohibitedImport}'`),
          `${relativePath} must not import ${prohibitedImport}`
        ).toBe(false);
      }

      const isGovernanceContract = relativePath.endsWith(".contract.ts");

      for (const pattern of PROHIBITED_PATTERNS) {
        if (isGovernanceContract) {
          continue;
        }

        expect(
          contents.includes(pattern),
          `${relativePath} must not contain ${pattern}`
        ).toBe(false);
      }
    }
  });
});
