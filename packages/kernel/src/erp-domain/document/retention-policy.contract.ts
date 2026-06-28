export const RETENTION_POLICIES = [
  "standard",
  "extended",
  "legal_hold",
  "destroy",
] as const;

export type RetentionPolicy = (typeof RETENTION_POLICIES)[number];

export function isRetentionPolicy(value: string): value is RetentionPolicy {
  return (RETENTION_POLICIES as readonly string[]).includes(value);
}
