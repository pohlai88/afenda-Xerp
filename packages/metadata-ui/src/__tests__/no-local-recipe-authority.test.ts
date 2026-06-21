import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = join(import.meta.dirname, "..");

const FORBIDDEN_LOCAL_AUTHORITY = [
  "METADATA_UI_RECIPE_SLOTS",
  "APP_SHELL_RECIPE_SLOTS",
  "DENSITY_ATTRIBUTES",
  "metadataUiSlotClassMap",
  "appShellSlotClassMap",
  "resolveAppShellSlotClassName",
] as const;

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

describe("metadata-ui no local recipe authority", () => {
  it("does not define governed recipe slot maps locally", () => {
    const violations: string[] = [];

    for (const filePath of collectProductionSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      for (const symbol of FORBIDDEN_LOCAL_AUTHORITY) {
        if (new RegExp(`\\b${symbol}\\b`).test(content)) {
          violations.push(`${filePath} references ${symbol}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("routes slot resolution through wiring/governance.ts", () => {
    const wiringSource = readFileSync(
      join(srcRoot, "wiring/governance.ts"),
      "utf8"
    );

    expect(wiringSource).toContain("resolveMetadataUiSlotClassName");
    expect(wiringSource).not.toContain("METADATA_UI_RECIPE_SLOTS =");
  });
});
