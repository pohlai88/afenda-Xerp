export interface EntitlementsExportContract {
  readonly deepImportsAllowed: false;
  readonly internalFolders: readonly [
    "contracts",
    "flags",
    "limits",
    "localization",
    "beta",
    "evaluation",
    "audit",
  ];
  readonly packageName: "@afenda/entitlements";
  readonly publicEntrypoints: readonly ["."];
  readonly stableExports: readonly string[];
}
