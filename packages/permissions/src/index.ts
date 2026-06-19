/** Permission and policy engine foundation — placeholder export for TIP-001 foundation. */
export const PACKAGE_NAME = "@afenda/permissions" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
