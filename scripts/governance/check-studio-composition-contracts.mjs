#!/usr/bin/env node
/**
 * PAS-006 — composition / vendor UI contract gate.
 * Every manifest component requires {name}.contract.ts + relative adapter import + T1 test.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { STUDIO_COMPOSITION_COMPONENTS } from "./studio-composition-manifest.mjs";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const uiDir = join(repoRoot, "packages/shadcn-studio/src/components/ui");

export function checkStudioCompositionContracts() {
  const violations = [];

  for (const name of STUDIO_COMPOSITION_COMPONENTS) {
    const adapterPath = join(uiDir, `${name}.tsx`);
    const contractPath = join(uiDir, `${name}.contract.ts`);
    const testPath = join(uiDir, `${name}.contract.test.ts`);

    if (!existsSync(adapterPath)) {
      violations.push(`${name}: missing adapter ${name}.tsx`);
      continue;
    }

    if (!existsSync(contractPath)) {
      violations.push(`${name}: missing ${name}.contract.ts`);
      continue;
    }

    const contractContent = readFileSync(contractPath, "utf8");
    if (!/PRIMITIVE_CONTRACT_VERSION/.test(contractContent)) {
      violations.push(`${name}: contract missing PRIMITIVE_CONTRACT_VERSION`);
    }

    if (!/PRIMITIVE_ID|_PRIMITIVE_ID/.test(contractContent)) {
      violations.push(`${name}: contract missing *_PRIMITIVE_ID`);
    }

    if (/from\s+["']lucide-react["']/.test(contractContent)) {
      violations.push(`${name}: contract must not import lucide-react`);
    }

    if (/from\s+["']react["']/.test(contractContent)) {
      violations.push(`${name}: contract must not import react`);
    }

    const adapterContent = readFileSync(adapterPath, "utf8");
    const importPattern = new RegExp(
      `from\\s+["']\\.\\/${name}\\.contract["']`
    );
    if (!importPattern.test(adapterContent)) {
      violations.push(
        `${name}: adapter must import from ./${name}.contract (relative)`
      );
    }

    if (!existsSync(testPath)) {
      violations.push(`${name}: missing ${name}.contract.test.ts`);
    }
  }

  return violations;
}

const violations = checkStudioCompositionContracts();

if (violations.length > 0) {
  process.stderr.write("studio composition contracts: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `studio composition contracts: OK (${STUDIO_COMPOSITION_COMPONENTS.length} components)\n`
);
