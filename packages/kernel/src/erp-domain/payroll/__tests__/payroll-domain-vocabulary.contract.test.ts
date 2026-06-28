import { describe, expect, it } from "vitest";

import {
  type assertPayrollDomainVocabularyRegistryIntegrity,
  isDeductionType,
  isEarningsType,
  isPayFrequency,
  isPayrollAuditAction,
  isPayrollRunStatus,
  PAYROLL_AUDIT_ACTIONS,
  PAYROLL_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PAYROLL_DOMAIN_CLOSED_VOCABULARIES,
  PAYROLL_DOMAIN_VOCABULARY_POLICY,
  PAYROLL_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B payroll domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(PAYROLL_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-PAYROLL");
  });

  it("lists closed vocabularies", () => {
    expect(PAYROLL_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(PAYROLL_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(PAYROLL_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertPayrollDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isPayrollAuditAction(PAYROLL_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isPayrollRunStatus("draft")).toBe(true);
    expect(isPayFrequency("weekly")).toBe(true);
    expect(isEarningsType("regular")).toBe(true);
    expect(isDeductionType("tax")).toBe(true);
  });
});

describe("PAS-001B payroll domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(PAYROLL_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
