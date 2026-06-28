import { describe, expect, it } from "vitest";

import {
  type assertSupplyChainDomainVocabularyRegistryIntegrity,
  isDeliveryPriority,
  isFulfillmentEventType,
  isShipmentStatus,
  isSupplyChainAuditAction,
  isTransportMode,
  SUPPLY_CHAIN_AUDIT_ACTIONS,
  SUPPLY_CHAIN_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SUPPLY_CHAIN_DOMAIN_CLOSED_VOCABULARIES,
  SUPPLY_CHAIN_DOMAIN_VOCABULARY_POLICY,
  SUPPLY_CHAIN_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B supply-chain domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(SUPPLY_CHAIN_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-SUPPLY_CHAIN"
    );
  });

  it("lists closed vocabularies", () => {
    expect(SUPPLY_CHAIN_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(SUPPLY_CHAIN_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(SUPPLY_CHAIN_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertSupplyChainDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isSupplyChainAuditAction(SUPPLY_CHAIN_AUDIT_ACTIONS[0] ?? "")).toBe(
      true
    );
    expect(isShipmentStatus("draft")).toBe(true);
    expect(isDeliveryPriority("standard")).toBe(true);
    expect(isTransportMode("road")).toBe(true);
    expect(isFulfillmentEventType("pick")).toBe(true);
  });
});

describe("PAS-001B supply-chain domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(SUPPLY_CHAIN_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
