#!/usr/bin/env node
import { spawnSync } from "node:child_process";
/**
 * PAS-006 Phase 3 — block metadata lane gate (registry-derived, flat meta-contracts/).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { GOVERNED_BLOCK_CONTRACT_IDS } from "./studio-block-contract-manifest.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const contractsDir = join(repoRoot, "packages/shadcn-studio/src/meta-contracts");

const requiredFiles = [
  "block-metadata.contract.ts",
  "block-metadata.builders.ts",
];

const violations = [];

for (const fileName of requiredFiles) {
  const filePath = join(contractsDir, fileName);

  if (!existsSync(filePath)) {
    violations.push(`missing meta-contracts/${fileName}`);
    continue;
  }

  const source = readFileSync(filePath, "utf8");

  if (!source.includes("BLOCK_METADATA_VERSION")) {
    violations.push(`${fileName}: must export BLOCK_METADATA_VERSION`);
  }
}

const buildersPath = join(contractsDir, "block-metadata.builders.ts");

if (existsSync(buildersPath)) {
  const buildersSource = readFileSync(buildersPath, "utf8");

  if (!buildersSource.includes("buildBlockMetadata")) {
    violations.push("block-metadata.builders.ts: missing buildBlockMetadata()");
  }

  if (!buildersSource.includes("buildGovernedBlockMetadataRegistry")) {
    violations.push(
      "block-metadata.builders.ts: missing buildGovernedBlockMetadataRegistry()"
    );
  }

  if (!buildersSource.includes("DATATABLE_BLOCK_FAMILY_PREFIX")) {
    violations.push(
      "block-metadata.builders.ts: missing datatable family prefix"
    );
  }
}

const legacyBlocksDir = join(contractsDir, "blocks");

if (existsSync(legacyBlocksDir)) {
  violations.push(
    "meta-contracts/blocks/ must not exist — use block-metadata.builders.ts + registry SSOT"
  );
}

const registryPath = join(
  repoRoot,
  "packages/shadcn-studio/src/meta-gates/block-metadata.registry.ts"
);

if (!existsSync(registryPath)) {
  violations.push("missing meta-gates/block-metadata.registry.ts");
} else {
  const registrySource = readFileSync(registryPath, "utf8");

  if (!registrySource.includes("buildGovernedBlockMetadataRegistry")) {
    violations.push(
      "block-metadata.registry.ts: must derive from buildGovernedBlockMetadataRegistry()"
    );
  }
}

if (GOVERNED_BLOCK_CONTRACT_IDS.length === 0) {
  violations.push("studio-block-contract-manifest: no governed block ids");
}

if (violations.length > 0) {
  process.stderr.write("studio block contracts: FAIL\n");
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
    "block-metadata.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio block contracts: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("studio block contracts: OK\n");
process.exit(0);
