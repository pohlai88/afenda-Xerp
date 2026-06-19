export const AUDIT_SOURCES = [
  "ui",
  "api",
  "server_action",
  "job",
  "integration",
  "import",
  "ai",
  "system",
] as const;

export type AuditSource = (typeof AUDIT_SOURCES)[number];

export function isAuditSource(value: string): value is AuditSource {
  return AUDIT_SOURCES.includes(value as AuditSource);
}
