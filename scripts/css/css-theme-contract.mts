/**
 * PAS-005 B33 — CSS theme import chain contract (serializable checks, no browser).
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

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }
  return readFileSync(path, "utf8");
}

export function validateCssThemeContract(
  options: CssThemeContractOptions
): readonly CssThemeContractIssue[] {
  const { repoRoot } = options;
  const issues: CssThemeContractIssue[] = [];

  const uiCssPath = join(repoRoot, "packages/ui/src/styles/afenda-ui.css");
  const uiCss = readText(uiCssPath);
  if (uiCss === null) {
    issues.push({ code: "ui-entry-missing", message: uiCssPath });
  } else {
    if (!uiCss.includes("@afenda/design-system/css/afenda-tokens.css")) {
      issues.push({
        code: "ui-tokens-import",
        message: "afenda-ui.css must import afenda-tokens.css",
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

  const shimPath = join(
    repoRoot,
    "packages/design-system/src/css/afenda-design-system.css"
  );
  const shim = readText(shimPath);
  if (shim === null) {
    issues.push({ code: "ds-shim-missing", message: shimPath });
  } else if (!shim.includes("@deprecated")) {
    issues.push({
      code: "ds-shim-deprecated",
      message: "afenda-design-system.css must be B30 deprecation shim",
    });
  }

  const bridgePath = join(
    repoRoot,
    "packages/css-authority/src/css/afenda-runtime-bridge.css"
  );
  const bridge = readText(bridgePath);
  if (bridge === null) {
    issues.push({ code: "bridge-missing", message: bridgePath });
  } else {
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

  const storyPath = join(
    repoRoot,
    "apps/storybook/stories/governance-integration-composed.stories.tsx"
  );
  const story = readText(storyPath);
  if (story === null) {
    issues.push({ code: "storybook-spot-check-missing", message: storyPath });
  } else {
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

  return issues;
}
