/**
 * Canonical expected final output format registry — aligned with
 * `docs/architecture/multi-tenancy.md` (§686–718).
 */
import {
  MULTI_TENANCY_DELIVERY_DOC,
  MULTI_TENANCY_DELIVERY_MINIMUM_OVERALL_SCORE,
} from "./delivery-evidence-surface-registry.mts";

export const MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE =
  "multi-tenancy-final-output-format-is-canonical-delivery-doc-shape" as const;

/** Markers that must appear in multi-tenancy.md (§686–718). */
export const MULTI_TENANCY_DOC_FINAL_OUTPUT_MARKERS = [
  "Expected final output format:",
  MULTI_TENANCY_DELIVERY_DOC,
  "Executive summary",
  "Glossary added/updated",
  "Existing-state audit",
  "Enterprise feature requirements delivered",
  "Enterprise group hierarchy",
  "Tenant subdomain strategy",
  "Legal entity and ownership model",
  "RLS/grant scope model",
  "Accounting-consolidation readiness",
  "Package and file changes",
  "Dependency decisions",
  "Security behavior",
  "API/action/AppShell integration",
  "Tests added or updated",
  "Verification results",
  "Rollout plan",
  "Rollback plan",
  "Remaining gaps",
  "Enterprise acceptance criteria checklist",
  "Final score:",
  "Glossary clarity:",
  "Overall enterprise score:",
] as const;

/**
 * Required H2 sections per multi-tenancy.md expected final output (§688–707).
 * Additional delivery sections (authority design, context contracts, etc.) are
 * allowed beyond this list.
 */
export const MULTI_TENANCY_FINAL_OUTPUT_SECTIONS = [
  "Executive summary",
  "Glossary added/updated",
  "Existing-state audit",
  "Enterprise feature requirements delivered",
  "Enterprise group hierarchy",
  "Tenant subdomain strategy",
  "Legal entity and ownership model",
  "RLS/grant scope model",
  "Accounting-consolidation readiness",
  "Package and file changes",
  "Dependency decisions",
  "Security behavior",
  "API/action/AppShell integration",
  "Tests added or updated",
  "Verification results",
  "Rollout plan",
  "Rollback plan",
  "Remaining gaps",
  "Enterprise acceptance criteria checklist",
  "Final score",
] as const;

/** Score dimensions required in ## Final score (§709–717). */
export const MULTI_TENANCY_FINAL_SCORE_DIMENSIONS = [
  "Glossary clarity",
  "Multi-company model quality",
  "RLS/grant readiness",
  "Accounting-consolidation readiness",
  "Security quality",
  "Architecture quality",
  "Test quality",
  "Documentation quality",
  "Overall enterprise score",
] as const;

export const MULTI_TENANCY_FINAL_OUTPUT_MINIMUM_DIMENSION_SCORE =
  MULTI_TENANCY_DELIVERY_MINIMUM_OVERALL_SCORE;

export const MULTI_TENANCY_FINAL_OUTPUT_FORMAT_GATE =
  "scripts/governance/check-multi-tenancy-final-output-format.mts" as const;

export const MULTI_TENANCY_FINAL_OUTPUT_FORMAT_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-final-output-format-enforcement.mts" as const;
