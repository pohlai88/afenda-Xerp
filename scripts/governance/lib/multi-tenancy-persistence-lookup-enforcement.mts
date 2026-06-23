/**
 * Shared Step 5 persistence and lookup enforcement (multi-tenancy.md §538–551).
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MULTI_TENANCY_FORBIDDEN_ACCOUNTING_SCHEMA_FILES,
  MULTI_TENANCY_FOUNDATION_TABLES,
  MULTI_TENANCY_LOOKUP_FUNCTIONS,
  MULTI_TENANCY_REQUIRED_INDEXES,
} from "../../../packages/database/src/tenant-domain/persistence-lookup-registry.ts";
import { TIP_007_012_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_ACCOUNTING_BOUNDARY_ROW_MARKERS,
  MULTI_TENANCY_FOUNDATION_TABLE_ROW_MARKERS,
  MULTI_TENANCY_INDEX_ROW_MARKERS,
  MULTI_TENANCY_LOOKUP_ROW_MARKERS,
  MULTI_TENANCY_PERSISTENCE_LOOKUP_DIMENSIONS,
  TIP_007_012_PERSISTENCE_LOOKUP_SECTION,
} from "../multi-tenancy-persistence-lookup-registry.mts";

export interface PersistenceLookupEnforcementViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function extractSection(content: string, heading: string): string | null {
  const headingIndex = content.indexOf(heading);
  if (headingIndex === -1) {
    return null;
  }

  const afterHeading = content.slice(headingIndex + heading.length);
  const nextSectionMatch = afterHeading.match(/\n## /);
  const sectionEnd =
    nextSectionMatch?.index === undefined
      ? content.length
      : headingIndex + heading.length + nextSectionMatch.index;

  return content.slice(headingIndex, sectionEnd);
}

function collectMissingMarkers(
  content: string,
  markers: readonly string[],
  rule: string,
  file: string,
  label: string
): PersistenceLookupEnforcementViolation[] {
  const violations: PersistenceLookupEnforcementViolation[] = [];

  for (const marker of markers) {
    if (!content.includes(marker)) {
      violations.push({
        rule,
        file,
        message: `${label} table missing row marker: ${marker}`,
      });
    }
  }

  return violations;
}

function collectFoundationTableViolations(
  repoRoot: string
): PersistenceLookupEnforcementViolation[] {
  const violations: PersistenceLookupEnforcementViolation[] = [];
  const databaseSrc = join(repoRoot, "packages/database/src");

  for (const entry of MULTI_TENANCY_FOUNDATION_TABLES) {
    const schemaPath = join(databaseSrc, entry.schemaFile);
    const servicePath = join(databaseSrc, entry.serviceModule);

    if (!existsSync(schemaPath)) {
      violations.push({
        rule: "foundation-schema-missing",
        file: schemaPath,
        message: `Foundation table ${entry.table} schema missing: ${entry.schemaFile}`,
      });
    }

    if (!existsSync(servicePath)) {
      violations.push({
        rule: "foundation-service-missing",
        file: servicePath,
        message: `Foundation table ${entry.table} service missing: ${entry.serviceModule}`,
      });
    }
  }

  return violations;
}

function collectIndexViolations(
  repoRoot: string
): PersistenceLookupEnforcementViolation[] {
  const violations: PersistenceLookupEnforcementViolation[] = [];
  const databaseSrc = join(repoRoot, "packages/database/src");

  for (const requirement of MULTI_TENANCY_REQUIRED_INDEXES) {
    const schemaPath = join(databaseSrc, requirement.schemaFile);

    if (!existsSync(schemaPath)) {
      violations.push({
        rule: "index-schema-missing",
        file: schemaPath,
        message: `Index requirement schema missing: ${requirement.schemaFile}`,
      });
      continue;
    }

    const schemaSource = readFileSync(schemaPath, "utf8");

    for (const indexName of requirement.indexNames) {
      if (!schemaSource.includes(indexName)) {
        violations.push({
          rule: "required-index-missing",
          file: schemaPath,
          message: `Step 5 index missing (${requirement.label}): ${indexName}`,
        });
      }
    }
  }

  return violations;
}

function collectLookupViolations(
  repoRoot: string
): PersistenceLookupEnforcementViolation[] {
  const violations: PersistenceLookupEnforcementViolation[] = [];
  const databaseSrc = join(repoRoot, "packages/database/src");
  const tenantDomainIndex = join(databaseSrc, "tenant-domain/index.ts");

  if (!existsSync(tenantDomainIndex)) {
    violations.push({
      rule: "tenant-domain-barrel-missing",
      file: tenantDomainIndex,
      message: "tenant-domain/index.ts is required for lookup exports",
    });
  }

  for (const lookup of MULTI_TENANCY_LOOKUP_FUNCTIONS) {
    const lookupPath = join(databaseSrc, lookup.file);

    if (!existsSync(lookupPath)) {
      violations.push({
        rule: "lookup-service-missing",
        file: lookupPath,
        message: `Lookup adapter missing: ${lookup.file}`,
      });
      continue;
    }

    const lookupSource = readFileSync(lookupPath, "utf8");
    if (!lookupSource.includes(lookup.name)) {
      violations.push({
        rule: "lookup-function-missing",
        file: lookupPath,
        message: `Lookup function missing: ${lookup.name}`,
      });
    }
  }

  return violations;
}

function collectAccountingSchemaViolations(
  repoRoot: string
): PersistenceLookupEnforcementViolation[] {
  const violations: PersistenceLookupEnforcementViolation[] = [];
  const schemaDir = join(repoRoot, "packages/database/src/schema");

  if (!existsSync(schemaDir)) {
    violations.push({
      rule: "schema-dir-missing",
      file: schemaDir,
      message: "packages/database/src/schema is required",
    });
    return violations;
  }

  for (const entry of readdirSync(schemaDir)) {
    if (
      (
        MULTI_TENANCY_FORBIDDEN_ACCOUNTING_SCHEMA_FILES as readonly string[]
      ).includes(entry)
    ) {
      violations.push({
        rule: "forbidden-accounting-schema",
        file: join(schemaDir, entry),
        message: `Step 5 prohibits accounting schema: ${entry}`,
      });
    }
  }

  return violations;
}

export function collectPersistenceLookupViolations(
  repoRoot: string
): PersistenceLookupEnforcementViolation[] {
  const violations: PersistenceLookupEnforcementViolation[] = [];
  const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);

  if (!existsSync(deliveryDocPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${TIP_007_012_DELIVERY_DOC} is required for Step 5 persistence tables`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryDocPath, "utf8");
  const sectionHeading = `## ${TIP_007_012_PERSISTENCE_LOOKUP_SECTION}`;
  const persistenceSection = extractSection(deliveryContent, sectionHeading);

  if (persistenceSection === null) {
    violations.push({
      rule: "persistence-section-missing",
      file: deliveryDocPath,
      message: `Delivery doc missing section: ${sectionHeading}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_PERSISTENCE_LOOKUP_DIMENSIONS) {
    if (!persistenceSection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "persistence-table-missing",
        file: deliveryDocPath,
        message: `Step 5 missing table: ${dimension.tableMarker}`,
      });
    }
  }

  violations.push(
    ...collectMissingMarkers(
      persistenceSection,
      MULTI_TENANCY_FOUNDATION_TABLE_ROW_MARKERS,
      "foundation-table-row-missing",
      deliveryDocPath,
      "Foundation tables"
    ),
    ...collectMissingMarkers(
      persistenceSection,
      MULTI_TENANCY_LOOKUP_ROW_MARKERS,
      "lookup-row-missing",
      deliveryDocPath,
      "Tenant domain lookup"
    ),
    ...collectMissingMarkers(
      persistenceSection,
      MULTI_TENANCY_INDEX_ROW_MARKERS,
      "index-row-missing",
      deliveryDocPath,
      "Indexes and unique constraints"
    ),
    ...collectMissingMarkers(
      persistenceSection,
      MULTI_TENANCY_ACCOUNTING_BOUNDARY_ROW_MARKERS,
      "accounting-boundary-row-missing",
      deliveryDocPath,
      "Accounting scope boundary"
    )
  );

  violations.push(...collectFoundationTableViolations(repoRoot));
  violations.push(...collectIndexViolations(repoRoot));
  violations.push(...collectLookupViolations(repoRoot));
  violations.push(...collectAccountingSchemaViolations(repoRoot));

  return violations;
}
