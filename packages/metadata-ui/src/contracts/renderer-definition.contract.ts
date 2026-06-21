import type {
  RegistryEntry,
  RendererCapability,
  SectionType,
} from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export interface MetadataRendererDefinition<TInput = unknown> {
  readonly key: string;
  readonly registry: RegistryEntry;
  readonly capability: RendererCapability;
  readonly sectionType: SectionType;
  readonly priority: number;
  readonly render: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => ReactNode;
  readonly supports?: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => boolean;
}

export type AnyMetadataRendererDefinition = MetadataRendererDefinition<unknown>;
