import { RENDERER_CAPABILITIES } from "./metadata.constants.js";
import type { RendererCapability, SectionType } from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const RENDERER_CONTRACT_OWNERSHIPS = [
  "renderer-identity",
  "renderer-capability",
  "renderer-compatibility",
  "renderer-resolution-rules",
] as const;

export type RendererContractOwnership =
  (typeof RENDERER_CONTRACT_OWNERSHIPS)[number];

export const RENDERER_CONTRACT_PROHIBITIONS = [
  "renderer-implementation",
  "rendering-implementation",
  "react-components",
  "ui-components",
  "component-styling",
  "design-tokens",
  "business-logic",
  "database-access",
  "permission-execution",
  "metadata-ownership",
] as const;

export type RendererContractProhibition =
  (typeof RENDERER_CONTRACT_PROHIBITIONS)[number];

export interface RendererCompatibilityRule {
  /**
   * Governed renderer capability.
   *
   * Example: `render-list`, `render-chart`, `render-form`
   */
  readonly capability: RendererCapability;

  /** Governed metadata section type this capability supports. */
  readonly sectionType: SectionType;
}

export interface RendererContract {
  readonly authority: "renderer";

  /** Governed renderer capabilities. */
  readonly capabilities: readonly RendererCapability[];

  /** Compatibility rules between renderer capabilities and section types. */
  readonly compatibilityRules: readonly RendererCompatibilityRule[];

  /**
   * Renderer contract owns renderer identity, capability vocabulary,
   * compatibility mapping, and resolution rules only.
   *
   * It does not own renderer implementation.
   * Actual renderer implementation belongs in `@afenda/metadata-ui`.
   */
  readonly owns: readonly RendererContractOwnership[];

  /** Responsibilities explicitly forbidden from the renderer contract. */
  readonly prohibits: readonly RendererContractProhibition[];
  readonly version: typeof METADATA_CONTRACT_VERSION;
}

export const RENDERER_COMPATIBILITY_RULES = [
  { capability: "render-list", sectionType: "list" },
  { capability: "render-stat", sectionType: "stat" },
  { capability: "render-chart", sectionType: "chart" },
  { capability: "render-form", sectionType: "form" },
  { capability: "render-detail", sectionType: "detail" },
  { capability: "render-audit", sectionType: "audit" },
  { capability: "render-action", sectionType: "action" },
] as const satisfies readonly RendererCompatibilityRule[];

export const rendererContract = {
  authority: "renderer",
  version: METADATA_CONTRACT_VERSION,
  owns: RENDERER_CONTRACT_OWNERSHIPS,
  capabilities: RENDERER_CAPABILITIES,
  compatibilityRules: RENDERER_COMPATIBILITY_RULES,
  prohibits: RENDERER_CONTRACT_PROHIBITIONS,
} as const satisfies RendererContract;

export function getRendererCapabilityForSectionType(
  sectionType: SectionType
): RendererCapability | undefined {
  return RENDERER_COMPATIBILITY_RULES.find(
    (rule) => rule.sectionType === sectionType
  )?.capability;
}

export function isRendererCapabilityCompatibleWithSectionType(
  capability: RendererCapability,
  sectionType: SectionType
): boolean {
  return RENDERER_COMPATIBILITY_RULES.some(
    (rule) => rule.capability === capability && rule.sectionType === sectionType
  );
}
