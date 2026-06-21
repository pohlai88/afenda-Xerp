import type { MetadataUiRenderContext } from "./render-context.contract.js";

export interface MetadataDiagnosticsSnapshot {
  readonly surfaceType?: string;
  readonly layoutType?: string;
  readonly sectionType?: string;
  readonly rendererKey?: string;
  readonly rendererCapability?: string;
  readonly runtimeState: string;
  readonly densityMode: string;
  readonly presentationMode: string;
  readonly readonlyMode: boolean;
  readonly diagnosticsEnabled: boolean;
  readonly correlationId?: string;
}

export interface MetadataDiagnosticsProps {
  readonly context: MetadataUiRenderContext;
  readonly snapshot: MetadataDiagnosticsSnapshot;
}
