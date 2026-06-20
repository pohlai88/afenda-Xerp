export const LAYOUT_TYPES = [
  "dashboard",
  "grid",
  "panel",
  "stack",
  "tabs",
  "wizard",
] as const;

export type LayoutType = (typeof LAYOUT_TYPES)[number];

export interface LayoutDefinition {
  readonly id: string;
  readonly surfaceId: string;
  readonly type: LayoutType;
}

export interface LayoutContract {
  readonly contractId: "layout";
  readonly mustNotOwn: readonly ["visual styling", "renderer behavior"];
  readonly owner: "Metadata";
  readonly owns: readonly [
    "dashboard layouts",
    "grid layouts",
    "panel layouts",
    "stack layouts",
    "tabs layouts",
    "wizard layouts",
  ];
  readonly purpose: string;
  readonly version: string;
}

export const layoutContract = {
  contractId: "layout",
  mustNotOwn: ["visual styling", "renderer behavior"],
  owner: "Metadata",
  owns: [
    "dashboard layouts",
    "grid layouts",
    "panel layouts",
    "stack layouts",
    "tabs layouts",
    "wizard layouts",
  ],
  purpose:
    "Own dashboard, grid, panel, stack, tabs, and wizard layout arrangements for metadata-driven surfaces.",
  version: "0.1.0",
} as const satisfies LayoutContract;
