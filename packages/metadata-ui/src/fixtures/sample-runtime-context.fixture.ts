import type { MetadataRuntimeContext } from "@afenda/metadata";

import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import { createMetadataUiRenderContext } from "../runtime/create-metadata-ui-render-context.js";

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
  createMetadataUiRenderContext({
    runtime: sampleRuntimeContext,
    source: "static-preview",
  });

export const sampleDiagnosticsRenderContext: MetadataUiRenderContext =
  createMetadataUiRenderContext({
    runtime: sampleDiagnosticsRuntimeContext,
    source: "static-preview",
    diagnosticsLevel: "summary",
  });
