import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, expectTypeOf, it } from "vitest";
import { studioPackageConfig } from "../configs/studio-config";
import {
  CANONICAL_THEME_TOKEN_NAMES,
  studioThemeConfig,
} from "../configs/theme-config";
import type { StudioPackageConfig, StudioRuntimeState } from "../types/studio";
import type {
  StudioResolvedThemeMode,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeOption,
  StudioThemeTokenMap,
  StudioThemeTokenName,
  StudioThemeUpdate,
} from "../types/theme";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const CONFIG_FILES = ["theme-config.ts", "studio-config.ts"] as const;
const RUNTIME_FORBIDDEN_IN_CONFIG = [
  '"use client"',
  'from "react"',
  "window.",
  "document.",
  "localStorage",
] as const;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("shadcn-studio-v2 config and runtime boundary", () => {
  it("keeps the public theme contract identity-only", () => {
    expectTypeOf<StudioThemeId>().toEqualTypeOf<
      | "shadcn-default"
      | "afenda-brand"
      | "caffeine"
      | "claude"
      | "corporate"
      | "ghibli-studio"
      | "marvel"
      | "material-design"
      | "modern-minimal"
      | "nature"
      | "perplexity"
      | "slack"
      | "pastel-dreams"
      | "swiss-noir"
      | "verdant-noir"
    >();
    expectTypeOf<StudioThemeMode>().toEqualTypeOf<
      "light" | "dark" | "system"
    >();
    expectTypeOf<StudioResolvedThemeMode>().toEqualTypeOf<"light" | "dark">();
    expectTypeOf<keyof StudioThemeOption>().toEqualTypeOf<
      "description" | "id" | "label" | "tokens"
    >();
    expectTypeOf<
      keyof StudioThemeTokenMap
    >().toEqualTypeOf<StudioThemeTokenName>();
    expectTypeOf<keyof StudioThemeUpdate>().toEqualTypeOf<"mode" | "themeId">();
  });

  it("keeps the studio runtime contract focused on package and theme state", () => {
    const serializedPackageConfig = JSON.stringify(studioPackageConfig);

    expect(studioPackageConfig.packageName).toBe("@afenda/shadcn-studio-v2");
    expect(studioPackageConfig.taxonomyVersion).toBe("v2");
    expect(studioPackageConfig.defaultExportSurface).toBe("neutral");
    expect(studioPackageConfig).toEqual({
      defaultExportSurface: "neutral",
      packageName: "@afenda/shadcn-studio-v2",
      taxonomyVersion: "v2",
    });
    expect(Object.hasOwn(studioPackageConfig, "runtimeBoundary")).toBe(false);
    expect(Object.hasOwn(studioPackageConfig, "navGroups")).toBe(false);
    expect(Object.hasOwn(studioPackageConfig, "navigation")).toBe(false);
    expect(Object.hasOwn(studioPackageConfig, "operatingContext")).toBe(false);
    expect(JSON.parse(serializedPackageConfig)).toEqual(studioPackageConfig);
    expectTypeOf<keyof StudioPackageConfig>().toEqualTypeOf<
      "defaultExportSurface" | "packageName" | "taxonomyVersion"
    >();
    expectTypeOf<keyof StudioRuntimeState>().toEqualTypeOf<
      "packageConfig" | "themeConfig"
    >();
  });

  it("keeps app-shell wire contracts out of the Phase 4 studio type file", () => {
    const studioTypes = readSource("types", "studio.ts");

    expect(studioTypes).not.toContain("AppShellNavItemWire");
    expect(studioTypes).not.toContain("AppShellNavGroupWire");
    expect(studioTypes).not.toContain("AppShellOperatingContextWire");
  });

  it("keeps layout wire contracts on their own Phase 5 surface", () => {
    const appShellTypes = readSource("types", "app-shell.ts");

    expect(appShellTypes).toContain("AppShellNavItemWire");
    expect(appShellTypes).toContain("readonly id: string");
  });

  it("keeps theme config defaults valid without selector authority", () => {
    const approvedThemeIds = [
      "shadcn-default",
      "afenda-brand",
      "caffeine",
      "claude",
      "corporate",
      "ghibli-studio",
      "marvel",
      "material-design",
      "modern-minimal",
      "nature",
      "perplexity",
      "slack",
      "pastel-dreams",
      "swiss-noir",
      "verdant-noir",
    ] as const;
    const themeIds = studioThemeConfig.themes.map((theme) => theme.id);

    expect(studioThemeConfig.defaultThemeId).toBe("afenda-brand");
    expect(Object.hasOwn(studioThemeConfig, "themeAttribute")).toBe(false);
    expect(studioThemeConfig.defaultMode).toBe("system");
    expect(studioThemeConfig.darkClassName).toBe("dark");
    expect(approvedThemeIds).toContain(studioThemeConfig.defaultThemeId);
    expect(themeIds).toEqual([...approvedThemeIds]);
    expect(new Set(themeIds).size).toBe(themeIds.length);
    expect(themeIds).toContain(studioThemeConfig.defaultThemeId);

    for (const theme of studioThemeConfig.themes) {
      expect(approvedThemeIds).toContain(theme.id);
      expect(Object.hasOwn(theme, "selector")).toBe(false);
      expect(Object.keys(theme.tokens.light)).toEqual([
        ...CANONICAL_THEME_TOKEN_NAMES,
      ]);
      expect(Object.keys(theme.tokens.dark)).toEqual([
        ...CANONICAL_THEME_TOKEN_NAMES,
      ]);
    }
  });

  it("keeps config files static and runtime-neutral", () => {
    for (const fileName of CONFIG_FILES) {
      const source = readSource("configs", fileName);

      for (const forbiddenText of RUNTIME_FORBIDDEN_IN_CONFIG) {
        expect(source).not.toContain(forbiddenText);
      }
    }
  });

  it("keeps React runtime behavior in contexts, hooks, and shared components", () => {
    expect(readSource("contexts", "ThemeProvider.tsx")).toContain(
      '"use client"'
    );
    expect(readSource("contexts", "StudioProvider.tsx")).toContain(
      '"use client"'
    );
    expect(readSource("hooks", "use-theme.ts")).toContain('"use client"');
    expect(readSource("hooks", "use-studio.ts")).toContain('"use client"');
    expect(readSource("components", "shared", "ThemeToggle.tsx")).toContain(
      '"use client"'
    );
    expect(readSource("components", "shared", "ThemeScript.tsx")).toContain(
      'data-slot="theme-script"'
    );
  });

  it("keeps the theme package export as an explicit client runtime boundary", () => {
    const themeBoundary = readSource("contexts", "theme-boundary.ts");

    expect(themeBoundary.trimStart().startsWith('"use client";')).toBe(true);
    expect(themeBoundary).toContain("StudioProvider");
    expect(themeBoundary).toContain("ThemeProvider");
    expect(themeBoundary).toContain("ThemeToggle");
    expect(themeBoundary).toContain("ThemeScript");
    expect(themeBoundary).toContain("useTheme");
    expect(themeBoundary).toContain("useStudio");
    expect(themeBoundary).toContain("StudioPresentationProviders");
    expect(themeBoundary).toContain("initialMode");
    expect(themeBoundary).toContain("initialThemeId");
    expect(themeBoundary).toContain("lockedThemeId");
    expect(themeBoundary).toContain("storageKey");
    expect(themeBoundary).not.toContain("ErpPresentationProviders");
  });

  it("keeps neutral exports free from client runtime providers", () => {
    const neutralSurface = readSource("index.ts");
    const serverSurface = readSource("server.ts");
    const clientSurface = readSource("clients.ts");
    const themeBoundary = readSource("contexts", "theme-boundary.ts");

    expect(neutralSurface).not.toContain("ThemeProvider");
    expect(neutralSurface).not.toContain("StudioProvider");
    expect(neutralSurface).not.toContain("ThemeToggle");
    expect(neutralSurface).not.toContain("ThemeScript");
    expect(neutralSurface).not.toContain("theme-boundary");
    expect(serverSurface).not.toContain("ThemeProvider");
    expect(serverSurface).not.toContain("StudioProvider");
    expect(serverSurface).not.toContain("ThemeToggle");
    expect(serverSurface).not.toContain("ThemeScript");
    expect(serverSurface).not.toContain("theme-boundary");
    expect(serverSurface).not.toContain('from "./index"');
    expect(clientSurface.trimStart().startsWith('"use client";')).toBe(true);
    expect(clientSurface).toContain("ThemeProvider");
    expect(clientSurface).toContain("StudioProvider");
    expect(clientSurface).toContain("ThemeToggle");
    expect(clientSurface).toContain("ThemeScript");
    expect(themeBoundary).toContain("ThemeProvider");
  });
});
