#!/usr/bin/env tsx

/**
 * PAS-001 §4.1 / ADR-0021 — kernel ↔ database CHECK pattern parity gate.
 */

import {
  buildEnterpriseIdCheckPattern,
  CANONICAL_ID_BODY_PATTERN,
  ENTERPRISE_ID_FAMILY_PREFIXES,
} from "../../packages/database/src/ids/enterprise-id-patterns.ts";
import { buildCanonicalEnterpriseIdCheckPattern } from "../../packages/kernel/src/identity/postgres/index.ts";
import { ID_FAMILIES } from "../../packages/kernel/src/identity/registry/id-family.registry.ts";

const violations: string[] = [];

if (CANONICAL_ID_BODY_PATTERN !== "[0-9A-HJKMNP-TV-Z]{26}") {
  violations.push(
    "CANONICAL_ID_BODY_PATTERN mismatch between kernel and database"
  );
}

for (const [familyKey, definition] of Object.entries(ID_FAMILIES)) {
  if (!definition.prefix) {
    continue;
  }

  const dbPrefix =
    ENTERPRISE_ID_FAMILY_PREFIXES[
      familyKey as keyof typeof ENTERPRISE_ID_FAMILY_PREFIXES
    ];

  if (dbPrefix !== definition.prefix) {
    violations.push(
      `Prefix mismatch for ${definition.typeName}: kernel=${definition.prefix} database=${String(dbPrefix)}`
    );
  }

  const kernelPattern = buildCanonicalEnterpriseIdCheckPattern(
    definition.prefix
  );
  const dbPattern = buildEnterpriseIdCheckPattern(
    familyKey as keyof typeof ENTERPRISE_ID_FAMILY_PREFIXES
  );

  if (kernelPattern !== dbPattern) {
    violations.push(
      `CHECK pattern mismatch for ${definition.typeName}: kernel=${kernelPattern} database=${dbPattern}`
    );
  }
}

if (violations.length > 0) {
  console.error("Enterprise ID database parity gate failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  "Enterprise ID database parity gate passed (PAS-001 §4.1 / ADR-0021)."
);
