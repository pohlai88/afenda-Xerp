/**
 * Runtime boundary contracts for metadata-ui.
 *
 * Authority:
 * - Defines governed runtime constants for package boundary enforcement.
 * - Does not own render context vocabulary (see render-context.contract.ts).
 */

export const METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS = [
  "@afenda/database",
  "@afenda/permissions",
  "@afenda/appshell",
] as const;

export type MetadataUiForbiddenPackageImport =
  (typeof METADATA_UI_FORBIDDEN_PACKAGE_IMPORTS)[number];

export const DEFAULT_METADATA_UI_HYDRATION_BY_SOURCE = {
  client: "full",
  server: "none",
  "static-preview": "none",
} as const satisfies Record<
  "client" | "server" | "static-preview",
  "none" | "full"
>;
