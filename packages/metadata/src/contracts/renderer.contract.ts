import type { SectionType } from "./section.contract.js";

export const RENDERER_CAPABILITIES = [
  "canRenderList",
  "canRenderStat",
  "canRenderChart",
  "canRenderForm",
  "canRenderDetail",
  "canRenderAudit",
  "canRenderAction",
] as const;

export type RendererCapability = (typeof RENDERER_CAPABILITIES)[number];

/**
 * Links a renderer capability to the section type it resolves.
 * `sectionType` is constrained to the governed `SectionType` union —
 * a renderer cannot declare compatibility with a section kind that does
 * not exist in the section authority.
 */
export interface RendererCompatibilityRule {
  readonly capability: RendererCapability;
  readonly sectionType: SectionType;
}

export interface RendererContract {
  readonly contractId: "renderer";
  readonly mustNotOwn: readonly ["business logic", "metadata ownership"];
  readonly owner: "Metadata";
  readonly owns: readonly [
    "renderer identity",
    "renderer capability",
    "renderer compatibility",
    "renderer resolution rules",
  ];
  readonly purpose: string;
  readonly version: string;
}

export const rendererContract = {
  contractId: "renderer",
  mustNotOwn: ["business logic", "metadata ownership"],
  owner: "Metadata",
  owns: [
    "renderer identity",
    "renderer capability",
    "renderer compatibility",
    "renderer resolution rules",
  ],
  purpose:
    "Own renderer identity, capability, compatibility, and resolution rules for metadata-driven surfaces.",
  version: "0.1.0",
} as const satisfies RendererContract;
