export interface MetadataActionReasonProps {
  readonly id: string;
  readonly reason: string;
}

/**
 * Screen-reader-only action reason text referenced by aria-describedby.
 * Uses visually-hidden styling — not the `hidden` attribute, which removes
 * the node from the accessibility tree and breaks describedby references.
 */
export function MetadataActionReason({ id, reason }: MetadataActionReasonProps) {
  return (
    <span className="metadata-visually-hidden" id={id}>
      {reason}
    </span>
  );
}
