/** Afenda platform database foundation (Foundation phase 03). */
export const PACKAGE_NAME = "@afenda/database" as const;

export * from "./public-api.js";

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
