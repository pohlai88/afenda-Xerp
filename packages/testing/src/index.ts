/** Shared testing utilities foundation — placeholder export for TIP-001 foundation. */
export const PACKAGE_NAME = "@afenda/testing" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
