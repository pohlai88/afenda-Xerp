#!/usr/bin/env tsx
/** PAS §4.1 — fiscal platform-floor IDs must stay off kernel exports. */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS } from "../../../packages/kernel/src/identity/registry/id-family.registry.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const kernelIndex = readFileSync(
  join(repoRoot, "packages/kernel/src/index.ts"),
  "utf8"
);

const familySources = [
  "families/tenant-hierarchy-id.contract.ts",
  "families/identity-access-id.contract.ts",
  "families/audit-execution-id.contract.ts",
  "families/enterprise-hierarchy-id.contract.ts",
  "families/business-reference-id.contract.ts",
].map((file) =>
  readFileSync(
    join(repoRoot, `packages/kernel/src/identity/${file}`),
    "utf8"
  )
);

const combined = [kernelIndex, ...familySources].join("\n");

for (const forbidden of FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS) {
  if (combined.includes(`export type ${forbidden}`)) {
    console.error(`Forbidden platform-floor ID exported: ${forbidden}`);
    process.exit(1);
  }
}

console.log("Forbidden platform-floor ID gate passed.");
