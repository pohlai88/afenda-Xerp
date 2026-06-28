export const LEAD_STATUSES = [
  "new",
  "qualified",
  "disqualified",
  "converted",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}
