import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = join(import.meta.dirname, "..");

function collectProductionSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "_storybook") {
        continue;
      }
      files.push(...collectProductionSourceFiles(absolutePath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name) && !/\.stories\.tsx$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("metadata-ui UI governance wiring", () => {
  it("imports resolveMetadataUiSlotClassName from @afenda/ui/governance", () => {
    const wiringSource = readFileSync(
      join(srcRoot, "wiring/governance.ts"),
      "utf8"
    );

    expect(wiringSource).toContain("resolveMetadataUiSlotClassName");
    expect(wiringSource).toContain("@afenda/ui/governance");
  });

  it("still imports metadata contracts from @afenda/ui-composition", () => {
    const wiringSource = readFileSync(
      join(srcRoot, "wiring/governance.ts"),
      "utf8"
    );

    expect(wiringSource).toContain("@afenda/ui-composition");
  });

  it("does not import resolveAppShellSlotClassName from production source", () => {
    const violations: string[] = [];

    for (const filePath of collectProductionSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      if (content.includes("resolveAppShellSlotClassName")) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("does not import @afenda/appshell from production source", () => {
    const violations: string[] = [];

    for (const filePath of collectProductionSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      if (
        /from ["']@afenda\/appshell["']/.test(content) ||
        /from ["']@afenda\/appshell\//.test(content)
      ) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });
});
