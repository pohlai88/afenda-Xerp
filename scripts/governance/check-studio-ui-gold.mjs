#!/usr/bin/env node
/**
 * PAS-006 Phase 2 — Gold contract version gate.
 * Every ui/*.contract.ts must declare PRIMITIVE_CONTRACT_VERSION = "1.2.0".
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const uiDir = join(repoRoot, "packages/shadcn-studio/src/components/ui");

const GOLD_VERSION = "1.2.0";
const GOLD_VERSION_PATTERN = new RegExp(
  `PRIMITIVE_CONTRACT_VERSION\\s*=\\s*["']${GOLD_VERSION}["']`
);
const LEGACY_VERSION_PATTERN =
  /PRIMITIVE_CONTRACT_VERSION\s*=\s*["']1\.1\.0["']/;

export function checkStudioUiGold() {
  const violations = [];
  const contractFiles = readdirSync(uiDir)
    .filter((entry) => entry.endsWith(".contract.ts"))
    .sort();

  for (const fileName of contractFiles) {
    const name = fileName.replace(".contract.ts", "");
    const content = readFileSync(join(uiDir, fileName), "utf8");

    if (!/PRIMITIVE_CONTRACT_VERSION/.test(content)) {
      violations.push(`${name}: contract missing PRIMITIVE_CONTRACT_VERSION`);
      continue;
    }

    if (LEGACY_VERSION_PATTERN.test(content)) {
      violations.push(
        `${name}: PRIMITIVE_CONTRACT_VERSION is 1.1.0 (expected ${GOLD_VERSION})`
      );
      continue;
    }

    if (!GOLD_VERSION_PATTERN.test(content)) {
      violations.push(
        `${name}: PRIMITIVE_CONTRACT_VERSION is not ${GOLD_VERSION}`
      );
    }
  }

  return { violations, contractFiles };
}

const { violations, contractFiles } = checkStudioUiGold();

if (violations.length > 0) {
  process.stderr.write("studio ui gold: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `studio ui gold: OK (${contractFiles.length} contracts at ${GOLD_VERSION})\n`
);
