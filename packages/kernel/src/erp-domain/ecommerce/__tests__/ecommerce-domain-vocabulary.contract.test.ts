import { describe, expect, it } from "vitest";

import {
  type assertEcommerceDomainVocabularyRegistryIntegrity,
  CART_STATUSES,
  CHANNEL_TYPES,
  CHECKOUT_STEPS,
  ECOMMERCE_AUDIT_ACTIONS,
  ECOMMERCE_DOMAIN_AUDIT_VOCABULARY,
  ECOMMERCE_DOMAIN_AUTHORITY_METADATA,
  ECOMMERCE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ECOMMERCE_DOMAIN_BRANDED_IDS,
  ECOMMERCE_DOMAIN_CLOSED_VOCABULARIES,
  ECOMMERCE_DOMAIN_PERMISSION_VOCABULARY,
  ECOMMERCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ECOMMERCE_DOMAIN_VOCABULARY_POLICY,
  ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY,
  ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY_ID,
  ECOMMERCE_DOMAIN_WIRE_CONTEXT,
  ECOMMERCE_PERMISSION_KEY_VOCABULARY,
  isCartStatus,
  isChannelType,
  isCheckoutStep,
  isEcommerceAuditAction,
  isWebOrderStatus,
  WEB_ORDER_STATUSES,
} from "../index.js";

describe("PAS-001B ecommerce domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-ECOMMERCE"
    );
    expect(ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY.id).toBe(
      "PAS-001B-4.8-ECOMMERCE"
    );
  });

  it("lists closed vocabularies with non-empty value counts", () => {
    expect(
      ECOMMERCE_DOMAIN_CLOSED_VOCABULARIES.map((entry) => entry.id)
    ).toEqual([
      "cart-status",
      "checkout-step",
      "web-order-status",
      "channel-type",
    ]);

    for (const entry of ECOMMERCE_DOMAIN_CLOSED_VOCABULARIES) {
      expect(entry.pasSection).toBe("4.8");
      expect(entry.valueCount).toBeGreaterThan(0);
    }
  });

  it("keeps closed vocabulary counts aligned with live constants", () => {
    const byId = Object.fromEntries(
      ECOMMERCE_DOMAIN_CLOSED_VOCABULARIES.map((entry) => [entry.id, entry])
    );

    expect(byId["cart-status"]?.valueCount).toBe(CART_STATUSES.length);
    expect(byId["checkout-step"]?.valueCount).toBe(CHECKOUT_STEPS.length);
    expect(byId["web-order-status"]?.valueCount).toBe(
      WEB_ORDER_STATUSES.length
    );
    expect(byId["channel-type"]?.valueCount).toBe(CHANNEL_TYPES.length);
  });

  it("excludes business-reference IDs from domain branded surface (Rule 2)", () => {
    expect(ECOMMERCE_DOMAIN_BRANDED_ID_TYPE_NAMES).toEqual([
      "WebCartId",
      "CheckoutSessionId",
      "WebOrderId",
    ]);
    expect(ECOMMERCE_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
    expect(ECOMMERCE_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("ProductId");

    for (const entry of ECOMMERCE_DOMAIN_BRANDED_IDS) {
      expect(entry.brandFunction).toMatch(/^brand/);
      expect(entry.toFunction).toMatch(/^to/);
    }
  });

  it("registers wire context, audit, permission, and authority metadata", () => {
    expect(ECOMMERCE_DOMAIN_WIRE_CONTEXT.typeExport).toBe(
      "EcommerceDomainWireContext"
    );
    expect(ECOMMERCE_DOMAIN_AUDIT_VOCABULARY.valueCount).toBe(
      ECOMMERCE_AUDIT_ACTIONS.length
    );
    expect(ECOMMERCE_DOMAIN_PERMISSION_VOCABULARY.keyCount).toBe(
      ECOMMERCE_PERMISSION_KEY_VOCABULARY.length
    );
    expect(ECOMMERCE_DOMAIN_AUTHORITY_METADATA.currentLifecycle).toBe(
      "contracts-only"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertEcommerceDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isEcommerceAuditAction("web_order.paid")).toBe(true);
    expect(isCartStatus("abandoned")).toBe(true);
    expect(isCheckoutStep("payment")).toBe(true);
    expect(isWebOrderStatus("fulfilled")).toBe(true);
    expect(isChannelType("marketplace")).toBe(true);
  });
});

describe("PAS-001B ecommerce domain vocabulary policy", () => {
  it("freezes prohibited runtime surfaces", () => {
    expect(ECOMMERCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES.length).toBeGreaterThan(
      0
    );
    expect(ECOMMERCE_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
    expect(ECOMMERCE_DOMAIN_VOCABULARY_POLICY.businessReferenceNote).toContain(
      "CustomerId"
    );
  });
});
