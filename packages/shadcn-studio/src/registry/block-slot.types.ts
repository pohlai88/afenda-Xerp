/**
 * PAS-006B — block slot shared types.
 */

export type BlockSlotRole =
  | "branding"
  | "content"
  | "form-field"
  | "form-action"
  | "metric"
  | "table"
  | "dialog"
  | "navigation";

export interface BlockSlotEntry {
  readonly blockId: string;
  readonly label: string;
  readonly role: BlockSlotRole;
  readonly slotId: string;
}
