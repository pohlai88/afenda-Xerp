/**
 * Metadata renderer registry contracts.
 *
 * Authority:
 * - Defines registry resolution input and registry interface for metadata-ui.
 * - Consumes SectionType and RendererCapability from @afenda/metadata.
 */

import type { RendererCapability, SectionType } from "@afenda/metadata";

import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";

export interface MetadataRendererRegistryResolveInput {
  readonly capability: RendererCapability;
  readonly context: MetadataUiRenderContext;
  readonly input: unknown;
  readonly registry: MetadataRendererRegistry;
  readonly sectionType: SectionType;
}

export interface MetadataRendererRegistry {
  entries(): readonly MetadataRendererDefinition[];

  get(key: string): MetadataRendererDefinition | undefined;

  has(key: string): boolean;

  keys(): readonly string[];
  register(renderer: MetadataRendererDefinition): MetadataRendererRegistry;

  resolve(
    input: Omit<MetadataRendererRegistryResolveInput, "registry">
  ): MetadataRendererDefinition | undefined;
}

/**
 * @deprecated Use `MetadataRendererRegistryResolveInput`.
 */
export type MetadataRendererResolveInputRegistry =
  MetadataRendererRegistryResolveInput;
