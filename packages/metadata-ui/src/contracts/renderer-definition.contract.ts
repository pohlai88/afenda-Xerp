/**
 * Metadata renderer definition contracts.
 *
 * Authority:
 * - Defines renderer registry and resolution contracts for metadata-ui.
 * - Consumes RegistryEntry, RendererCapability, SectionType from @afenda/metadata.
 */

import type {
  RegistryEntry,
  RendererCapability,
  SectionType,
} from "@afenda/metadata";
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
   * Stable renderer key.
   *
   * Examples: "metadata-ui.renderer.list.default", "metadata-ui.renderer.stat.card"
   */
  readonly key: string;

  /**
   * Renderer version. Recommended format: "1.0.0"
   */
  readonly version: string;

  /**
   * Optional human-readable label for diagnostics and Storybook.
   */
  readonly label?: string;

  /**
   * Optional renderer description.
   */
  readonly description?: string;
}

export interface MetadataRendererGovernance {
  /**
   * Registry entry from @afenda/metadata.
   */
  readonly registry: RegistryEntry;

  /**
   * Capability this renderer provides.
   */
  readonly capability: RendererCapability;

  /**
   * Section types supported by this renderer.
   */
  readonly sectionTypes: readonly SectionType[];

  /**
   * Renderer lifecycle state for registry resolution.
   */
  readonly lifecycle: MetadataRendererLifecycleState;

  /**
   * Renderer selection priority. Higher number wins.
   */
  readonly priority: number;
}

export interface MetadataRendererPolicy {
  /**
   * Whether this renderer may run during server rendering.
   */
  readonly supportsServerRender: boolean;

  /**
   * Whether this renderer may run in the browser client.
   */
  readonly supportsClientRender: boolean;

  /**
   * Whether this renderer requires hydration.
   */
  readonly requiresHydration: boolean;

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
  readonly supported: boolean;

  /**
   * Reason this renderer does or does not support the input.
   */
  readonly reason?: string;
}

export interface MetadataRendererExecutionDiagnostics {
  readonly rendererKey: string;
  readonly rendererVersion: string;
  readonly capability: RendererCapability;
  readonly sectionTypes: readonly SectionType[];
}

export interface MetadataRendererResult {
  readonly node: ReactNode;

  /**
   * Optional diagnostics metadata from render execution.
   */
  readonly diagnostics?: MetadataRendererExecutionDiagnostics;
}

export interface MetadataRendererDefinition<TInput = unknown> {
  readonly identity: MetadataRendererIdentity;
  readonly governance: MetadataRendererGovernance;
  readonly policy: MetadataRendererPolicy;
  readonly diagnostics?: MetadataRendererDiagnostics;

  /**
   * Determines whether this renderer supports the input/context pair.
   *
   * If omitted, registry capability and section matching is considered enough.
   */
  readonly supports?: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => MetadataRendererSupportResult;

  readonly render: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => MetadataRendererResult;
}

export type AnyMetadataRendererDefinition =
  MetadataRendererDefinition<unknown>;

export interface MetadataRendererResolveInput<TInput = unknown> {
  readonly input: TInput;
  readonly sectionType: SectionType;
  readonly capability?: RendererCapability;
  readonly context: MetadataUiRenderContext;
}

export interface MetadataRendererResolveResult<TInput = unknown> {
  readonly renderer: MetadataRendererDefinition<TInput>;
  readonly reason: string;
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
  readonly reason: MetadataRendererResolveFailureReason;
  readonly message: string;
  readonly attemptedRendererKeys: readonly string[];
}
