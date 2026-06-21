import type { RendererCapability, SectionType } from "@afenda/metadata";

import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";

export interface MetadataRendererResolveInput {
  readonly registry: MetadataRendererRegistry;
  readonly sectionType: SectionType;
  readonly capability: RendererCapability;
  readonly input: unknown;
  readonly context: MetadataUiRenderContext;
}

export interface MetadataRendererRegistry {
  register(
    renderer: MetadataRendererDefinition
  ): MetadataRendererRegistry;

  get(key: string): MetadataRendererDefinition | undefined;

  resolve(
    input: Omit<MetadataRendererResolveInput, "registry">
  ): MetadataRendererDefinition | undefined;

  entries(): readonly MetadataRendererDefinition[];

  keys(): readonly string[];

  has(key: string): boolean;
}
