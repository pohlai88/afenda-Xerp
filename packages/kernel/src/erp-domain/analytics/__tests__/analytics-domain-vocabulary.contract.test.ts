import { describe, expect, it } from "vitest";

import {
  ANALYTICS_AUDIT_ACTIONS,
  ANALYTICS_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ANALYTICS_DOMAIN_CLOSED_VOCABULARIES,
  ANALYTICS_DOMAIN_VOCABULARY_POLICY,
  ANALYTICS_DOMAIN_VOCABULARY_REGISTRY_ID,
  type assertAnalyticsDomainVocabularyRegistryIntegrity,
  isAggregationGrain,
  isAnalyticsAuditAction,
  isDashboardVisibility,
  isMetricCategory,
  isQueryStatus,
} from "../index.js";

describe("PAS-001B analytics domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(ANALYTICS_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-ANALYTICS"
    );
  });

  it("lists closed vocabularies", () => {
    expect(ANALYTICS_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(ANALYTICS_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(ANALYTICS_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertAnalyticsDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isAnalyticsAuditAction(ANALYTICS_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isQueryStatus("draft")).toBe(true);
    expect(isAggregationGrain("hour")).toBe(true);
    expect(isMetricCategory("financial")).toBe(true);
    expect(isDashboardVisibility("private")).toBe(true);
  });
});

describe("PAS-001B analytics domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(ANALYTICS_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
