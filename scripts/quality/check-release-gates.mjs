/**
 * Foundation phase 09 release gate meta-check.
 *
 * Validates that the Foundation phase 09 governance structure itself is intact:
 *   - all required workflow files exist
 *   - ci.yml runs every required command
 *   - root package.json defines every required quality script
 *   - the Foundation phase 09 delivery document exists
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
  "docs/PAS/pas-status-index.md",
  "docs/ai/README.md",
];

const requiredCiCommands = [
  "pnpm ci:biome",
  "pnpm typecheck",
  "pnpm test:run",
  "pnpm test:interaction",
  "pnpm test:e2e:smoke",
  "pnpm build",
  "pnpm quality:boundaries",
  "pnpm quality:exports",
  "pnpm quality:migrations",
  "pnpm quality:architecture",
  "pnpm quality:architecture-drift",
  "pnpm quality:ai-governance",
  "pnpm check:csp-third-party",
  "pnpm check:erp-observability",
  "pnpm check:system-admin-mutation-audit",
  "pnpm check:accounting-readiness-gate --structure-only",
  "pnpm check:accounting-domain-contracts",
  "node scripts/governance/check-developer-route-lab-greenlight.mjs",
  "pnpm quality:pas001a-skeleton-gates",
  "pnpm quality:release-gate",
  "pnpm quality:docs",
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
  "pnpm quality:ai-governance",
  "pnpm check:csp-third-party",
  "pnpm check:erp-observability",
  "pnpm check:accounting-readiness-gate",
  "pnpm check:accounting-domain-contracts",
  "node scripts/governance/check-developer-route-lab-greenlight.mjs",
  "pnpm quality:release-gate",
];

const requiredQualityScripts = [
  "quality",
  "quality:boundaries",
  "quality:exports",
  "quality:migrations",
  "quality:architecture",
  "quality:architecture-drift",
  "quality:ai-governance",
  "quality:preview-policy",
  "quality:release-gate",
  "quality:pas001a-skeleton-gates",
  "quality:docs",
  "quality:csp-third-party",
  "check:csp-third-party",
  "quality:erp-observability",
  "check:erp-observability",
  "check:system-admin-mutation-audit",
  "check:accounting-readiness-gate",
  "check:accounting-domain-contracts",
  "check:developer-route-lab-greenlight",
  "quality:accounting-domain-contracts",
  "quality:developer-route-lab",
  "check:docs",
  "ci:biome",
];

const failures = [];

function ciIncludesCommand(ciContents, command) {
  if (ciContents.includes(command)) {
    return true;
  }

  const turboAlternatives = {
    "pnpm typecheck": ["pnpm turbo run typecheck"],
    "pnpm build": ["pnpm turbo run build"],
    "pnpm test:run": ["pnpm test:run:affected"],
    "pnpm test:interaction": ["Gate 3i · interaction tests"],
    "pnpm test:e2e:smoke": ["Gate 3j · ERP Playwright smoke"],
  };

  return (turboAlternatives[command] ?? []).some((alternative) =>
    ciContents.includes(alternative)
  );
}

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
    if (!ciIncludesCommand(ci, command)) {
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
    if (!ciIncludesCommand(release, command)) {
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
