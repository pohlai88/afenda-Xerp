#!/usr/bin/env node
/**
 * Bump composition manifest contracts + T1 tests from 1.1.0 → 1.2.0 (Gold).
 * Skips components already at 1.2.0.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { STUDIO_COMPOSITION_COMPONENTS } from "./studio-composition-manifest.mjs";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const uiDir = join(repoRoot, "packages/shadcn-studio/src/components-ui");

function bumpFile(path) {
  if (!existsSync(path)) {
    return false;
  }
  const before = readFileSync(path, "utf8");
  if (!before.includes('"1.1.0"')) {
    return false;
  }
  const after = before
    .replace(/\/\*\* Enterprise composition/g, "/** Gold composition")
    .replace(
      /\/\*\* Vendor boundary \(Enterprise/g,
      "/** Vendor boundary (Gold"
    )
    .replace(
      /export const PRIMITIVE_CONTRACT_VERSION = "1\.1\.0"/g,
      'export const PRIMITIVE_CONTRACT_VERSION = "1.2.0"'
    )
    .replace(
      /expect\(PRIMITIVE_CONTRACT_VERSION\)\.toBe\("1\.1\.0"\)/g,
      'expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0")'
    );
  if (after === before) {
    return false;
  }
  writeFileSync(path, after);
  return true;
}

let bumped = 0;

for (const name of STUDIO_COMPOSITION_COMPONENTS) {
  if (bumpFile(join(uiDir, `${name}.contract.ts`))) {
    bumped += 1;
  }
  bumpFile(join(uiDir, `${name}.contract.test.ts`));
}

process.stdout.write(
  `composition gold uplift: bumped ${bumped} contracts (${STUDIO_COMPOSITION_COMPONENTS.length} manifest entries)\n`
);
