import { METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS } from "./runtime.contract.js";
import { MetadataUiError } from "./metadata-ui-error.js";

export function assertMetadataUiBoundary(packageName: string): void {
  if (
    METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS.some((forbidden) =>
      packageName.startsWith(forbidden)
    )
  ) {
    throw new MetadataUiError(
      `@afenda/metadata-ui must not depend on ${packageName}.`
    );
  }
}
