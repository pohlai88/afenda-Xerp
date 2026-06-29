#!/usr/bin/env tsx
/** PAS-001 §4.1.13 / ADR-0023 — kernel ↔ database tenant human reference parity (ADR-0027: retired ui-composition). */

import { TENANT_HUMAN_REFERENCE_REGISTRY } from "../../../packages/database/src/ids/tenant-human-reference-registry.ts";
import { TENANT_HUMAN_REFERENCE_SCOPES } from "../../../packages/kernel/src/identity/tenant-human-reference/tenant-human-reference.contract.ts";

const violations: string[] = [];

const registryScopeKeys = new Set(
  TENANT_HUMAN_REFERENCE_REGISTRY.map((entry) => {
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
  })
);

for (const scope of TENANT_HUMAN_REFERENCE_SCOPES) {
  if (!registryScopeKeys.has(scope)) {
    violations.push(`Database registry missing kernel scope "${scope}"`);
  }
}

if (violations.length > 0) {
  console.error("Metadata tenant human reference parity gate failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  "Tenant human reference parity gate passed (kernel ↔ database, PAS-001 §4.1.13)."
);
