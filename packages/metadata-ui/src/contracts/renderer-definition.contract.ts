/**
 * Metadata renderer definition contracts.
 *
 * Authority:
 * - Defines renderer registry and resolution contracts for metadata-ui.
 * - Consumes RegistryEntry, RendererCapability, SectionType from @afenda/ui-composition.
 */

import type {
  RegistryEntry,
  RendererCapability,
  SectionType,
} from "@afenda/ui-composition";
import type { ReactNode } from "react";

import type { MetadataUiRenderContext } from "./render-context.contract.js";

export const METADATA_RENDERER_LIFECYCLE_STATES = [
  "active",
  "experimental",
  "deprecated",
  "disabled",
] as const;

export type MetadataRendererLifecycleState =
  (typeof METADATA_RENDERER_LIFECYCLE_STATES)[number];

export interface MetadataRendererIdentity {
  /**
   * Optional renderer description.
   */
  readonly description?: string;
  /**
   * Stable renderer key.
   *
   * Examples: "metadata-ui.renderer.list.default", "metadata-ui.renderer.stat.card"
   */
  readonly key: string;

  /**
   * Optional human-readable label for diagnostics and Storybook.
   */
  readonly label?: string;

  /**
   * Renderer version. Recommended format: "1.0.0"
   */
  readonly version: string;
}

export interface MetadataRendererGovernance {
  /**
   * Capability this renderer provides.
   */
  readonly capability: RendererCapability;

  /**
   * Renderer lifecycle state for registry resolution.
   */
  readonly lifecycle: MetadataRendererLifecycleState;

  /**
   * Renderer selection priority. Higher number wins.
   */
  readonly priority: number;
  /**
   * Registry entry from @afenda/ui-composition.
   */
  readonly registry: RegistryEntry;

  /**
   * Section types supported by this renderer.
   */
  readonly sectionTypes: readonly SectionType[];
}

export interface MetadataRendererPolicy {
  /**
   * Whether this renderer requires hydration.
   */
  readonly requiresHydration: boolean;

  /**
   * Whether this renderer may run in the browser client.
   */
  readonly supportsClientRender: boolean;
  /**
   * Whether this renderer may run during server rendering.
   */
  readonly supportsServerRender: boolean;

  /**
   * Whether this renderer can be used in static previews, docs, and fixtures.
   */
  readonly supportsStaticPreview: boolean;
}

export interface MetadataRendererDiagnostics {
  /**
   * Optional diagnostics namespace. Example: "metadata-ui.renderer.list"
   */
  readonly namespace?: string;

  /**
   * Optional note shown in diagnostics surfaces.
   */
  readonly note?: string;
}

export interface MetadataRendererSupportResult {
  /**
   * Reason this renderer does or does not support the input.
   */
  readonly reason?: string;
  readonly supported: boolean;
}

export interface MetadataRendererExecutionDiagnostics {
  readonly capability: RendererCapability;
  readonly rendererKey: string;
  readonly rendererVersion: string;
  readonly sectionTypes: readonly SectionType[];
}

export interface MetadataRendererResult {
  /**
   * Optional diagnostics metadata from render execution.
   */
  readonly diagnostics?: MetadataRendererExecutionDiagnostics;
  readonly node: ReactNode;
}

export interface MetadataRendererDefinition<TInput = unknown> {
  readonly diagnostics?: MetadataRendererDiagnostics;
  readonly governance: MetadataRendererGovernance;
  readonly identity: MetadataRendererIdentity;
  readonly policy: MetadataRendererPolicy;

  readonly render: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => MetadataRendererResult;

  /**
   * Determines whether this renderer supports the input/context pair.
   *
   * If omitted, registry capability and section matching is considered enough.
   */
  readonly supports?: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => MetadataRendererSupportResult;
}

export type AnyMetadataRendererDefinition = MetadataRendererDefinition<unknown>;

export interface MetadataRendererResolveInput<TInput = unknown> {
  readonly capability?: RendererCapability;
  readonly context: MetadataUiRenderContext;
  readonly input: TInput;
  readonly sectionType: SectionType;
}

export interface MetadataRendererResolveResult<TInput = unknown> {
  readonly reason: string;
  readonly renderer: MetadataRendererDefinition<TInput>;
}

export const METADATA_RENDERER_RESOLVE_FAILURE_REASONS = [
  "no-renderer-registered",
  "no-capability-match",
  "no-section-type-match",
  "renderer-disabled",
  "experimental-renderer-blocked",
  "deprecated-renderer-blocked",
  "environment-not-supported",
  "support-check-failed",
] as const;

export type MetadataRendererResolveFailureReason =
  (typeof METADATA_RENDERER_RESOLVE_FAILURE_REASONS)[number];

export interface MetadataRendererResolveFailure {
  readonly attemptedRendererKeys: readonly string[];
  readonly message: string;
  readonly reason: MetadataRendererResolveFailureReason;
}
