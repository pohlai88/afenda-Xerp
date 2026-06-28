import { describe, expect, it } from "vitest";

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

describe("presentation MCP wrapper registry (B42i + B42j + B42k)", () => {
  it("is JSON-serializable", () => {
    expect(() =>
      JSON.stringify(PRESENTATION_MCP_WRAPPER_REGISTRY)
    ).not.toThrow();
    expect(() =>
      JSON.stringify(computePresentationMcpWrapperSummary())
    ).not.toThrow();
  });

  it("tracks B42k delegating statistics cards and expanded bridge mapping", () => {
    const summary = computePresentationMcpWrapperSummary();
    expect(summary.entryCount).toBeGreaterThanOrEqual(38);
    expect(summary.delegatingCount).toBeGreaterThanOrEqual(4);
    expect(summary.governedComposeCount).toBeGreaterThanOrEqual(19);
    expect(summary.afendaOnlyCount).toBeGreaterThanOrEqual(14);
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
