/** Shared testing utilities for the afenda-Xerp monorepo. */

export const PACKAGE_NAME = "@afenda/testing" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  createMockExecutionContext,
  createMockExecutionProvider,
} from "./execution/mock-execution-provider.js";
export { createMockStorageProvider } from "./storage/mock-storage-provider.js";
