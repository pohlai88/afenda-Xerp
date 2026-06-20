export const SECTION_TYPES = [
  "list",
  "stat",
  "chart",
  "form",
  "detail",
  "audit",
  "action",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export interface SectionDefinition {
  readonly id: string;
  readonly type: SectionType;
  readonly layoutId: string;
}

export interface SectionContract {
  readonly contractId: "section";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "list sections",
    "stat sections",
    "chart sections",
    "form sections",
    "detail sections",
    "audit sections",
    "action sections",
  ];
  readonly mustNotOwn: readonly ["layout", "renderer selection"];
}

export const sectionContract = {
  contractId: "section",
  mustNotOwn: ["layout", "renderer selection"],
  owner: "Metadata",
  owns: [
    "list sections",
    "stat sections",
    "chart sections",
    "form sections",
    "detail sections",
    "audit sections",
    "action sections",
  ],
} as const satisfies SectionContract;
