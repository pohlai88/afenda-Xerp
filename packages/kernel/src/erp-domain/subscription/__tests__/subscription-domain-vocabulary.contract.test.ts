import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertSubscriptionDomainVocabularyRegistryIntegrity,
  isBillingCycle,
  isRenewalIntent,
  isSubscriptionAuditAction,
  isSubscriptionEventType,
  isSubscriptionStatus,
  SUBSCRIPTION_AUDIT_ACTIONS,
  SUBSCRIPTION_DOMAIN_AUDIT_VOCABULARY,
  SUBSCRIPTION_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SUBSCRIPTION_DOMAIN_CLOSED_VOCABULARIES,
  SUBSCRIPTION_DOMAIN_PERMISSION_VOCABULARY,
  SUBSCRIPTION_DOMAIN_VOCABULARY_POLICY,
  SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY,
  SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B subscription domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "subscription-status",
        "billing-cycle",
        "renewal-intent",
        "subscription-event-type",
      ],
      brandedIdTypeNames: SUBSCRIPTION_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: SUBSCRIPTION_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: SUBSCRIPTION_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

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
