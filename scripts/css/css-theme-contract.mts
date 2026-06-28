/**
 * PAS-005 B33 — CSS theme import chain contract (serializable checks, no browser).
 * B37 — docs Playwright pixel baseline wiring checks.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface CssThemeContractIssue {
  readonly code: string;
  readonly message: string;
}

export interface CssThemeContractOptions {
  readonly repoRoot: string;
}

const DOCS_PIXEL_BASELINES = [
  "use-erp-dark.png",
  "use-erp-light-cards.png",
  "use-erp-light-header.png",
] as const;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }
  return readFileSync(path, "utf8");
}

function validateUiImportChain(
  repoRoot: string,
  issues: CssThemeContractIssue[]
): void {
  const uiCssPath = join(repoRoot, "packages/ui/src/styles/afenda-ui.css");
  const uiCss = readText(uiCssPath);
  if (uiCss === null) {
    issues.push({ code: "ui-entry-missing", message: uiCssPath });
    return;
  }

  if (!uiCss.includes("@afenda/css-authority/css/afenda-tokens.css")) {
    issues.push({
      code: "ui-tokens-import",
      message: "afenda-ui.css must import css-authority afenda-tokens.css",
    });
  }
  if (!uiCss.includes("@afenda/css-authority/css/afenda-css-authority.css")) {
    issues.push({
      code: "ui-css-authority-import",
      message: "afenda-ui.css must import afenda-css-authority.css",
    });
  }
  if (uiCss.includes("afenda-design-system.css")) {
    issues.push({
      code: "ui-monolith-import",
      message: "afenda-ui.css must not import deprecated monolith",
    });
  }
}

function validateCssAuthorityTokens(
  repoRoot: string,
  issues: CssThemeContractIssue[]
): void {
  const tokensPath = join(
    repoRoot,
    "packages/css-authority/src/css/afenda-tokens.css"
  );
  const tokens = readText(tokensPath);
  if (tokens === null) {
    issues.push({ code: "ca-tokens-missing", message: tokensPath });
    return;
  }
  if (!tokens.includes("--afenda-")) {
    issues.push({
      code: "ca-tokens-empty",
      message: "css-authority afenda-tokens.css must define --afenda-* variables",
    });
  }
}

function validateRuntimeBridge(
  repoRoot: string,
  issues: CssThemeContractIssue[]
): void {
  const bridgePath = join(
    repoRoot,
    "packages/css-authority/src/css/afenda-runtime-bridge.css"
  );
  const bridge = readText(bridgePath);
  if (bridge === null) {
    issues.push({ code: "bridge-missing", message: bridgePath });
    return;
  }

  for (const marker of [
    "@generated",
    "PAS-005 B30",
    "@custom-variant dark",
    "@theme inline",
    "--background:",
  ] as const) {
    if (!bridge.includes(marker)) {
      issues.push({
        code: "bridge-marker",
        message: `afenda-runtime-bridge.css missing marker: ${marker}`,
      });
    }
  }
}

function validateStorybookSpotCheck(
  repoRoot: string,
  issues: CssThemeContractIssue[]
): void {
  const storyPath = join(
    repoRoot,
    "apps/storybook/stories/governance-integration-composed.stories.tsx"
  );
  const story = readText(storyPath);
  if (story === null) {
    issues.push({ code: "storybook-spot-check-missing", message: storyPath });
    return;
  }

  for (const imp of [
    "@afenda/ui/afenda-ui.css",
    "@afenda/appshell/afenda-appshell.css",
    "@afenda/metadata-ui/afenda-metadata-ui.css",
  ] as const) {
    if (!story.includes(imp)) {
      issues.push({
        code: "storybook-css-import",
        message: `Storybook composed story missing ${imp}`,
      });
    }
  }
}

function validateDocsPixelBaselines(
  repoRoot: string,
  issues: CssThemeContractIssue[]
): void {
  const pixelSpecPath = join(
    repoRoot,
    "apps/docs/e2e/docs-pixel-baseline.spec.ts"
  );
  const pixelSpec = readText(pixelSpecPath);
  if (pixelSpec === null) {
    issues.push({
      code: "pixel-spec-missing",
      message: pixelSpecPath,
    });
  } else {
    if (!pixelSpec.includes("@pixel")) {
      issues.push({
        code: "pixel-spec-tag",
        message: "docs-pixel-baseline.spec.ts must tag tests with @pixel",
      });
    }
    if (!pixelSpec.includes("toHaveScreenshot")) {
      issues.push({
        code: "pixel-spec-screenshot",
        message: "docs-pixel-baseline.spec.ts must use toHaveScreenshot",
      });
    }
  }

  const visualProofDir = join(repoRoot, "apps/docs/e2e/visual-proof");
  for (const baseline of DOCS_PIXEL_BASELINES) {
    const baselinePath = join(visualProofDir, baseline);
    if (!existsSync(baselinePath)) {
      issues.push({
        code: "pixel-baseline-missing",
        message: baselinePath,
      });
    }
  }

  const docsPackagePath = join(repoRoot, "apps/docs/package.json");
  const docsPackage = readText(docsPackagePath);
  if (docsPackage === null) {
    issues.push({ code: "docs-package-missing", message: docsPackagePath });
  } else if (!docsPackage.includes('"test:visual"')) {
    issues.push({
      code: "docs-test-visual-script",
      message: "apps/docs/package.json must define test:visual script",
    });
  }

  const playwrightConfigPath = join(
    repoRoot,
    "apps/docs/playwright.config.mts"
  );
  const playwrightConfig = readText(playwrightConfigPath);
  if (playwrightConfig === null) {
    issues.push({
      code: "docs-playwright-config-missing",
      message: playwrightConfigPath,
    });
    return;
  }

  const hasVisualProofTemplate =
    playwrightConfig.includes("visual-proof/{arg}");
  const hasScreenshotConfig = playwrightConfig.includes("toHaveScreenshot");
  if (!(hasVisualProofTemplate && hasScreenshotConfig)) {
    issues.push({
      code: "pixel-snapshot-path-template",
      message:
        "playwright.config.mts must route toHaveScreenshot to visual-proof/",
    });
  }
}

export function validateCssThemeContract(
  options: CssThemeContractOptions
): readonly CssThemeContractIssue[] {
  const { repoRoot } = options;
  const issues: CssThemeContractIssue[] = [];

  validateUiImportChain(repoRoot, issues);
  validateCssAuthorityTokens(repoRoot, issues);
  validateRuntimeBridge(repoRoot, issues);

  const distBundle = join(
    repoRoot,
    "packages/css-authority/dist/css/afenda-css-authority.css"
  );
  if (!existsSync(distBundle)) {
    issues.push({
      code: "dist-bundle-missing",
      message: `${distBundle} — run pnpm --filter @afenda/css-authority build`,
    });
  }

  validateStorybookSpotCheck(repoRoot, issues);
  validateDocsPixelBaselines(repoRoot, issues);

  return issues;
}
