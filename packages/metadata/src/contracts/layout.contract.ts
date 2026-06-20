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
  readonly type: LayoutType;
  readonly surfaceId: string;
}

export interface LayoutContract {
  readonly contractId: "layout";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "dashboard layouts",
    "grid layouts",
    "panel layouts",
    "stack layouts",
    "tabs layouts",
    "wizard layouts",
  ];
  readonly mustNotOwn: readonly ["visual styling", "renderer behavior"];
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
} as const satisfies LayoutContract;
