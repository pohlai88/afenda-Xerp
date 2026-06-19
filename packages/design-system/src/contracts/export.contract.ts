export interface PublicExportContract {
  readonly deepImportsAllowed: false;
  readonly internalFolders: readonly string[];
  readonly packageName: "@afenda/design-system";
  readonly publicEntrypoints: readonly ["."];
  readonly stableExports: readonly string[];
}
