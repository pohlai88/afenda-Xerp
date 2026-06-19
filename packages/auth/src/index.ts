/** Authentication foundation (Better Auth in TIP-004) — placeholder export for TIP-001 foundation. */
export const PACKAGE_NAME = "@afenda/auth" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
