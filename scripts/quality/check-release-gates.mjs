/**
 * TIP-009 release gate meta-check.
 *
 * Validates that the TIP-009 governance structure itself is intact:
 *   - all required workflow files exist
 *   - ci.yml runs every required command
 *   - root package.json defines every required quality script
 *   - the TIP-009 delivery document exists
 *
 * This script is the self-referential integrity lock for the delivery spine.
 * It must pass before any release reaches a protected branch.
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

const requiredFiles = [
  ".node-version",
  ".github/workflows/ci.yml",
  ".github/workflows/preview.yml",
  ".github/workflows/release-verification.yml",
  "docs/delivery/tip-009-ci-cd-preview.md",
];

const requiredCiCommands = [
  "pnpm ci:biome",
  "pnpm typecheck",
  "pnpm test:run",
  "pnpm build",
  "pnpm quality:boundaries",
  "pnpm quality:exports",
  "pnpm quality:migrations",
  "pnpm quality:architecture",
  "pnpm quality:architecture-drift",
  "pnpm quality:release-gate",
];

const requiredReleaseVerificationGates = [
  "pnpm typecheck",
  "pnpm ci:biome",
  "pnpm test:run",
  "pnpm build",
  "pnpm quality:boundaries",
  "pnpm quality:migrations",
  "pnpm quality:exports",
  "pnpm quality:architecture",
  "pnpm quality:architecture-drift",
  "pnpm quality:release-gate",
];

const requiredQualityScripts = [
  "quality",
  "quality:boundaries",
  "quality:exports",
  "quality:migrations",
  "quality:architecture",
  "quality:architecture-drift",
  "quality:preview-policy",
  "quality:release-gate",
  "ci:biome",
];

const failures = [];

// ── Required files ────────────────────────────────────────────────────────────

for (const filePath of requiredFiles) {
  if (!existsSync(join(workspaceRoot, filePath))) {
    failures.push(`required file missing: ${filePath}`);
  }
}

// ── ci.yml commands ───────────────────────────────────────────────────────────

const ciPath = join(workspaceRoot, ".github/workflows/ci.yml");

if (existsSync(ciPath)) {
  const ci = readFileSync(ciPath, "utf8");
  for (const command of requiredCiCommands) {
    if (!ci.includes(command)) {
      failures.push(`ci.yml must run "${command}"`);
    }
  }
}

// ── release-verification.yml commands ────────────────────────────────────────

const releasePath = join(
  workspaceRoot,
  ".github/workflows/release-verification.yml"
);

if (existsSync(releasePath)) {
  const release = readFileSync(releasePath, "utf8");
  for (const command of requiredReleaseVerificationGates) {
    if (!release.includes(command)) {
      failures.push(`release-verification.yml must run "${command}"`);
    }
  }
}

// ── package.json quality scripts ─────────────────────────────────────────────

const packageJson = JSON.parse(
  readFileSync(join(workspaceRoot, "package.json"), "utf8")
);

for (const scriptName of requiredQualityScripts) {
  if (!packageJson.scripts?.[scriptName]) {
    failures.push(`package.json must define script "${scriptName}"`);
  }
}

// ── Result ────────────────────────────────────────────────────────────────────

if (failures.length > 0) {
  console.error("release gate validation failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `release gates valid — ${requiredFiles.length} files, ${requiredCiCommands.length} CI commands, ${requiredQualityScripts.length} quality scripts verified`
  );
}
