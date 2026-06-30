import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkDownstreamIntegration,
  formatDownstreamViolations,
} from "../check-downstream-integration.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-downstream-integration", () => {
  it("passes on the ADR-0027 repository state", () => {
    const violations = checkDownstreamIntegration();

    expect(violations, formatDownstreamViolations(violations)).toEqual([]);
  });

  it("uses PAS-006 ERP globals import chain only", () => {
    const globals = readFileSync(
      join(repoRoot, "apps/erp/src/app/globals.css"),
      "utf8"
    );

    expect(globals).toContain("@afenda/shadcn-studio/shadcn-studio.css");
    expect(globals).toContain('@import "tailwindcss"');
    expect(globals).toContain('@import "tw-animate-css"');
    expect(globals).toContain('@import "shadcn/tailwind.css"');
    expect(globals).not.toContain("@afenda/ui/");
    expect(globals).not.toContain("@afenda/appshell/");
    expect(globals).not.toContain("@afenda/metadata-ui/");
  });
});
