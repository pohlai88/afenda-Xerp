import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appshellSrcRoot = join(import.meta.dirname, "..");

const LEGACY_TREE_IMPORT =
  /from\s+["'](?:\.\/|\.\.\/)+shadcn-studio(?:\/|["'])/g;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name)) files.push(absolutePath);
  }

  return files;
}

describe("B42h legacy studio tree consumer scan", () => {
  it("has no relative imports from deleted packages/appshell/src/shadcn-studio/", () => {
    const violations: string[] = [];

    for (const filePath of collectSourceFiles(appshellSrcRoot)) {
      if (filePath.includes(`${join("src", "shadcn-studio-bridge")}`)) continue;
      const content = readFileSync(filePath, "utf8");
      if (LEGACY_TREE_IMPORT.test(content)) {
        violations.push(filePath);
      }
      LEGACY_TREE_IMPORT.lastIndex = 0;
    }

    expect(violations).toEqual([]);
  });

  it("routes governed presentation blocks through packages/appshell/src/presentation/", () => {
    expect(
      readdirSync(join(appshellSrcRoot, "presentation/blocks"), {
        withFileTypes: true,
      }).some((entry) => entry.name.startsWith("app-shell-account-settings"))
    ).toBe(true);
  });
});
