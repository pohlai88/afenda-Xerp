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
