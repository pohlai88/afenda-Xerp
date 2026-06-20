export const SURFACE_TYPES = ["page", "workspace", "module"] as const;

export type SurfaceType = (typeof SURFACE_TYPES)[number];

export interface SurfaceDefinition {
  readonly id: string;
  readonly metadataId: string;
  readonly type: SurfaceType;
}

export interface SurfaceContract {
  readonly contractId: "surface";
  readonly mustNotOwn: readonly ["sections", "renderers", "styling"];
  readonly owner: "Metadata";
  readonly owns: readonly [
    "page surface definitions",
    "workspace surface definitions",
    "module surface definitions",
  ];
  readonly purpose: string;
  readonly version: string;
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
  purpose:
    "Own page, workspace, and module surface boundary definitions for governed metadata surfaces.",
  version: "0.1.0",
} as const satisfies SurfaceContract;
