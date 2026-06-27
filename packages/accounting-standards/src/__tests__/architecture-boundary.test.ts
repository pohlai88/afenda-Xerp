import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const APPROVED_RUNTIME_DEPENDENCIES = ["@afenda/kernel"] as const;

const PROHIBITED_RUNTIME_DEPENDENCIES = [
  "@afenda/database",
  "@afenda/accounting",
  "@afenda/ui",
  "@afenda/metadata-ui",
  "@afenda/appshell",
] as const;

describe("@afenda/accounting-standards architecture boundary", () => {
  it("allows only Kernel as a runtime dependency", () => {
    const runtimeDependencies = Object.keys(packageJson.dependencies ?? {});

    expect(runtimeDependencies.sort()).toEqual(
      [...APPROVED_RUNTIME_DEPENDENCIES].sort()
    );
  });

  it("does not declare prohibited runtime packages", () => {
    const runtimeDependencies = Object.keys(packageJson.dependencies ?? {});

    for (const prohibited of PROHIBITED_RUNTIME_DEPENDENCIES) {
      expect(runtimeDependencies).not.toContain(prohibited);
    }
  });
});
