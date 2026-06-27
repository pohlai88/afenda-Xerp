#!/usr/bin/env tsx
/** PAS §4.1 — enterprise ID prefix uniqueness gate. */

import {
  ENTERPRISE_ID_FAMILIES,
  ID_FAMILIES,
} from "../../../packages/kernel/src/identity/registry/id-family.registry.ts";

const prefixes = ENTERPRISE_ID_FAMILIES.map((family) => ID_FAMILIES[family].prefix);

if (new Set(prefixes).size !== prefixes.length) {
  console.error("ID prefix uniqueness gate failed: duplicate enterprise prefixes in ID_FAMILIES");
  process.exit(1);
}

console.log("ID prefix uniqueness gate passed.");
