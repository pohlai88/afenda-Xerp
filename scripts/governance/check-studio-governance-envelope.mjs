#!/usr/bin/env node
/**
 * PAS-006 — flat meta-gates/ envelope registry gate.
 * Fails on add/delete without updating _governance.registry.ts.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const governanceDir = join(repoRoot, "packages/shadcn-studio/src/meta-gates");
const registryPath = join(governanceDir, "_governance.registry.ts");
const envelopeMarker = "@afenda.governance-envelope";

const registrySource = readFileSync(registryPath, "utf8");

const registeredFiles = [
  ...registrySource.matchAll(/file:\s*"([^"]+\.ts)"/g),
].map((match) => match[1]);

const violations = [];

if (registeredFiles.length === 0) {
  violations.push("_governance.registry.ts: no registered files");
}

const discoveredFiles = readdirSync(governanceDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "_governance.registry.ts"
  )
  .map((entry) => entry.name)
  .sort();

const registeredSet = new Set(registeredFiles);
const discoveredSet = new Set(discoveredFiles);

for (const file of registeredFiles) {
  if (!discoveredSet.has(file)) {
    violations.push(`registry lists missing file: meta-gates/${file}`);
  }
}

for (const file of discoveredFiles) {
  if (!registeredSet.has(file)) {
    violations.push(
      `unregistered meta-gates/${file} — add to _governance.registry.ts + envelope header`
    );
  }
}

for (const file of registeredFiles) {
  const filePath = join(governanceDir, file);
  const source = readFileSync(filePath, "utf8");

  if (!source.includes(envelopeMarker)) {
    violations.push(`${file}: missing ${envelopeMarker} header block`);
  }

  const familyMatch = source.match(/Family:\s*([^\n·]+)/);

  if (familyMatch === null) {
    violations.push(`${file}: envelope header missing Family line`);
  }
}

if (violations.length > 0) {
  process.stderr.write("studio governance envelope: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

const testRun = spawnSync(
  "pnpm",
  [
    "--filter",
    "@afenda/shadcn-studio",
    "exec",
    "vitest",
    "run",
    "governance-envelope.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio governance envelope: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write(
  `studio governance envelope: OK (${discoveredFiles.length} files, series flat-governance)\n`
);
process.exit(0);
