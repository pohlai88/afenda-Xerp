// biome-ignore-all lint/performance/noBarrelFile: TIP-007 diagnostics entry surface.

export type { MetadataBoundaryWarningProps } from "../contracts/diagnostics.contract.js";
export { createMetadataDiagnosticsSnapshot } from "./create-metadata-diagnostics-snapshot.js";
export {
  MetadataBoundaryWarning,
  MetadataDiagnosticsPanel,
  MetadataRenderTrace,
} from "./metadata-diagnostics-panel.js";
