/** Database schema and Drizzle foundation (TIP-003) — placeholder export for TIP-001 foundation. */
export const PACKAGE_NAME = "@afenda/database" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
