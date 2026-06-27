#!/usr/bin/env tsx
/** PAS §4.1.13 / ADR-0023 — kernel tenant human reference contract gate. */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  TENANT_HUMAN_REFERENCE_SCOPES,
  TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS,
} from "../../../packages/kernel/src/identity/tenant-human-reference/tenant-human-reference.contract.ts";
import { TENANT_HUMAN_REFERENCE_REGISTRY } from "../../../packages/database/src/ids/tenant-human-reference-registry.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const contractPath = join(
  repoRoot,
  "packages/kernel/src/identity/tenant-human-reference/tenant-human-reference.contract.ts"
);
const identityIndexPath = join(
  repoRoot,
  "packages/kernel/src/identity/index.ts"
);

const violations: string[] = [];

if (!existsSync(contractPath)) {
  violations.push("Missing tenant-human-reference.contract.ts");
} else {
  const source = readFileSync(contractPath, "utf8");

  for (const pattern of [
    /export\s+function\s+createEmployeeNo\b/,
    /export\s+function\s+createCustomerNo\b/,
    /export\s+function\s+createSkuNo\b/,
    /export\s+const\s+create\w+No\b/,
    /EnterpriseBrand<"employee">/,
    /type\s+EmployeeNo\s*=\s*EnterpriseBrand/,
  ]) {
    if (pattern.test(source)) {
      violations.push(
        `tenant-human-reference.contract.ts violates ADR-0023: ${String(pattern)}`
      );
    }
  }

  for (const scope of TENANT_HUMAN_REFERENCE_SCOPES) {
    const definition = TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS[scope];
    if (!source.includes(`TenantHumanReference<"${scope}">`)) {
      violations.push(`Missing TenantHumanReference<"${scope}"> alias`);
    }
    if (!source.includes(definition.label)) {
      violations.push(`Missing scope label for ${scope}`);
    }
  }
}

const registryScopes = TENANT_HUMAN_REFERENCE_REGISTRY.map((entry) => {
  switch (entry.column) {
    case "employee_no":
      return "employee";
    case "customer_no":
      return "customer";
    case "supplier_no":
      return "supplier";
    case "sku":
      return "sku";
    case "asset_no":
      return "asset";
    case "document_no":
      return "document";
    case "warehouse_code":
      return "warehouse";
    default:
      return entry.column;
  }
});

for (const scope of TENANT_HUMAN_REFERENCE_SCOPES) {
  if (!registryScopes.includes(scope)) {
    violations.push(`Kernel scope "${scope}" missing from database registry`);
  }
}

const identityIndex = readFileSync(identityIndexPath, "utf8");
for (const symbol of [
  "TenantHumanReference",
  "TenantHumanReferenceScope",
  "TENANT_HUMAN_REFERENCE_SCOPES",
  "parseEmployeeNo",
  "parseCustomerNo",
  "parseSkuNo",
  "EmployeeNo",
  "CustomerNo",
  "SkuNo",
] as const) {
  if (!identityIndex.includes(symbol)) {
    violations.push(`identity/index.ts must export ${symbol}`);
  }
}

if (violations.length > 0) {
  console.error("Tenant human reference kernel contract gate failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  "Tenant human reference kernel contract gate passed (PAS §4.1.13 / ADR-0023)."
);
