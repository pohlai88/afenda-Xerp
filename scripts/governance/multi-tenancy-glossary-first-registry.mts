/**
 * Canonical glossary-first registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 1, lines 484–500).
 *
 * Step 1 must complete before downstream implementation slices.
 * Runtime checks live in `lib/multi-tenancy-glossary-first-enforcement.mts`.
 */
export const MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE =
  "multi-tenancy-glossary-first-is-canonical-vocabulary-before-implementation" as const;

export const MULTI_TENANCY_GLOSSARY_PATH =
  "docs/architecture/glossary.md" as const;

/** Markers that must appear in multi-tenancy.md Step 1 (§484–500). */
export const MULTI_TENANCY_DOC_GLOSSARY_FIRST_MARKERS = [
  "Step 1 — Glossary first",
  "Create/update `docs/architecture/glossary.md`.",
  "Add “do not confuse” notes.",
] as const;

/** Explicit term names required by Step 1 bullet list (§489–499). */
export const MULTI_TENANCY_GLOSSARY_FIRST_REQUIRED_TERMS = [
  "Tenant",
  "Entity Group",
  "Legal Entity / Company",
  "Ownership Interest",
  "Organization Unit",
  "Team",
  "Project",
  "Workspace",
  "Surface",
  "RLS Grant",
  "Consolidation Scope",
] as const;

/** Required glossary H2 headings — one per Step 1 term. */
export const MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS = [
  "## Tenant",
  "## Entity Group",
  "## Legal Entity / Company",
  "## Ownership Interest",
  "## Organization Unit",
  "## Team",
  "## Project",
  "## Workspace",
  "## Surface",
  "## RLS Grant",
  "## Consolidation Scope",
] as const;

/** Each term section must include at least one do-not-confuse boundary note. */
export const MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_SECTION_PATTERN =
  /Must not (?:be confused|be treated|replace)|Do not confuse|is not the same as|Does not own|not a database(?: table| entity)?|not a peer of it/i;

/** Cross-term phrases that must appear somewhere in the glossary (tier separation). */
export const MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_REQUIRED_PHRASES = [
  "Must not be confused with legal entity",
  "Must not be treated as a generic organization unit",
  "Must not replace Legal Entity/Company",
  "Must not be confused with Tenant or Legal Entity",
  "Must not be confused with Membership",
  "Must not be confused with Workspace",
  "Must not be confused with Entity Group",
] as const;

export const MULTI_TENANCY_GLOSSARY_MIN_DO_NOT_CONFUSE = 11 as const;

export const MULTI_TENANCY_GLOSSARY_FIRST_GATE =
  "scripts/governance/check-multi-tenancy-glossary-first.mts" as const;

export const MULTI_TENANCY_GLOSSARY_FIRST_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-glossary-first-enforcement.mts" as const;

/** Delivery doc section title for Step 1 mapping. */
export const TIP_007_012_GLOSSARY_FIRST_SECTION =
  "Glossary first (Step 1)" as const;
