import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const metadataUiRoot = join(import.meta.dirname, "../..");
const metadataRoot = join(metadataUiRoot, "../metadata");

const productionCss = readFileSync(
  join(metadataUiRoot, "src/styles.css"),
  "utf8"
);

const fixturesCss = readFileSync(
  join(metadataUiRoot, "src/fixtures/metadata-ui-fixtures.css"),
  "utf8"
);

const FIXTURE_SELECTOR_PATTERN = /\.metadata-fixture-/;
const DESIGN_TOKEN_PATTERNS = [
  /--color-/,
  /--font-/,
  /--radius-/,
  /--spacing-/,
];
const LEADING_CLASS_SELECTOR_PATTERN = /^\.([\w-]+)/gm;

describe("metadata-ui CSS boundary", () => {
  it("production styles.css contains no fixture selectors", () => {
    expect(productionCss).not.toMatch(FIXTURE_SELECTOR_PATTERN);
  });

  it("production styles.css does not define design tokens", () => {
    for (const tokenPattern of DESIGN_TOKEN_PATTERNS) {
      expect(productionCss).not.toMatch(tokenPattern);
    }
  });

  it("fixtures CSS contains only fixture-prefixed selectors and container references", () => {
    const selectors: string[] = [];

    for (const match of fixturesCss.matchAll(LEADING_CLASS_SELECTOR_PATTERN)) {
      if (match[1]) {
        selectors.push(match[1]);
      }
    }

    for (const selector of selectors) {
      expect(
        selector.startsWith("metadata-fixture-"),
        `"${selector}" should start with "metadata-fixture-"`
      ).toBe(true);
    }
  });

  it("production styles.css exports governed component classes", () => {
    const requiredClasses = [
      ".metadata-container",
      ".metadata-layout",
      ".metadata-surface",
      ".metadata-section",
      ".metadata-action-bar",
      ".metadata-action-button",
      ".metadata-action-link",
      ".metadata-state",
      ".metadata-diagnostics-panel",
      ".metadata-surface-title",
      ".metadata-section-title",
      ".metadata-visually-hidden",
      ".metadata-numeric",
      ".metadata-truncate",
      ".metadata-wrap-anywhere",
      ".metadata-surface-readonly",
      ".metadata-section-disabled",
      ".metadata-layout-toolbar",
      ".metadata-surface-toolbar",
      ".metadata-layout-footer",
      ".metadata-surface-footer",
      ".metadata-section-footer",
      ".metadata-action-menu",
      ".metadata-action-menu-label",
      ".metadata-action-menu-item",
      ".metadata-diagnostics-title",
      ".metadata-render-trace",
      ".metadata-boundary-warning",
    ];

    for (const cls of requiredClasses) {
      expect(productionCss).toContain(cls);
    }
  });

  it("@afenda/metadata has no CSS files", () => {
    const metadataSrcStyles = join(metadataRoot, "src/styles");
    expect(existsSync(metadataSrcStyles)).toBe(false);
  });

  it("package.json exposes both styles.css and fixtures.css", () => {
    const packageJson = JSON.parse(
      readFileSync(join(metadataUiRoot, "package.json"), "utf8")
    ) as { exports?: Record<string, unknown>; sideEffects?: unknown };

    expect(packageJson.exports?.["./styles.css"]).toBeDefined();
    expect(packageJson.exports?.["./fixtures.css"]).toBeDefined();

    expect(packageJson.sideEffects).toContain("./dist/styles.css");
    expect(packageJson.sideEffects).toContain(
      "./dist/fixtures/metadata-ui-fixtures.css"
    );
  });
});
