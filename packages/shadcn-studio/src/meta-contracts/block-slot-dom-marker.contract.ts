/**
 * @afenda.l1-contract-envelope block-slot-dom-marker
 * Role: data-afenda-slot DOM marker props helper
 * Family: block-slot-dom-marker · flat L1 wire
 * Relies on: (none)
 * Relied on by: registry/assert-block-slot-dom-marker-coverage, storybook/metadata-slot-hydration-lab, index barrel
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
 */

export const AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE = "data-afenda-slot" as const;

export type BlockSlotDomMarkerProps = {
  readonly [AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE]: string;
};

/** Spread onto compositional block elements — not on `components-ui/*` primitives. */
export function blockSlotDomMarkerProps(
  slotId: string
): BlockSlotDomMarkerProps {
  return { [AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE]: slotId };
}
