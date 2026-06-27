/**
 * TIP-008B Slice 7 — contract-layer import boundary (acyclic authority).
 */
export const BUSINESS_MASTER_DATA_FORBIDDEN_IMPORT_PREFIXES = [
  "@afenda/database",
  "@afenda/erp",
  "apps/erp",
  "packages/database",
  "packages/permissions",
] as const;

export function assertBusinessMasterDataImportBoundary(
  importSpecifier: string
): void {
  for (const forbidden of BUSINESS_MASTER_DATA_FORBIDDEN_IMPORT_PREFIXES) {
    if (
      importSpecifier === forbidden ||
      importSpecifier.startsWith(`${forbidden}/`)
    ) {
      throw new Error(
        `Business master data contracts must not import ${forbidden}. Found: ${importSpecifier}`
      );
    }
  }
}
