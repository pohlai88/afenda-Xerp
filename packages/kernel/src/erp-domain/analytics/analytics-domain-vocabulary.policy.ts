export const ANALYTICS_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "analytics-query-engine",
  "metric-compute-service",
  "analytics-database-runtime",
] as const;

export type AnalyticsDomainProhibitedRuntimeSurface =
  (typeof ANALYTICS_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const ANALYTICS_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B105" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe analytics words. It must not execute query engine runtime." as const,
  prohibitedRuntimeSurfaces: ANALYTICS_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "Tenant-scoped entity IDs remain on kernel authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
