/** Shared testing utilities for the afenda-Xerp monorepo. */
export const PACKAGE_NAME = "@afenda/testing" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
