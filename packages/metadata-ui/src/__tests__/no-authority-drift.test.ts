import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = join(import.meta.dirname, "..");

const forbiddenAuthorityArrays = [
  "SURFACE_TYPES",
  "LAYOUT_TYPES",
  "SECTION_TYPES",
  "PRESENTATION_MODES",
  "METADATA_DENSITY_MODES",
  "METADATA_RUNTIME_STATES",
  "RENDERER_CAPABILITIES",
  "METADATA_AUTHORITY_KEYS",
] as const;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("no authority drift", () => {
  it("does not redefine governed metadata arrays locally", () => {
    const violations: string[] = [];

    for (const filePath of collectSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      for (const arrayName of forbiddenAuthorityArrays) {
        if (new RegExp(`export const ${arrayName}\\s*=`).test(content)) {
          violations.push(`${filePath} defines ${arrayName}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
