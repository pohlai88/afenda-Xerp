/** Design tokens and UI governance foundation — placeholder export for TIP-001 foundation. */
export const PACKAGE_NAME = "@afenda/design-system" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
