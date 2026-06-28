/**
 * Repo scaffold guard — forbidden domain package directories.
 *
 * Keep in sync with:
 * packages/architecture-authority/src/data/business-master-data-scaffold.policy.ts
 * (BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS)
 */

/** @type {readonly string[]} */
export const BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS = [
  "packages/crm",
  "packages/inventory",
  "packages/hrm",
  "packages/procurement",
];
