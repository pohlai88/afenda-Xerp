import type {
  RegistryEntry,
  RendererCapability,
  SectionType,
} from "@afenda/metadata";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import type {
  MetadataRendererDefinition,
  MetadataRendererDiagnostics,
  MetadataRendererIdentity,
  MetadataRendererLifecycleState,
  MetadataRendererPolicy,
  MetadataRendererSupportResult,
} from "../contracts/renderer-definition.contract.js";

const DEFAULT_RENDERER_POLICY: MetadataRendererPolicy = {
  supportsServerRender: true,
  supportsClientRender: true,
  requiresHydration: false,
  supportsStaticPreview: true,
};

export interface CreateMetadataRendererDefinitionInput<TInput> {
  readonly capability: RendererCapability;
  readonly diagnostics?: MetadataRendererDiagnostics;
  readonly identity: MetadataRendererIdentity;
  readonly lifecycle?: MetadataRendererLifecycleState;
  readonly policy?: Partial<MetadataRendererPolicy>;
  readonly priority?: number;
  readonly registry: RegistryEntry;
  readonly render: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => ReactNode;
  readonly sectionTypes: readonly SectionType[];
  readonly supports?: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => MetadataRendererSupportResult | boolean;
}

export function createMetadataRendererDefinition<TInput>(
  input: CreateMetadataRendererDefinitionInput<TInput>
): MetadataRendererDefinition<TInput> {
  const lifecycle = input.lifecycle ?? "active";
  const priority = input.priority ?? 100;

  return {
    identity: input.identity,
    governance: {
      registry: input.registry,
      capability: input.capability,
      sectionTypes: input.sectionTypes,
      lifecycle,
      priority,
    },
    policy: {
      ...DEFAULT_RENDERER_POLICY,
      ...input.policy,
    },
    ...(input.diagnostics === undefined
      ? {}
      : { diagnostics: input.diagnostics }),
    ...(input.supports === undefined
      ? {}
      : {
          supports: (value, context) => {
            const result = input.supports?.(value, context);

            if (typeof result === "boolean") {
              return { supported: result };
            }

            return result ?? { supported: false };
          },
        }),
    render: (value, context) => ({
      node: input.render(value, context),
      diagnostics: {
        rendererKey: input.identity.key,
        rendererVersion: input.identity.version,
        capability: input.capability,
        sectionTypes: input.sectionTypes,
      },
    }),
  };
}
