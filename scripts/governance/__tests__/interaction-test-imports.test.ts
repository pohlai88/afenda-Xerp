import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(import.meta.dirname, "../../..");

function collectInteractionTestFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      files.push(...collectInteractionTestFiles(fullPath));
      continue;
    }

    if (/\.interaction\.test\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("interaction test import governance (ARCH-TEST-001 Slice 5A)", () => {
  it("interaction suites use @afenda/testing/react and avoid fireEvent", () => {
    const interactionFiles = collectInteractionTestFiles(REPO_ROOT);

    expect(interactionFiles.length).toBeGreaterThan(0);

    for (const filePath of interactionFiles) {
      const source = readFileSync(filePath, "utf8");
      const relativePath = path.relative(REPO_ROOT, filePath);

      expect(
        source,
        `${relativePath} must import interaction helpers from @afenda/testing/react`
      ).toMatch(/@afenda\/testing\/react/);

      expect(
        source,
        `${relativePath} must not import fireEvent from @testing-library/react`
      ).not.toMatch(
        /import\s*\{[^}]*\bfireEvent\b[^}]*\}\s*from\s*["']@testing-library\/react["']/
      );
    }
  });
});
