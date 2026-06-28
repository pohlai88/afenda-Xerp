import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_AUDIT_ACTIONS,
  ACCOUNTING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES,
  ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS,
  ACCOUNTING_DOMAIN_VOCABULARY_POLICY,
  ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY,
  ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY_ID,
  type assertAccountingDomainVocabularyRegistryIntegrity,
  isAccountingAuditAction,
  isAccountType,
  isConsolidationMethod,
  isFiscalPeriodState,
  isJournalDocumentType,
  isPostingStatus,
} from "../index.js";

describe("PAS-001B accounting domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-ACCOUNTING"
    );
    expect(ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY.id).toBe(
      "PAS-001B-4.8-ACCOUNTING"
    );
  });

  it("lists closed vocabularies with expected count", () => {
    expect(ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES.length).toBe(5);
  });

  it("registers branded IDs", () => {
    expect(ACCOUNTING_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(5);
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertAccountingDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isAccountingAuditAction(ACCOUNTING_AUDIT_ACTIONS[0] ?? "")).toBe(
      true
    );
    expect(isAccountType("asset")).toBe(true);
    expect(isPostingStatus("draft")).toBe(true);
    expect(isFiscalPeriodState("not_opened")).toBe(true);
    expect(isJournalDocumentType("standard")).toBe(true);
    expect(isConsolidationMethod("full")).toBe(true);
  });

  it("aligns forbidden platform-floor branded IDs with identity registry", async () => {
    const { FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS } = await import(
      "../../../identity/registry/id-family.registry.js"
    );
    expect(ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS).toEqual([
      ...FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
    ]);
  });
});

describe("PAS-001B accounting domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(ACCOUNTING_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
    expect(ACCOUNTING_DOMAIN_VOCABULARY_POLICY.pas001bSlice).toBe("B76");
  });
});
