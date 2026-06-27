/**
 * Canonical delivery evidence registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Delivery evidence, lines 428–430).
 *
 * TIP-007 / TIP-012 delivery doc is the single source of truth for the
 * multi-tenancy operating-context foundation slice verification chain.
 */
export const DELIVERY_EVIDENCE_SURFACE_RULE =
  "tip-007-012-doc-is-canonical-delivery-evidence-for-multi-tenancy-foundation" as const;

/** Legacy TIP delivery doc retired — multi-tenancy architecture doc is canonical evidence. */
export const TIP_007_012_DELIVERY_DOC =
  "docs/architecture/multi-tenancy.md" as const;

export const MULTI_TENANCY_DOC_REFERENCE =
  "docs/architecture/multi-tenancy.md" as const;

/** Required H2 sections per multi-tenancy.md expected final output format (lines 686–715). */
export const TIP_007_012_REQUIRED_SECTIONS = [
  "Executive summary",
  "Glossary added/updated",
  "Existing-state audit",
  "Authority design",
  "Context contracts",
  "Persistence and lookup",
  "Enterprise feature requirements delivered",
  "Enterprise group hierarchy",
  "Tenant subdomain strategy",
  "Operating context resolver",
  "Legal entity and ownership model",
  "RLS/grant scope model",
  "Accounting-consolidation readiness",
  "Package and file changes",
  "Dependency decisions",
  "Security behavior",
  "Do's and Prohibitions enforcement",
  "API/action/AppShell integration",
  "Tests added or updated",
  "Verification results",
  "Rollout plan",
  "Rollback plan",
  "Remaining gaps",
  "Enterprise acceptance criteria checklist",
  "Final score",
] as const;

