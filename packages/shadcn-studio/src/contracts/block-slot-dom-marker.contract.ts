/**
 * PAS-006D P06-008-R2 — DOM slot marker contract (presentation-owned).
 */

export const AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE = "data-afenda-slot" as const;

export type BlockSlotDomMarkerProps = {
  readonly [AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE]: string;
};

/** Spread onto compositional block elements — not on `components/ui/*` primitives. */
export function blockSlotDomMarkerProps(
  slotId: string
): BlockSlotDomMarkerProps {
  return { [AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE]: slotId };
}
