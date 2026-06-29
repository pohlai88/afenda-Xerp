import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = join(import.meta.dirname, "../../..");
const diagnosticsPaths = [
  "apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx",
  "apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx",
  "apps/erp/src/components/system-admin/system-admin-readiness-gate-refresh.client.tsx",
  "apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-status.server.ts",
  "apps/erp/src/lib/system-admin/spawn-accounting-readiness-gate-live-status.server.ts",
  "apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts",
  "apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-presentation.server.ts",
];

describe("accounting readiness diagnostics — ADR-0010 prohibition", () => {
  it("does not import @afenda/accounting in diagnostics wiring", () => {
    for (const relativePath of diagnosticsPaths) {
      const source = readFileSync(join(repoRoot, relativePath), "utf8");
      expect(source).not.toContain("@afenda/accounting");
    }
  });

  it("does not create the deprecated Architecture Authority sign-off path", () => {
    expect(
      existsSync(
        join(repoRoot, "docs/PAS/phase-9-architecture-authority-sign-off.md")
      )
    ).toBe(false);
  });

  it("requires the canonical Phase 9 accounting readiness sign-off record", () => {
    expect(
      existsSync(
        join(
          repoRoot,
          "docs/adr/ADR-0010-no-accounting-before-foundation-gate.md"
        )
      )
    ).toBe(true);
  });
});
