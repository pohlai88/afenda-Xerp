export const SURFACE_TYPES = ["page", "workspace", "module"] as const;

export type SurfaceType = (typeof SURFACE_TYPES)[number];

export interface SurfaceDefinition {
  readonly id: string;
  readonly type: SurfaceType;
  readonly metadataId: string;
}

export interface SurfaceContract {
  readonly contractId: "surface";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "page surface definitions",
    "workspace surface definitions",
    "module surface definitions",
  ];
  readonly mustNotOwn: readonly ["sections", "renderers", "styling"];
}

export const surfaceContract = {
  contractId: "surface",
  mustNotOwn: ["sections", "renderers", "styling"],
  owner: "Metadata",
  owns: [
    "page surface definitions",
    "workspace surface definitions",
    "module surface definitions",
  ],
} as const satisfies SurfaceContract;
