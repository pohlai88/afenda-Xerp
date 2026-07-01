#!/usr/bin/env node
import { spawnSync } from "node:child_process";
/**
 * PAS-006 L1 — flat meta-contracts/ envelope registry gate.
 * Fails on add/delete without updating _contract-envelope.registry.ts.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const contractsDir = join(
  repoRoot,
  "packages/shadcn-studio/src/meta-contracts"
);
const registryPath = join(contractsDir, "_contract-envelope.registry.ts");
const envelopeMarker = "@afenda.l1-contract-envelope";

const registrySource = readFileSync(registryPath, "utf8");

const registeredFiles = [
  ...registrySource.matchAll(/file:\s*"([^"]+\.ts)"/g),
].map((match) => match[1]);

const forbiddenPaths = [
  ...registrySource.matchAll(/FORBIDDEN_L1_CONTRACT_PATHS = \[([\s\S]*?)\]/g),
].flatMap((match) =>
  [...match[1].matchAll(/"([^"]+)"/g)].map((inner) => inner[1])
);

const violations = [];

if (registeredFiles.length === 0) {
  violations.push("_contract-envelope.registry.ts: no registered files");
}

const discoveredFiles = readdirSync(contractsDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "_contract-envelope.registry.ts" &&
      !entry.name.startsWith("_")
  )
  .map((entry) => entry.name)
  .sort();

const registeredSet = new Set(registeredFiles);
const discoveredSet = new Set(discoveredFiles);

for (const file of registeredFiles) {
  if (!discoveredSet.has(file)) {
    violations.push(`registry lists missing file: meta-contracts/${file}`);
  }
}

for (const file of discoveredFiles) {
  if (!registeredSet.has(file)) {
    violations.push(
      `unregistered meta-contracts/${file} — add to _contract-envelope.registry.ts + envelope header`
    );
  }
}

for (const forbidden of forbiddenPaths) {
  const forbiddenPath = join(contractsDir, forbidden);

  if (forbidden.endsWith("/")) {
    if (existsSync(forbiddenPath)) {
      violations.push(
        `forbidden path exists: meta-meta-contracts/${forbidden} (flat-L1 series)`
      );
    }
    continue;
  }

  if (existsSync(forbiddenPath)) {
    violations.push(`forbidden file exists: meta-meta-contracts/${forbidden}`);
  }
}

for (const file of registeredFiles) {
  const filePath = join(contractsDir, file);
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
  process.stderr.write("studio l1 contract envelope: FAIL\n");
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
    "contract-envelope.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio l1 contract envelope: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write(
  `studio l1 contract envelope: OK (${discoveredFiles.length} files, series flat-L1)\n`
);
process.exit(0);
