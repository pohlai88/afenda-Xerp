import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  SHADCN_STUDIO_CSS_PATH,
  SHADCN_STUDIO_PACKAGE_NAME,
  THEME_PRESET_SLUGS,
} from "../index.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
) as {
  name: string;
  dependencies?: Record<string, string>;
};

const PROHIBITED_RUNTIME_DEPENDENCIES = [
  "@afenda/css-authority",
  "@afenda/design-system",
  "@afenda/ui",
  "@afenda/appshell",
  "@afenda/metadata-ui",
  "@afenda/kernel",
  "@afenda/architecture-authority",
  "@afenda/database",
] as const;

describe("@afenda/shadcn-studio package scaffold", () => {
  it("declares the expected package name", () => {
    expect(packageJson.name).toBe("@afenda/shadcn-studio");
    expect(SHADCN_STUDIO_PACKAGE_NAME).toBe("@afenda/shadcn-studio");
  });

  it("ships base theme CSS at the documented export path", () => {
    expect(existsSync(join(packageRoot, "src/styles/shadcn-studio.css"))).toBe(
      true
    );
    expect(SHADCN_STUDIO_CSS_PATH).toBe("./shadcn-studio.css");
  });

  it("does not declare prohibited @afenda runtime packages", () => {
    const runtimeDependencies = Object.keys(packageJson.dependencies ?? {});

    for (const prohibited of PROHIBITED_RUNTIME_DEPENDENCIES) {
      expect(runtimeDependencies).not.toContain(prohibited);
    }
  });

  it("declares presentation runtime dependencies installed by shadcn CLI", () => {
    const runtimeDependencies = Object.keys(
      packageJson.dependencies ?? {}
    ).sort();

    expect(runtimeDependencies.length).toBeGreaterThan(0);
    expect(runtimeDependencies).toContain("@base-ui/react");
    expect(runtimeDependencies).toContain("tailwind-merge");
  });

  it("exports typed theme preset slugs (B39)", () => {
    expect(THEME_PRESET_SLUGS).toHaveLength(12);
  });
});
