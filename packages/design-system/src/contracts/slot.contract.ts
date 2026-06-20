export const SLOT_ROLES = [
  "root",
  "header",
  "body",
  "footer",
  "label",
  "control",
  "icon",
  "content",
  "actions",
  "state",
] as const;

export const slotContract = {
  acceptanceRules: [
    "Every component structure position must use an approved slot role",
    "Slots must describe structure without prescribing styling",
    "Required slots must be explicit in component contracts",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent styling in slot definitions",
      "Attach raw CSS values to slots",
      "Use slots to create behavior or business rules",
    ],
    allowed: [
      "Select approved slot roles",
      "Declare required structural positions",
      "Describe slot purpose for recipes and components",
    ],
  },
  allowedResponsibility: [
    "Define structure",
    "Name component composition positions",
    "Declare required or optional slots",
  ],
  contractId: "afenda.design-system.slot",
  downstreamConsumers: [
    "recipe.contract.ts",
    "component.contract.ts",
    "example.contract.ts",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "structure",
  owner: "TIP-004 slot contract",
  prohibitedResponsibility: [
    "Define styling",
    "Define raw design values",
    "Define component behavior",
    "Define business logic",
  ],
  purpose:
    "Own structural composition positions for governed components and recipes.",
  version: "0.1.0",
} as const;

export type SlotRole = (typeof SLOT_ROLES)[number];

export interface SlotContract {
  readonly description: string;
  readonly name: string;
  readonly ownsStructureOnly: boolean;
  readonly required: boolean;
  readonly role: SlotRole;
}
