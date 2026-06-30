#!/usr/bin/env node
import { spawnSync } from "node:child_process";
/**
 * PAS-006 Phase 3 — block contract lane gate (template-bound MCP blocks).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { GOVERNED_BLOCK_CONTRACT_IDS } from "./studio-block-contract-manifest.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const blocksDir = join(repoRoot, "packages/shadcn-studio/src/contracts/blocks");

const violations = [];

for (const blockId of GOVERNED_BLOCK_CONTRACT_IDS) {
  const contractPath = join(blocksDir, `${blockId}.block.contract.ts`);

  if (!existsSync(contractPath)) {
    violations.push(`${blockId}: missing ${blockId}.block.contract.ts`);
    continue;
  }

  const source = readFileSync(contractPath, "utf8");

  if (!/BlockMetadata\s*\(\)/.test(source)) {
    violations.push(`${blockId}: missing blockMetadata() factory export`);
  }

  const usesDatatableFamilyContract =
    blockId.startsWith("datatable-") &&
    source.includes("datatable-block.contract");

  if (
    !(source.includes("BLOCK_CONTRACT_VERSION") || usesDatatableFamilyContract)
  ) {
    violations.push(`${blockId}: must import BLOCK_CONTRACT_VERSION`);
  }
}

const familyContractPath = join(blocksDir, "datatable-block.contract.ts");

if (!existsSync(familyContractPath)) {
  violations.push("missing datatable-block.contract.ts family SSOT");
}

const registryPath = join(
  repoRoot,
  "packages/shadcn-studio/src/governance/block-metadata.registry.ts"
);

if (!existsSync(registryPath)) {
  violations.push("missing block-metadata.registry.ts");
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
    "block-contracts.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio block contracts: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("studio block contracts: OK\n");
process.exit(0);
