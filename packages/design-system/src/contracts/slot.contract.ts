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

export type SlotRole = (typeof SLOT_ROLES)[number];

export interface SlotContract {
  readonly description: string;
  readonly name: string;
  readonly ownsStructureOnly: boolean;
  readonly required: boolean;
  readonly role: SlotRole;
}
