import { MetadataUiError } from "./metadata-ui-error.js";

const FORBIDDEN_PACKAGE_IMPORTS = [
  "@afenda/database",
  "@afenda/permissions",
  "@afenda/appshell",
] as const;

export function assertMetadataUiBoundary(packageName: string): void {
  if (
    FORBIDDEN_PACKAGE_IMPORTS.some((forbidden) => packageName.startsWith(forbidden))
  ) {
    throw new MetadataUiError(
      `@afenda/metadata-ui must not depend on ${packageName}.`
    );
  }
}
