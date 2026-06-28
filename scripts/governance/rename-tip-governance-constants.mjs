#!/usr/bin/env node
/** One-shot: rename TIP_* governance constants to PAS-neutral names. */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname);
const REPLACEMENTS = [
  ["TIP_007_012_DELIVERY_DOC", "MULTI_TENANCY_DELIVERY_DOC"],
  ["TIP_007_012_REQUIRED_SECTIONS", "MULTI_TENANCY_DELIVERY_REQUIRED_SECTIONS"],
  [
    "TIP_007_012_ACCEPTANCE_CHECKLIST",
    "MULTI_TENANCY_DELIVERY_ACCEPTANCE_CHECKLIST",
  ],
  [
    "TIP_007_012_MINIMUM_OVERALL_SCORE",
    "MULTI_TENANCY_DELIVERY_MINIMUM_OVERALL_SCORE",
  ],
  [
    "TIP_007_012_REQUIRED_DISCLAIMERS",
    "MULTI_TENANCY_DELIVERY_REQUIRED_DISCLAIMERS",
  ],
  [
    "TIP_007_012_FORBIDDEN_OVERCLAIM_PATTERNS",
    "MULTI_TENANCY_DELIVERY_FORBIDDEN_OVERCLAIM_PATTERNS",
  ],
  [
    "TIP_007_012_TIP008_TABLE_MARKERS",
    "MULTI_TENANCY_ENTITY_GROUP_TABLE_MARKERS",
  ],
  [
    "TIP_007_012_OPERATING_CONTEXT_RESOLVER_SECTION",
    "MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SECTION",
  ],
  [
    "TIP_007_012_DOS_PROHIBITIONS_SECTION",
    "MULTI_TENANCY_DOS_PROHIBITIONS_SECTION",
  ],
  [
    "TIP_007_012_CONTEXT_INTEGRATION_SECTION",
    "MULTI_TENANCY_CONTEXT_INTEGRATION_SECTION",
  ],
  [
    "TIP_007_012_CONTEXT_CONTRACTS_SECTION",
    "MULTI_TENANCY_CONTEXT_CONTRACTS_SECTION",
  ],
  [
    "TIP_007_012_PERSISTENCE_LOOKUP_SECTION",
    "MULTI_TENANCY_PERSISTENCE_LOOKUP_SECTION",
  ],
  [
    "TIP_007_012_TENANT_URL_RESOLVER_SECTION",
    "MULTI_TENANCY_TENANT_URL_RESOLVER_SECTION",
  ],
  [
    "TIP_007_012_EXISTING_STATE_AUDIT_SECTION",
    "MULTI_TENANCY_EXISTING_STATE_AUDIT_SECTION",
  ],
  [
    "TIP_007_012_AUTHORITY_DESIGN_SECTION",
    "MULTI_TENANCY_AUTHORITY_DESIGN_SECTION",
  ],
  ["TIP_007_012_VERIFICATION_SECTION", "MULTI_TENANCY_VERIFICATION_SECTION"],
  [
    "TIP_007_012_ENTERPRISE_ACCEPTANCE_SECTION",
    "MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SECTION",
  ],
  ["TIP_007_012_TESTS_SECTION", "MULTI_TENANCY_TESTS_SECTION"],
  [
    "TIP_007_012_TESTING_VERIFICATION_SECTION",
    "MULTI_TENANCY_TESTING_VERIFICATION_SECTION",
  ],
  ["TIP_013A_DELIVERY_DOC", "ACCOUNTING_READINESS_DELIVERY_DOC"],
  [
    "tip-007-012-doc-is-canonical-delivery-evidence-for-multi-tenancy-foundation",
    "multi-tenancy-doc-is-canonical-delivery-evidence-for-multi-tenancy-foundation",
  ],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "__tests__" || name === "node_modules") walk(p, out);
      else walk(p, out);
      continue;
    }
    if (/\.(mts|mjs|ts)$/.test(name)) out.push(p);
  }
  return out;
}

let count = 0;
for (const file of walk(root)) {
  if (file.endsWith("rename-tip-governance-constants.mjs")) continue;
  const text = readFileSync(file, "utf8");
  let next = text;
  for (const [from, to] of REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  if (next !== text) {
    writeFileSync(file, next);
    count++;
  }
}
console.log(`rename-tip-governance-constants: ${count} file(s) updated`);