/** Governance gates that must be documented and wired in root `package.json`. */
export const MULTI_TENANCY_GOVERNANCE_GATES = [
  {
    checkScript: "check:kernel-context-surface",
    qualityScript: "quality:kernel-context-surface",
    gateFile: "scripts/governance/check-kernel-context-surface.mts",
    sliceReference: "Kernel context (multi-tenancy.md §354–369)",
  },
  {
    checkScript: "check:database-tenant-domain-surface",
    qualityScript: "quality:database-tenant-domain-surface",
    gateFile: "scripts/governance/check-database-tenant-domain-surface.mts",
    sliceReference: "Database tenant domain (multi-tenancy.md §371–384)",
  },
  {
    checkScript: "check:database-tenant-rls-coverage",
    qualityScript: "quality:database-tenant-rls-coverage",
    gateFile: "scripts/governance/check-database-tenant-rls-coverage.mts",
    sliceReference:
      "Tenant RLS defense-in-depth (TIP-007/012 DoD #16, Phase 4)",
  },
  {
    checkScript: "check:database-tenant-rls-live",
    qualityScript: "quality:database-tenant-rls-live",
    gateFile: "scripts/governance/check-database-tenant-rls-live.mts",
    sliceReference:
      "Tenant RLS live apply proof (TIP-007/012 Slice G, environment-specific)",
  },
  {
    checkScript: "check:erp-context-surface",
    qualityScript: "quality:erp-context-surface",
    gateFile: "scripts/governance/check-erp-context-surface.mts",
    sliceReference: "ERP context (multi-tenancy.md §386–401)",
  },
  {
    checkScript: "check:permissions-scope-grants-surface",
    qualityScript: "quality:permissions-scope-grants-surface",
    gateFile: "scripts/governance/check-permissions-scope-grants-surface.mts",
    sliceReference: "Permissions scope/grants (multi-tenancy.md §403–409)",
  },
  {
    checkScript: "check:appshell-context-surface",
    qualityScript: "quality:appshell-context-surface",
    gateFile: "scripts/governance/check-appshell-context-surface.mts",
    sliceReference: "AppShell context (multi-tenancy.md §411–416)",
  },
  {
    checkScript: "check:observability-surface",
    qualityScript: "quality:observability-surface",
    gateFile: "scripts/governance/check-observability-surface.mts",
    sliceReference: "Observability (multi-tenancy.md §417–420)",
  },
  {
    checkScript: "check:architecture-authority-surface",
    qualityScript: "quality:architecture-authority-surface",
    gateFile: "scripts/governance/check-architecture-authority-surface.mts",
    sliceReference: "Architecture authority (multi-tenancy.md §421–427)",
  },
  {
    checkScript: "check:multi-tenancy-dependency-rules",
    qualityScript: "quality:multi-tenancy-dependency-rules",
    gateFile: "scripts/governance/check-multi-tenancy-dependency-rules.mts",
    sliceReference: "Dependency rules (multi-tenancy.md §432–445)",
  },
  {
    checkScript: "check:multi-tenancy-glossary-first",
    qualityScript: "quality:multi-tenancy-glossary-first",
    gateFile: "scripts/governance/check-multi-tenancy-glossary-first.mts",
    sliceReference: "Glossary first (multi-tenancy.md §484–500 Step 1)",
  },
  {
    checkScript: "check:multi-tenancy-existing-state-audit",
    qualityScript: "quality:multi-tenancy-existing-state-audit",
    gateFile: "scripts/governance/check-multi-tenancy-existing-state-audit.mts",
    sliceReference: "Existing-state audit (multi-tenancy.md §502–511 Step 2)",
  },
  {
    checkScript: "check:multi-tenancy-authority-design",
    qualityScript: "quality:multi-tenancy-authority-design",
    gateFile: "scripts/governance/check-multi-tenancy-authority-design.mts",
    sliceReference: "Authority design (multi-tenancy.md §503–509 Step 3)",
  },
  {
    checkScript: "check:multi-tenancy-context-contracts",
    qualityScript: "quality:multi-tenancy-context-contracts",
    gateFile: "scripts/governance/check-multi-tenancy-context-contracts.mts",
    sliceReference: "Context contracts (multi-tenancy.md §522–536 Step 4)",
  },
  {
    checkScript: "check:multi-tenancy-persistence-lookup",
    qualityScript: "quality:multi-tenancy-persistence-lookup",
    gateFile: "scripts/governance/check-multi-tenancy-persistence-lookup.mts",
    sliceReference: "Persistence and lookup (multi-tenancy.md §538–551 Step 5)",
  },
  {
    checkScript: "check:multi-tenancy-tenant-url-resolver",
    qualityScript: "quality:multi-tenancy-tenant-url-resolver",
    gateFile: "scripts/governance/check-multi-tenancy-tenant-url-resolver.mts",
    sliceReference: "Tenant URL resolver (multi-tenancy.md §553–559 Step 6)",
  },
  {
    checkScript: "check:multi-tenancy-operating-context-resolver",
    qualityScript: "quality:multi-tenancy-operating-context-resolver",
    gateFile:
      "scripts/governance/check-multi-tenancy-operating-context-resolver.mts",
    sliceReference:
      "Operating context resolver (multi-tenancy.md §561–571 Step 7)",
  },
  {
    checkScript: "check:multi-tenancy-context-integration",
    qualityScript: "quality:multi-tenancy-context-integration",
    gateFile: "scripts/governance/check-multi-tenancy-context-integration.mts",
    sliceReference:
      "API/action/AppShell integration (multi-tenancy.md §572–579 Step 8)",
  },
  {
    checkScript: "check:multi-tenancy-tests",
    qualityScript: "quality:multi-tenancy-tests",
    gateFile: "scripts/governance/check-multi-tenancy-tests.mts",
    sliceReference: "Tests (multi-tenancy.md §580–599 Step 9)",
  },
  {
    checkScript: "check:multi-tenancy-documentation-verification",
    qualityScript: "quality:multi-tenancy-documentation-verification",
    gateFile:
      "scripts/governance/check-multi-tenancy-documentation-verification.mts",
    sliceReference:
      "Documentation and verification (multi-tenancy.md §601–611 Step 10)",
  },
  {
    checkScript: "check:multi-tenancy-enterprise-acceptance",
    qualityScript: "quality:multi-tenancy-enterprise-acceptance",
    gateFile:
      "scripts/governance/check-multi-tenancy-enterprise-acceptance.mts",
    sliceReference:
      "Enterprise acceptance criteria (multi-tenancy.md §612–666)",
  },
  {
    checkScript: "check:multi-tenancy-testing-verification-acceptance",
    qualityScript: "quality:multi-tenancy-testing-verification-acceptance",
    gateFile:
      "scripts/governance/check-multi-tenancy-testing-verification-acceptance.mts",
    sliceReference:
      "Testing and verification acceptance (multi-tenancy.md §667–685)",
  },
  {
    checkScript: "check:multi-tenancy-dos-prohibitions",
    qualityScript: "quality:multi-tenancy-dos-prohibitions",
    gateFile: "scripts/governance/check-multi-tenancy-dos-prohibitions.mts",
    sliceReference: "Do's and Prohibitions (multi-tenancy.md §447–480)",
  },
  {
    checkScript: "check:multi-tenancy-final-output-format",
    qualityScript: "quality:multi-tenancy-final-output-format",
    gateFile: "scripts/governance/check-multi-tenancy-final-output-format.mts",
    sliceReference: "Expected final output format (multi-tenancy.md §686–718)",
  },
  {
    checkScript: "check:delivery-evidence-surface",
    qualityScript: "quality:delivery-evidence-surface",
    gateFile: "scripts/governance/check-delivery-evidence-surface.mts",
    sliceReference: "Delivery evidence (multi-tenancy.md §428–430)",
  },
] as const;

