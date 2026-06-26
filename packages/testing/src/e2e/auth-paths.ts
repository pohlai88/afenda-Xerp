import path from "node:path";
import { fileURLToPath } from "node:url";

/** Relative path from `apps/erp` root to persisted admin storageState. */
export const ERP_ADMIN_AUTH_STORAGE_RELATIVE = "e2e/.auth/admin.json";

/** Relative path from `apps/erp` root to persisted viewer storageState. */
export const ERP_VIEWER_AUTH_STORAGE_RELATIVE = "e2e/.auth/viewer.json";

/**
 * Resolve admin auth storage path for ERP Playwright setup.
 * @param erpAppRoot — absolute path to `apps/erp`
 */
export function resolveErpAdminAuthStoragePath(erpAppRoot: string): string {
  return path.join(erpAppRoot, ERP_ADMIN_AUTH_STORAGE_RELATIVE);
}

/**
 * Resolve admin auth storage path from a module URL inside `apps/erp/e2e`.
 */
export function resolveErpAdminAuthStorageFromE2eDir(
  importMetaUrl: string
): string {
  const e2eDir = path.dirname(fileURLToPath(importMetaUrl));
  return path.join(e2eDir, ".auth/admin.json");
}

/**
 * Resolve viewer auth storage path for ERP Playwright setup.
 * @param erpAppRoot — absolute path to `apps/erp`
 */
export function resolveErpViewerAuthStoragePath(erpAppRoot: string): string {
  return path.join(erpAppRoot, ERP_VIEWER_AUTH_STORAGE_RELATIVE);
}

/**
 * Resolve viewer auth storage path from a module URL inside `apps/erp/e2e`.
 */
export function resolveErpViewerAuthStorageFromE2eDir(
  importMetaUrl: string
): string {
  const e2eDir = path.dirname(fileURLToPath(importMetaUrl));
  return path.join(e2eDir, ".auth/viewer.json");
}
