import type { EvidenceWidgetItemStatus } from "@afenda/shadcn-studio-v2/clients";

/** Maps foundation attestation row status strings to EvidenceWidget item status. */
export function mapAttestationStatusToEvidenceItemStatus(
  status: string
): EvidenceWidgetItemStatus {
  if (status === "delivered" || status === "complete") {
    return "complete";
  }

  if (status === "pending" || status === "in_progress") {
    return "pending";
  }

  return "missing";
}
