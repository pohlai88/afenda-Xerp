import type { MetadataRuntimeContext } from "@afenda/metadata";

export type MetadataUiRenderSource = "client" | "server" | "static-preview";

export interface MetadataUiRenderContext {
  readonly runtime: MetadataRuntimeContext;
  readonly source: MetadataUiRenderSource;
  readonly diagnosticsEnabled: boolean;
  readonly strict: boolean;
}

export interface CreateMetadataRenderContextInput {
  readonly runtime: MetadataRuntimeContext;
  readonly source: MetadataUiRenderSource;
  readonly diagnosticsEnabled?: boolean;
  readonly strict?: boolean;
}
