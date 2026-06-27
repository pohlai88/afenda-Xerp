/**
 * PAS-001 §4.8 — prohibited accounting runtime surfaces (contracts-only lifecycle).
 * Documentation manifest — not a parallel ID registry or enforcement gate.
 */

export const ACCOUNTING_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "journal-posting-service",
  "ledger-service",
  "trial-balance-calculation",
  "consolidation-elimination-logic",
  "accounting-database-runtime",
  "accounting-package-recreation",
  "financial-statement-generation",
  "fiscal-calendar-setup-runtime",
  "period-close-workflow",
  "currency-conversion-logic",
] as const;

export type AccountingDomainProhibitedRuntimeSurface =
  (typeof ACCOUNTING_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const ACCOUNTING_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe accounting words. It must not execute accounting." as const,
  prohibitedRuntimeSurfaces: ACCOUNTING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  forbiddenPlatformFloorNote:
    "FiscalCalendarId and FiscalPeriodId remain on @afenda/kernel/erp-domain/accounting only — see FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS (PAS-001 §4.1.6)." as const,
  enforcementGate: "pnpm check:accounting-domain-contracts" as const,
} as const;
