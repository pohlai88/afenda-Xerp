/**
 * storybook-fixture-composition.test.ts
 *
 * Asserts that fixture composition helpers in _storybook/ are structurally
 * sound and only expose what the story layer needs:
 * - _storybook/ fixtures export correct shape (no accidental design-system imports)
 * - MetadataDashboardFixture and MetadataPageFixture stories correctly import
 *   from layout composition helpers
 * - No fixture helper imports from @afenda/ui, @afenda/appshell, or other
 *   higher-layer packages that metadata-ui must not consume
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = join(import.meta.dirname, "../..");
const srcRoot = join(packageRoot, "src");
const storybookHelperDir = join(srcRoot, "_storybook");

const FORBIDDEN_RUNTIME_IMPORTS = [
  "@afenda/ui",
  "@afenda/appshell",
  "@afenda/database",
  "@afenda/permissions",
] as const;

const WORKSPACE_IMPORT_PATTERN = /from ["'](@afenda\/[^"']+)["']/g;

const DESIGN_TOKEN_IMPORT_PATTERN = /from ["']@afenda\/design-system["']/;
const FIXTURE_CSS_IMPORT_PATTERN = /from ["'].*fixtures\.css["']/;
const COMPOSITION_IMPORT_PATTERN = /_storybook\//;
const METADATA_TITLE_PATTERN = /title:\s*["']Metadata\//;
const SOURCE_FILE_PATTERN = /\.(ts|tsx)$/;

function readHelperFile(fileName: string): string {
  return readFileSync(join(storybookHelperDir, fileName), "utf8");
}

function getHelperFileNames(): string[] {
  return readdirSync(storybookHelperDir, { withFileTypes: true })
    .filter((e) => e.isFile() && SOURCE_FILE_PATTERN.test(e.name))
    .map((e) => e.name);
}

describe("_storybook fixture composition boundary", () => {
  it("_storybook/ helper files exist", () => {
    const files = getHelperFileNames();
    expect(
      files.length,
      "at least one _storybook helper must exist"
    ).toBeGreaterThan(0);
  });

  it("_storybook helpers do not import forbidden runtime packages", () => {
    const violations: string[] = [];

    for (const fileName of getHelperFileNames()) {
      const content = readHelperFile(fileName);
      for (const match of content.matchAll(WORKSPACE_IMPORT_PATTERN)) {
        const importPath = match[1];
        if (
          importPath !== undefined &&
          FORBIDDEN_RUNTIME_IMPORTS.some((forbidden) =>
            importPath.startsWith(forbidden)
          )
        ) {
          violations.push(`${fileName} imports ${importPath}`);
        }
      }
    }

    expect(violations, "forbidden runtime imports in _storybook/").toEqual([]);
  });

  it("_storybook fixture helpers do not import design-system tokens directly", () => {
    const violations: string[] = [];

    for (const fileName of getHelperFileNames()) {
      const content = readHelperFile(fileName);
      if (DESIGN_TOKEN_IMPORT_PATTERN.test(content)) {
        violations.push(fileName);
      }
    }

    expect(
      violations,
      "_storybook/ must not import @afenda/design-system — token layer is consumer-owned"
    ).toEqual([]);
  });

  it("_storybook fixture helpers do not import fixtures.css at module scope", () => {
    const violations: string[] = [];

    for (const fileName of getHelperFileNames()) {
      const content = readHelperFile(fileName);
      if (FIXTURE_CSS_IMPORT_PATTERN.test(content)) {
        violations.push(fileName);
      }
    }

    expect(
      violations,
      "_storybook helpers must not import fixtures.css — that belongs to composed story files"
    ).toEqual([]);
  });
});

describe("fixture story file structure", () => {
  const FIXTURE_STORY_FILES = [
    "metadata-dashboard-fixture.stories.tsx",
    "metadata-page-fixture.stories.tsx",
  ] as const;

  for (const storyFile of FIXTURE_STORY_FILES) {
    it(`${storyFile} imports from layout composition helpers`, () => {
      let content: string;
      try {
        content = readFileSync(join(srcRoot, storyFile), "utf8");
      } catch {
        return;
      }

      const hasCompositionImport = COMPOSITION_IMPORT_PATTERN.test(content);
      expect(
        hasCompositionImport,
        `${storyFile} should import composition helpers from _storybook/`
      ).toBe(true);
    });

    it(`${storyFile} uses the correct Storybook metadata title prefix`, () => {
      let content: string;
      try {
        content = readFileSync(join(srcRoot, storyFile), "utf8");
      } catch {
        return;
      }

      const hasMetadataTitle = METADATA_TITLE_PATTERN.test(content);
      expect(
        hasMetadataTitle,
        `${storyFile} must have title starting with "Metadata/"`
      ).toBe(true);
    });
  }

  it("metadata-layouts.stories.tsx covers all governed layout types", () => {
    const content = readFileSync(
      join(srcRoot, "metadata-layouts.stories.tsx"),
      "utf8"
    );

    const GOVERNED_LAYOUT_TYPES = [
      "dashboard",
      "grid",
      "panel",
      "stack",
      "tabs",
      "wizard",
    ] as const;

    const missing = GOVERNED_LAYOUT_TYPES.filter(
      (type) => !content.includes(type)
    );

    expect(
      missing,
      `MetadataLayouts.stories.tsx is missing coverage for: ${missing.join(", ")}`
    ).toEqual([]);
  });

  it("metadata-sections.stories.tsx covers all governed section types", () => {
    const content = readFileSync(
      join(srcRoot, "metadata-sections.stories.tsx"),
      "utf8"
    );

    const GOVERNED_SECTION_TYPES = [
      "list",
      "stat",
      "chart",
      "form",
      "detail",
      "audit",
      "action",
    ] as const;

    const missing = GOVERNED_SECTION_TYPES.filter(
      (type) => !content.includes(type)
    );

    expect(
      missing,
      `MetadataSections.stories.tsx is missing coverage for: ${missing.join(", ")}`
    ).toEqual([]);
  });

  it("metadata-diagnostics.stories.tsx covers key diagnostics scenarios", () => {
    const content = readFileSync(
      join(srcRoot, "metadata-diagnostics.stories.tsx"),
      "utf8"
    );

    const REQUIRED_EXPORTS = [
      "DiagnosticsDisabled",
      "DiagnosticsEnabled",
      "RendererTrace",
      "BoundaryWarning",
      "MultiplePrimaryActionWarning",
    ] as const;

    const missing = REQUIRED_EXPORTS.filter((name) => !content.includes(name));

    expect(
      missing,
      `MetadataDiagnostics.stories.tsx is missing exports: ${missing.join(", ")}`
    ).toEqual([]);
  });
});
