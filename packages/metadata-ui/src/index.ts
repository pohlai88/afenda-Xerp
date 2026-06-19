/** Metadata-driven UI contracts foundation — placeholder export for TIP-001 foundation. */
export const PACKAGE_NAME = "@afenda/metadata-ui" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
