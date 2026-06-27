import { describe, expect, it } from "vitest";
import {
  ENTERPRISE_ID_FAMILIES,
  FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
  ID_FAMILIES,
} from "../../../identity/registry/id-family.registry.js";
import {
  ACCOUNT_TYPES,
  ACCOUNTING_AUDIT_ACTIONS,
  ACCOUNTING_DOMAIN_AUDIT_VOCABULARY,
  ACCOUNTING_DOMAIN_AUTHORITY_METADATA,
  ACCOUNTING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ACCOUNTING_DOMAIN_BRANDED_IDS,
  ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES,
  ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS,
  ACCOUNTING_DOMAIN_PERMISSION_VOCABULARY,
  ACCOUNTING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ACCOUNTING_DOMAIN_VOCABULARY_POLICY,
  ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY,
  ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY_ID,
  ACCOUNTING_DOMAIN_WIRE_CONTEXT,
  ACCOUNTING_PERMISSION_KEY_VOCABULARY,
  type assertAccountingDomainVocabularyRegistryIntegrity,
  CONSOLIDATION_METHODS,
  FISCAL_PERIOD_STATES,
  isAccountingAuditAction,
  isAccountType,
  isConsolidationMethod,
  isFiscalPeriodState,
  isJournalDocumentType,
  isPostingStatus,
  JOURNAL_DOCUMENT_TYPES,
  POSTING_STATUSES,
} from "../index.js";

describe("PAS-001 §4.8 accounting domain vocabulary registry", () => {
  it("declares registry identity and PAS section", () => {
    expect(ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001-4.8");
    expect(ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY.id).toBe("PAS-001-4.8");
  });

  it("lists all §4.8 closed vocabularies with non-empty value counts", () => {
    expect(
      ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES.map((entry) => entry.id)
    ).toEqual([
      "account-type",
      "posting-status",
      "fiscal-period-state",
      "journal-document-type",
      "consolidation-method",
    ]);

    for (const entry of ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES) {
      expect(entry.pasSection).toBe("4.8");
      expect(entry.valueCount).toBeGreaterThan(0);
    }
  });

  it("keeps closed vocabulary counts aligned with live constants", () => {
    const byId = Object.fromEntries(
      ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES.map((entry) => [entry.id, entry])
    );

    expect(byId["account-type"]?.valueCount).toBe(ACCOUNT_TYPES.length);
    expect(byId["posting-status"]?.valueCount).toBe(POSTING_STATUSES.length);
    expect(byId["fiscal-period-state"]?.valueCount).toBe(
      FISCAL_PERIOD_STATES.length
    );
    expect(byId["journal-document-type"]?.valueCount).toBe(
      JOURNAL_DOCUMENT_TYPES.length
    );
    expect(byId["consolidation-method"]?.valueCount).toBe(
      CONSOLIDATION_METHODS.length
    );
  });

  it("lists branded accounting ID type names per §4.8", () => {
    expect(ACCOUNTING_DOMAIN_BRANDED_ID_TYPE_NAMES).toEqual([
      "AccountId",
      "JournalEntryId",
      "FiscalCalendarId",
      "FiscalPeriodId",
      "LedgerAccountCode",
    ]);

    for (const entry of ACCOUNTING_DOMAIN_BRANDED_IDS) {
      expect(entry.brandFunction).toMatch(/^brand/);
      expect(entry.toFunction).toMatch(/^to/);
    }
  });

  it("registers wire context, audit, permission, and authority metadata", () => {
    expect(ACCOUNTING_DOMAIN_WIRE_CONTEXT.typeExport).toBe(
      "AccountingDomainWireContext"
    );
    expect(ACCOUNTING_DOMAIN_AUDIT_VOCABULARY.valueCount).toBe(
      ACCOUNTING_AUDIT_ACTIONS.length
    );
    expect(ACCOUNTING_DOMAIN_PERMISSION_VOCABULARY.keyCount).toBe(
      ACCOUNTING_PERMISSION_KEY_VOCABULARY.length
    );
    expect(ACCOUNTING_DOMAIN_AUTHORITY_METADATA.currentLifecycle).toBe(
      "contracts-only"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertAccountingDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });
});

describe("PAS-001 §4.8 accounting domain vocabulary policy", () => {
  it("freezes prohibited runtime surfaces from PAS §4.8", () => {
    expect(ACCOUNTING_DOMAIN_PROHIBITED_RUNTIME_SURFACES).toEqual([
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
    ]);
  });

  it("documents contracts-only lifecycle and enforcement gate", () => {
    expect(ACCOUNTING_DOMAIN_VOCABULARY_POLICY.pasSection).toBe("4.8");
    expect(ACCOUNTING_DOMAIN_VOCABULARY_POLICY.lifecycle).toBe(
      "contracts-only"
    );
    expect(ACCOUNTING_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:accounting-domain-contracts"
    );
    expect(ACCOUNTING_DOMAIN_VOCABULARY_POLICY.prohibitedRuntimeSurfaces).toBe(
      ACCOUNTING_DOMAIN_PROHIBITED_RUNTIME_SURFACES
    );
  });
});

describe("PAS-001 §4.8 closed vocabulary narrowers", () => {
  it("narrows account types", () => {
    for (const value of ACCOUNT_TYPES) {
      expect(isAccountType(value)).toBe(true);
    }
    expect(isAccountType("unknown")).toBe(false);
  });

  it("narrows posting statuses", () => {
    for (const value of POSTING_STATUSES) {
      expect(isPostingStatus(value)).toBe(true);
    }
    expect(isPostingStatus("unknown")).toBe(false);
  });

  it("narrows fiscal period states", () => {
    for (const value of FISCAL_PERIOD_STATES) {
      expect(isFiscalPeriodState(value)).toBe(true);
    }
    expect(isFiscalPeriodState("unknown")).toBe(false);
  });

  it("narrows journal document types", () => {
    for (const value of JOURNAL_DOCUMENT_TYPES) {
      expect(isJournalDocumentType(value)).toBe(true);
    }
    expect(isJournalDocumentType("unknown")).toBe(false);
  });

  it("narrows consolidation methods", () => {
    expect(CONSOLIDATION_METHODS).toEqual([
      "full",
      "proportional",
      "equity",
      "cost",
      "none",
    ]);

    for (const value of CONSOLIDATION_METHODS) {
      expect(isConsolidationMethod(value)).toBe(true);
    }
    expect(isConsolidationMethod("full_consolidation")).toBe(false);
  });

  it("narrows accounting audit actions", () => {
    for (const value of ACCOUNTING_AUDIT_ACTIONS) {
      expect(isAccountingAuditAction(value)).toBe(true);
    }
    expect(isAccountingAuditAction("journal.unknown")).toBe(false);
  });
});

describe("PAS-001 §4.8 forbidden platform-floor separation", () => {
  it("marks fiscal branded IDs as forbidden on platform floor", () => {
    expect(ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS).toEqual([
      "FiscalCalendarId",
      "FiscalPeriodId",
    ]);
    expect(ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS).toEqual([
      ...FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
    ]);
  });

  it("excludes forbidden fiscal type names from ID_FAMILIES", () => {
    const enterpriseTypeNames = ENTERPRISE_ID_FAMILIES.map(
      (family) => ID_FAMILIES[family].typeName
    );

    for (const forbidden of FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS) {
      expect(enterpriseTypeNames).not.toContain(forbidden);
      expect(ACCOUNTING_DOMAIN_BRANDED_ID_TYPE_NAMES).toContain(forbidden);
    }
  });
});
