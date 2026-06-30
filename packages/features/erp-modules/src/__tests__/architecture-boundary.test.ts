import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  dependencies?: Record<string, string>;
};

const PROHIBITED_RUNTIME_DEPENDENCIES = [
  "@afenda/architecture-authority",
  "@afenda/database",
  "@afenda/erp-module-foundation",
  "@afenda/kernel",
  "@afenda/metadata-ui",
  "@afenda/ui-composition",
  "@afenda/ui",
  "@afenda/appshell",
] as const;

describe("@afenda/erp-modules architecture boundary", () => {
  it("declares zero runtime dependencies (scaffold-only package)", () => {
    const runtimeDependencies = Object.keys(packageJson.dependencies ?? {});
    expect(runtimeDependencies).toEqual([]);
  });

  it("does not declare prohibited runtime packages", () => {
    const runtimeDependencies = Object.keys(packageJson.dependencies ?? {});

    for (const prohibited of PROHIBITED_RUNTIME_DEPENDENCIES) {
      expect(runtimeDependencies).not.toContain(prohibited);
    }
  });
});
