export const metadataUiContract = {
  packageName: "@afenda/metadata-ui",
  authority: "metadata-ui",
  consumes: "@afenda/metadata",
  owns: [
    "metadata rendering",
    "surface composition",
    "layout rendering",
    "section rendering",
    "renderer resolution",
    "metadata diagnostics presentation",
  ],
  doesNotOwn: [
    "metadata authority",
    "surface vocabulary",
    "layout vocabulary",
    "section vocabulary",
    "permission execution",
    "database schemas",
    "ERP business rules",
    "AppShell navigation",
    "design tokens",
  ],
} as const;
