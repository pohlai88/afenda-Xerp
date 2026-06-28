import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  computePresentationMcpAccountSettingsContentSummary,
  PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY,
} from "../presentation/wrappers/presentation-mcp-account-settings-content.registry";

const REPO_ROOT = join(import.meta.dirname, "../../../..");

describe("presentation MCP account-settings content registry (B42n)", () => {
  it("maps every B42n entry to an on-disk wrapper file", () => {
    for (const entry of PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY) {
      expect(existsSync(join(REPO_ROOT, entry.wrapperPath))).toBe(true);
      expect(entry.wrapperPath).not.toContain("shadcn-studio-bridge/index.ts");
    }
  });

  it("tracks afenda-only status for all account-settings content slices", () => {
    const summary = computePresentationMcpAccountSettingsContentSummary();
    expect(summary.entryCount).toBe(23);
    expect(summary.afendaOnlyCount).toBe(23);
    expect(summary.delegatingCount).toBe(0);
    expect(summary.governedComposeCount).toBe(0);

    for (const entry of PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY) {
      expect(entry.status).toBe("afenda-only");
    }
  });

  it("is JSON-serializable", () => {
    expect(() =>
      JSON.stringify(PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY)
    ).not.toThrow();
    expect(() =>
      JSON.stringify(computePresentationMcpAccountSettingsContentSummary())
    ).not.toThrow();
  });
});
