import { describe, expect, it } from "vitest";

import {
  computePresentationMcpAccountSettingsContentSummary,
  PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY,
} from "../presentation/wrappers/presentation-mcp-account-settings-content.registry";
import {
  computePresentationMcpWrapperSummary,
  listBridgeBackedPresentationMcpWrappers,
  listDelegatingPresentationMcpWrappers,
  PRESENTATION_MCP_WRAPPER_REGISTRY,
} from "../presentation/wrappers/presentation-mcp-wrapper.registry";
import * as shadcnStudioBridge from "../shadcn-studio-bridge/index.js";

const bridgeExports = shadcnStudioBridge as Record<string, unknown>;

function expectBridgeExportIsFunction(exportName: string): void {
  expect(typeof bridgeExports[exportName]).toBe("function");
}

describe("presentation MCP wrapper registry (B42i + B42j + B42k + B42m + B42n aggregate)", () => {
  it("is JSON-serializable", () => {
    expect(() =>
      JSON.stringify(PRESENTATION_MCP_WRAPPER_REGISTRY)
    ).not.toThrow();
    expect(() =>
      JSON.stringify(computePresentationMcpWrapperSummary())
    ).not.toThrow();
    expect(() =>
      JSON.stringify(PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY)
    ).not.toThrow();
    expect(() =>
      JSON.stringify(computePresentationMcpAccountSettingsContentSummary())
    ).not.toThrow();
  });

  it("aggregates B42n account-settings content sub-registry", () => {
    const contentSummary =
      computePresentationMcpAccountSettingsContentSummary();
    expect(contentSummary.entryCount).toBe(23);
    expect(contentSummary.afendaOnlyCount).toBe(23);
  });

  it("tracks B42m delegating bridge twins and expanded bridge mapping", () => {
    const summary = computePresentationMcpWrapperSummary();
    expect(summary.entryCount).toBe(40);
    expect(summary.delegatingCount).toBeGreaterThanOrEqual(8);
    expect(summary.governedComposeCount).toBeGreaterThanOrEqual(19);
    expect(summary.afendaOnlyCount).toBeGreaterThanOrEqual(11);
  });

  it("resolves every delegating entry to an exported bridge function", () => {
    for (const entry of listDelegatingPresentationMcpWrappers()) {
      const bridgeExportName = entry.bridgeExportName;
      expect(bridgeExportName).toBeDefined();
      if (bridgeExportName === undefined) {
        continue;
      }
      expectBridgeExportIsFunction(bridgeExportName);
    }
  });

  it("maps bridge-backed entries to live @afenda/shadcn-studio bridge exports", () => {
    for (const entry of listBridgeBackedPresentationMcpWrappers()) {
      const bridgeExportName = entry.bridgeExportName;
      expect(bridgeExportName).toBeDefined();
      if (bridgeExportName === undefined) {
        continue;
      }
      expectBridgeExportIsFunction(bridgeExportName);
    }
  });
});
