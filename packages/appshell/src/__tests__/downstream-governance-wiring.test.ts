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

describe("@afenda/appshell downstream governance wiring", () => {
  it("imports resolveAppShellSlotClassName from @afenda/ui/governance", () => {
    const wiringSource = readFileSync(
      join(srcRoot, "wiring/governance.ts"),
      "utf8"
    );

    expect(wiringSource).toContain("resolveAppShellSlotClassName");
    expect(wiringSource).toContain("@afenda/ui/governance");
  });

  it("does not import @afenda/metadata-ui from production source", () => {
    const violations: string[] = [];

    for (const filePath of collectProductionSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      if (
        /from ["']@afenda\/metadata-ui["']/.test(content) ||
        /from ["']@afenda\/metadata-ui\//.test(content)
      ) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("does not import @afenda/metadata from production source", () => {
    const violations: string[] = [];

    for (const filePath of collectProductionSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      if (/from ["']@afenda\/metadata["']/.test(content)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("does not define duplicate recipe slot maps", () => {
    const forbidden = [
      "APP_SHELL_RECIPE_SLOTS",
      "METADATA_UI_RECIPE_SLOTS",
      "DENSITY_ATTRIBUTES",
    ];

    for (const filePath of collectProductionSourceFiles(srcRoot)) {
      const content = readFileSync(filePath, "utf8");
      for (const token of forbidden) {
        expect(content.includes(token), `${filePath} defines ${token}`).toBe(
          false
        );
      }
    }
  });
});
