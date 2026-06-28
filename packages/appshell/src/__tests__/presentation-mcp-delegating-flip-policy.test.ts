import { describe, expect, it } from "vitest";

import {
  computeDelegatingFlipPolicySummary,
  getMainRegistryDelegatingCount,
  listDelegatingFlipPolicyEntries,
  listGovernedComposeFlipPolicyEntries,
  PRESENTATION_MCP_DELEGATING_FLIP_POLICY_REGISTRY,
} from "../presentation/wrappers/presentation-mcp-delegating-flip-policy.registry";
import { computePresentationMcpWrapperSummary } from "../presentation/wrappers/presentation-mcp-wrapper.registry";

const DELEGATING_RATIONALE_OR_EXCEPTION = new Set([
  "mcp-a11y-parity",
  "shell-chrome-governed",
]);

describe("presentation MCP delegating-flip policy registry (B42p)", () => {
  it("is JSON-serializable", () => {
    expect(() =>
      JSON.stringify(PRESENTATION_MCP_DELEGATING_FLIP_POLICY_REGISTRY)
    ).not.toThrow();
    expect(() =>
      JSON.stringify(computeDelegatingFlipPolicySummary())
    ).not.toThrow();
  });

  it("covers every merged wrapper registry row", () => {
    const summary = computeDelegatingFlipPolicySummary();
    expect(summary.entryCount).toBe(68);
    expect(summary.delegatingCount).toBe(8);
    expect(summary.governedComposeCount).toBe(21);
    expect(summary.afendaOnlyCount).toBe(39);
  });

  it("matches main registry delegatingCount", () => {
    const mainDelegating =
      computePresentationMcpWrapperSummary().delegatingCount;
    const policyDelegating = listDelegatingFlipPolicyEntries().length;

    expect(policyDelegating).toBe(mainDelegating);
    expect(getMainRegistryDelegatingCount()).toBe(8);
    expect(mainDelegating).toBe(8);
  });

  it("requires mcp-a11y-parity or documented shell-chrome exception for delegating entries", () => {
    for (const entry of listDelegatingFlipPolicyEntries()) {
      expect(DELEGATING_RATIONALE_OR_EXCEPTION.has(entry.rationale)).toBe(true);
    }

    const a11yParityCount = listDelegatingFlipPolicyEntries().filter(
      (entry) => entry.rationale === "mcp-a11y-parity"
    ).length;
    expect(a11yParityCount).toBe(4);
  });

  it("requires non-empty flipBlockedBy for every governed-compose entry", () => {
    for (const entry of listGovernedComposeFlipPolicyEntries()) {
      expect(entry.flipBlockedBy).toBeDefined();
      expect(entry.flipBlockedBy?.length).toBeGreaterThan(0);
    }
    expect(listGovernedComposeFlipPolicyEntries().length).toBe(21);
  });

  it("documents no pending flips — targetStatus matches currentStatus", () => {
    for (const entry of PRESENTATION_MCP_DELEGATING_FLIP_POLICY_REGISTRY) {
      expect(entry.targetStatus).toBe(entry.currentStatus);
    }
  });
});
