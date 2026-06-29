import type {
  ModuleDatabaseBoundaryDefinition,
  ModuleDatabaseTableBoundary,
} from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleDatabaseBoundaryInput {
  readonly kvId: string;
  readonly module: string;
  readonly tables: readonly ModuleDatabaseTableBoundary[];
}

export function defineModuleDatabaseBoundary(
  input: DefineModuleDatabaseBoundaryInput
): ModuleDatabaseBoundaryDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.tables.length === 0) {
    throw new Error("defineModuleDatabaseBoundary: tables must not be empty");
  }

  assertUniqueStrings(
    input.tables.map((table) => table.tableName),
    "database table"
  );

  const tables = input.tables.map((table) => {
    assertNonEmptyString(table.tableName, "tableName");
    assertNonEmptyString(table.canonicalIdField, "canonicalIdField");
    assertNonEmptyString(table.internalPkField, "internalPkField");
    assertNonEmptyString(table.rlsExpectation, "rlsExpectation");
    assertNonEmptyString(table.migrationPath, "migrationPath");
    assertNonEmptyString(table.ownershipRegistryRow, "ownershipRegistryRow");

    if (table.auditFields.length === 0) {
      throw new Error(
        `table "${table.tableName}": auditFields must not be empty`
      );
    }

    assertUniqueStrings(table.auditFields, `audit field (${table.tableName})`);

    return {
      tableName: table.tableName,
      tenantScoped: table.tenantScoped,
      companyScoped: table.companyScoped,
      canonicalIdField: table.canonicalIdField,
      internalPkField: table.internalPkField,
      rlsExpectation: table.rlsExpectation,
      migrationPath: table.migrationPath,
      ownershipRegistryRow: table.ownershipRegistryRow,
      auditFields: table.auditFields,
      ...(table.lifecycleField ? { lifecycleField: table.lifecycleField } : {}),
      ...(table.effectiveDatingField
        ? { effectiveDatingField: table.effectiveDatingField }
        : {}),
    } as const;
  });

  return {
    module: input.module,
    kvId: input.kvId,
    tables,
  } as const;
}