/** Acceptance checklist items — gate requires every item to be checked `[x]`. */
export const TIP_007_012_ACCEPTANCE_CHECKLIST = [
  "Glossary defines all 11 terms with do-not-confuse notes",
  "Kernel serializable contracts exported with governance gate",
  "Database tenant-domain surface with lookup services and gate",
  "Tenant subdomain resolves tenant only — never legal entity",
  "Legal entity verified server-side against tenant",
  "Organization unit verified against legal entity",
  "Membership scope fail-closed via permissions engine",
  "Permissions scope/grants barrels with governance gate",
  "AppShell displays resolved labels only — no database authority",
  "Observability adapter injection with governance gate",
  "Architecture authority registry aligned with docs and CI",
  "Multi-tenancy dependency rules enforced (§432–445)",
  "Multi-tenancy Do's and Prohibitions enforced (§447–480)",
  "Step 2 existing-state audit tables documented and gated (§502–511)",
  "Step 3 authority design tables documented and gated (§503–509)",
  "Step 4 context contracts documented and gated (§522–536)",
  "Step 5 persistence and lookup tables documented and gated (§538–551)",
  "Step 6 tenant URL resolver documented and gated (§553–559)",
  "Step 7 operating context resolver documented and gated (§561–571)",
  "Step 8 API/action/AppShell integration documented and gated (§572–579)",
  "Step 9 multi-tenancy tests documented and gated (§580–599)",
  "Step 10 documentation and verification documented and gated (§601–611)",
  "Enterprise acceptance criteria documented and gated (§612–666)",
  "Testing and verification acceptance documented and gated (§667–685)",
  "Expected final output format documented and gated (§686–718)",
  "Delivery evidence doc complete with verification chain",
  "No accounting / TIP-013 work in this slice",
  "Governance tests pass for all surface gates",
  "Multi-tenancy governance quality chain passes locally (§678–685)",
] as const;

export const TIP_007_012_MINIMUM_OVERALL_SCORE = 9.5 as const;

/** Root script that refreshes dist before multi-tenancy surface gates. */
export const GOVERNANCE_DIST_BUILD_SCRIPT = "build:governance-dist" as const;

/** Packages rebuilt by GOVERNANCE_DIST_BUILD_SCRIPT (dist freshness gates). */
export const GOVERNANCE_DIST_PACKAGES = [
  "@afenda/kernel",
  "@afenda/database",
  "@afenda/permissions",
  "@afenda/appshell",
  "@afenda/observability",
  "@afenda/architecture-authority",
] as const;

/**
 * Phrases that must appear in the delivery doc to prevent TIP-008 / TIP-030 over-claiming.
 */
export const TIP_007_012_REQUIRED_DISCLAIMERS = [
  "no consolidation arithmetic",
  "authority stub",
  "TIP-030 table planned",
] as const;

/**
 * Patterns that must not appear in delivery prose (consolidation / follow-on TIP completion claims).
 */
export const TIP_007_012_FORBIDDEN_OVERCLAIM_PATTERNS = [
  /consolidation\s+arithmetic\s+implemented/i,
  /consolidation\s+entries/i,
  /\bTIP-008\s+complete\b/i,
  /\bTIP-030\s+complete\b/i,
  /group-level\s+membership\s+scope\s+enforcement.*\bdelivered\b/i,
] as const;

/** Entity-group table rows must use authority-foundation vocabulary, not bare "Implemented". */
export const TIP_007_012_TIP008_TABLE_MARKERS = [
  "| Entity Group | `entity_groups` | Authority foundation",
  "| Ownership Interest | `legal_entity_ownership` | Authority foundation",
] as const;
