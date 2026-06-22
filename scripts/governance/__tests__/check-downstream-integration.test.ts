import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkDownstreamIntegration,
  formatDownstreamViolations,
} from "../check-downstream-integration.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-downstream-integration", () => {
  it("passes on the current repository state", () => {
    const violations = checkDownstreamIntegration();

    expect(violations, formatDownstreamViolations(violations)).toEqual([]);
  });

  it("flags fixture CSS in ERP globals", () => {
    const globalsPath = join(repoRoot, "apps/erp/src/app/globals.css");
    const original = readFileSync(globalsPath, "utf8");

    expect(original).not.toContain("@afenda/metadata-ui/fixtures.css");
    expect(original).not.toContain("@afenda/appshell/fixtures.css");
  });

  it("documents the approved ERP CSS import order", () => {
    const globals = readFileSync(
      join(repoRoot, "apps/erp/src/app/globals.css"),
      "utf8"
    );

    const uiPos = globals.indexOf("@afenda/ui/afenda-ui.css");
    const appshellPos = globals.indexOf("@afenda/appshell/afenda-appshell.css");
    const metadataUiPos = globals.indexOf(
      "@afenda/metadata-ui/afenda-metadata-ui.css"
    );

    expect(uiPos).toBeGreaterThan(-1);
    expect(appshellPos).toBeGreaterThan(uiPos);
    expect(metadataUiPos).toBeGreaterThan(appshellPos);
  });
});
