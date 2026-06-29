#!/usr/bin/env tsx
/**
 * PAS-005 B33 — CSS theme visual regression contract gate (import chain + dist + Storybook spot-check).
 */

import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { validateCssThemeContract } from "../css/css-theme-contract.mts";

const repoRoot = join(fileURLToPath(import.meta.url), "../../..");

const issues = validateCssThemeContract({ repoRoot });

if (issues.length > 0) {
  process.stderr.write("css-visual-regression: FAIL\n");
  for (const issue of issues) {
    process.stderr.write(`  [${issue.code}] ${issue.message}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  "css-visual-regression: PASS (import chain + bridge markers + Storybook composed spot-check + docs pixel baselines wired)\n"
);
