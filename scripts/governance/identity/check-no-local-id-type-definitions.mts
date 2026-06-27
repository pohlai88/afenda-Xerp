#!/usr/bin/env tsx
/** PAS §4.1 — consumer packages must not define local enterprise ID type aliases. */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { PLATFORM_ID_FAMILY_TYPE_NAMES } from "../../../packages/kernel/src/identity/registry/id-family.registry.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const SCAN_ROOTS = [
  "apps/erp/src",
  "packages/auth/src",
  "packages/permissions/src",
  "packages/execution/src",
  "packages/appshell/src",
];

const LOCAL_TYPE_PATTERN = /type\s+(TenantId|CompanyId|CustomerId|ProductId|UserId|RoleId|MembershipId|PermissionId|PolicyId|OrganizationId|EntityGroupId|TeamId|ProjectId|WarehouseId|EmployeeId|SupplierId|DocumentId|AssetId|ExecutionId|CorrelationId|AuditEventId|OwnershipInterestId)\s*=\s*(Brand<|string)/g;

function collectFiles(relativeRoot: string): string[] {
  const directory = join(repoRoot, relativeRoot);
  try {
    const entries = readdirSync(directory, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(
          ...collectFiles(
            `${relativeRoot}/${entry.name}`.replace(/\\/g, "/")
          )
        );
        continue;
      }
      if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
        files.push(fullPath);
      }
    }
    return files;
  } catch {
    return [];
  }
}

const violations: string[] = [];

for (const root of SCAN_ROOTS) {
  for (const file of collectFiles(root)) {
    if (file.includes("packages/kernel/")) {
      continue;
    }

    const source = readFileSync(file, "utf8");
    if (LOCAL_TYPE_PATTERN.test(source)) {
      violations.push(file);
    }
  }
}

if (violations.length > 0) {
  console.error("Local enterprise ID type definition gate failed:");
  for (const file of violations) {
    console.error(`- ${file}`);
  }
  console.error(
    `Import ID types from @afenda/kernel only (${PLATFORM_ID_FAMILY_TYPE_NAMES.length} families).`
  );
  process.exit(1);
}

console.log("Local enterprise ID type definition gate passed.");
