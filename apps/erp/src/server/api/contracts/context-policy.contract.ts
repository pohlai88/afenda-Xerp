export const API_CONTEXT_POLICIES = [
  "none",
  "tenant-required",
  "tenant-company-required",
  "tenant-company-org-required",
  "tenant-company-org-team-required",
  "tenant-company-org-team-project-required",
  "consolidation-scope-required",
] as const;

export type ApiContextPolicy = (typeof API_CONTEXT_POLICIES)[number];

export function requiresOperatingContext(
  contextPolicy: ApiContextPolicy
): boolean {
  return contextPolicy !== "none";
}
