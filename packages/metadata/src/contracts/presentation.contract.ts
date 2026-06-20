export const PRESENTATION_MODES = ["standard", "compact", "expanded"] as const;
export const DENSITY_MODES = ["comfortable", "compact", "dense"] as const;
export const READONLY_MODES = ["editable", "readonly"] as const;
export const VISIBILITY_MODES = ["visible", "hidden", "conditional"] as const;

export type PresentationMode = (typeof PRESENTATION_MODES)[number];
export type MetadataDensityMode = (typeof DENSITY_MODES)[number];
export type ReadonlyMode = (typeof READONLY_MODES)[number];
export type VisibilityMode = (typeof VISIBILITY_MODES)[number];

export interface PresentationDefinition {
  readonly density: MetadataDensityMode;
  readonly mode: PresentationMode;
  readonly readonlyMode: ReadonlyMode;
  readonly visibility: VisibilityMode;
}

export interface PresentationContract {
  readonly contractId: "presentation";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "presentation modes",
    "density modes",
    "readonly modes",
    "visibility modes",
  ];
  readonly mustNotOwn: readonly ["design tokens", "component styling"];
}

export const presentationContract = {
  contractId: "presentation",
  mustNotOwn: ["design tokens", "component styling"],
  owner: "Metadata",
  owns: [
    "presentation modes",
    "density modes",
    "readonly modes",
    "visibility modes",
  ],
} as const satisfies PresentationContract;
