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

export interface RendererCompatibilityRule {
  readonly capability: RendererCapability;
  readonly sectionType: string;
}

export interface RendererContract {
  readonly contractId: "renderer";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "renderer identity",
    "renderer capability",
    "renderer compatibility",
    "renderer resolution rules",
  ];
  readonly mustNotOwn: readonly ["business logic", "metadata ownership"];
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
} as const satisfies RendererContract;
