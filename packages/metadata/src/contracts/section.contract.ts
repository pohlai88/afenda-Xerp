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
  readonly layoutId: string;
  readonly type: SectionType;
}

export interface SectionContract {
  readonly contractId: "section";
  readonly mustNotOwn: readonly ["layout", "renderer selection"];
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
  readonly purpose: string;
  readonly version: string;
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
  purpose:
    "Own list, stat, chart, form, detail, audit, and action content zone definitions for governed surfaces.",
  version: "0.1.0",
} as const satisfies SectionContract;
