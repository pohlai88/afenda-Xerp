import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const BLOCKS_ROOT = join(
  import.meta.dirname,
  "../components/shadcn-studio/blocks"
);

const SAMPLE_MCP_BLOCKS = [
  "statistics-revenue-card.tsx",
  "dialog-search.tsx",
  "dropdown-notification.tsx",
] as const;

/** Sync with PRESENTATION_MCP_WRAPPER_REGISTRY delegatingCount (B42p policy). */
const DELEGATING_BRIDGE_BLOCK_SOURCES = [
  "statistics-revenue-card.tsx",
  "statistics-activity-card.tsx",
  "statistics-leads-card.tsx",
  "statistics-profile-traffic-card.tsx",
  "hero-section-01/hero-section-01.tsx",
  "statistics-orders-progress-card.tsx",
  "statistics-sales-overview-card.tsx",
  "chart-earning-report.tsx",
] as const;

const EXPECTED_DELEGATING_BRIDGE_BLOCK_COUNT = 8 as const;

/**
 * PAS-005A B42j — MCP lab blocks use stock shadcn `@/components/ui/*`, not `@afenda/ui`.
 * TIP-004 consumer zero-className rules apply to appshell/metadata-ui/erp only.
 */
describe("MCP presentation-layer className policy (B42j)", () => {
  it.each(
    SAMPLE_MCP_BLOCKS
  )("%s imports stock shadcn ui primitives, not @afenda/ui", (fileName) => {
    const source = readFileSync(join(BLOCKS_ROOT, fileName), "utf8");
    expect(source).toMatch(/@\/components\/ui\//);
    expect(source).not.toMatch(/@afenda\/ui/);
  });

  it.each(
    SAMPLE_MCP_BLOCKS
  )("%s may pass className to local stock ui primitives (lab product)", (fileName) => {
    const source = readFileSync(join(BLOCKS_ROOT, fileName), "utf8");
    expect(source).toMatch(/className=/);
  });

  it("documents scope boundary in package public surface", () => {
    const indexSource = readFileSync(
      join(import.meta.dirname, "../index.ts"),
      "utf8"
    );
    expect(indexSource).toContain("@afenda/shadcn-studio");
    expect(indexSource).not.toMatch(/@afenda\/ui/);
  });
});

/**
 * PAS-005A B42p — delegating bridge blocks inventory uses stock shadcn ui only.
 * Count must stay aligned with appshell PRESENTATION_MCP_WRAPPER_REGISTRY delegatingCount.
 */
describe("MCP delegating bridge block className policy (B42p)", () => {
  it("delegating bridge block inventory count matches registry delegatingCount", () => {
    expect(DELEGATING_BRIDGE_BLOCK_SOURCES.length).toBe(
      EXPECTED_DELEGATING_BRIDGE_BLOCK_COUNT
    );
  });

  it.each(
    DELEGATING_BRIDGE_BLOCK_SOURCES
  )("%s imports stock shadcn ui primitives, not @afenda/ui", (relativePath) => {
    const source = readFileSync(join(BLOCKS_ROOT, relativePath), "utf8");
    expect(source).toMatch(/@\/components\/ui\//);
    expect(source).not.toMatch(/@afenda\/ui/);
  });
});
