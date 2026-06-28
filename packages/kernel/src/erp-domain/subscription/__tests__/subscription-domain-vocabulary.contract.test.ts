import { describe, expect, it } from "vitest";

import {
  type assertSubscriptionDomainVocabularyRegistryIntegrity,
  isBillingCycle,
  isRenewalIntent,
  isSubscriptionAuditAction,
  isSubscriptionEventType,
  isSubscriptionStatus,
  SUBSCRIPTION_AUDIT_ACTIONS,
  SUBSCRIPTION_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SUBSCRIPTION_DOMAIN_CLOSED_VOCABULARIES,
  SUBSCRIPTION_DOMAIN_VOCABULARY_POLICY,
  SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B subscription domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-SUBSCRIPTION"
    );
  });

  it("lists closed vocabularies", () => {
    expect(SUBSCRIPTION_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(SUBSCRIPTION_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(SUBSCRIPTION_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertSubscriptionDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isSubscriptionAuditAction(SUBSCRIPTION_AUDIT_ACTIONS[0] ?? "")).toBe(
      true
    );
    expect(isSubscriptionStatus("trial")).toBe(true);
    expect(isBillingCycle("monthly")).toBe(true);
    expect(isRenewalIntent("auto")).toBe(true);
    expect(isSubscriptionEventType("activate")).toBe(true);
  });
});

describe("PAS-001B subscription domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(SUBSCRIPTION_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
