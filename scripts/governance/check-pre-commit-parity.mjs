#!/usr/bin/env node
/**
 * CI/local parity for the Husky pre-commit chain (without lint-staged file mutation).
 *
 * Mirrors what `.husky/pre-commit` enforces before lint-staged runs on staged files:
 * - Husky hook → package.json scripts.precommit contract
 * - biome-editor-policy (lint-staged + editor settings SSOT)
 * - package CSS src/ vs dist/ sync for presentation packages
 *
 * Usage:
 *   node scripts/governance/check-pre-commit-parity.mjs
 *   pnpm check:pre-commit-parity
 *
 * @see scripts/governance/biome-editor-policy.mjs
 * @see .github/workflows/pre-commit-governance.yml
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BIOME_EDITOR_POLICY,
  checkBiomeEditorSync,
} from "./biome-editor-policy.mjs";
import { checkPackageCssDistSync } from "./package-css-dist-policy.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {string[]} */
const violations = [];

let huskyHook = "";

try {
  huskyHook = readFileSync(
    join(repoRoot, BIOME_EDITOR_POLICY.huskyPreCommitPath),
    "utf8"
  ).trim();
} catch {
  violations.push(
    `${BIOME_EDITOR_POLICY.huskyPreCommitPath} is missing — run pnpm prepare`
  );
}

if (huskyHook && huskyHook !== "pnpm precommit") {
  violations.push(
    `${BIOME_EDITOR_POLICY.huskyPreCommitPath} must be exactly "pnpm precommit" (found: ${JSON.stringify(huskyHook)})`
  );
}

const editorSync = checkBiomeEditorSync(repoRoot);

if (!editorSync.ok) {
  for (const violation of editorSync.violations) {
    violations.push(`[biome-editor-sync] ${violation}`);
  }
}

const cssDist = checkPackageCssDistSync(repoRoot);

if (!cssDist.ok) {
  for (const violation of cssDist.violations) {
    violations.push(`[package-css-dist] ${violation}`);
  }
}

if (violations.length === 0) {
  process.stdout.write("pre-commit parity: OK\n");
  process.exit(0);
}

process.stderr.write("pre-commit parity: FAIL\n");

for (const violation of violations) {
  process.stderr.write(`- ${violation}\n`);
}

process.stderr.write(
  "\nFix: pnpm prepare && pnpm check:husky-sync && pnpm sync:package-css-dist && pnpm check:package-css-dist-sync\n"
);
process.exit(1);
