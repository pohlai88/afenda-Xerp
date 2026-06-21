import type { MetadataRuntimeContext } from "@afenda/metadata";

import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import { createMetadataRenderContext } from "../runtime/create-metadata-render-context.js";

export const sampleRuntimeContext = {
  density: "default",
  diagnosticsEnabled: false,
  presentationMode: "default",
  readonlyMode: false,
  state: "ready",
  correlationId: "corr_sample_001",
} satisfies MetadataRuntimeContext;

export const sampleDiagnosticsRuntimeContext = {
  ...sampleRuntimeContext,
  diagnosticsEnabled: true,
} satisfies MetadataRuntimeContext;

export const sampleRenderContext: MetadataUiRenderContext =
  createMetadataRenderContext({
    runtime: sampleRuntimeContext,
    source: "static-preview",
  });

export const sampleDiagnosticsRenderContext: MetadataUiRenderContext =
  createMetadataRenderContext({
    runtime: sampleDiagnosticsRuntimeContext,
    source: "static-preview",
    diagnosticsEnabled: true,
  });
