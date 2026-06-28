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

const ALLOWED_RUNTIME_DEPENDENCIES = [
  "@radix-ui/react-label",
  "@radix-ui/react-select",
  "@radix-ui/react-slot",
  "class-variance-authority",
  "clsx",
  "lucide-react",
  "next-themes",
  "react",
  "tailwind-merge",
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

  it("declares only Phase-1 presentation runtime dependencies", () => {
    expect(Object.keys(packageJson.dependencies ?? {}).sort()).toEqual(
      [...ALLOWED_RUNTIME_DEPENDENCIES].sort()
    );
  });

  it("does not declare prohibited @afenda runtime packages", () => {
    const runtimeDependencies = Object.keys(packageJson.dependencies ?? {});

    for (const prohibited of PROHIBITED_RUNTIME_DEPENDENCIES) {
      expect(runtimeDependencies).not.toContain(prohibited);
    }
  });

  it("exports typed theme preset slugs (B39)", () => {
    expect(THEME_PRESET_SLUGS).toHaveLength(12);
  });
});
