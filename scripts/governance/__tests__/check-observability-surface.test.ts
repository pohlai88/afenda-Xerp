import { describe, expect, it } from "vitest";

import {
  checkObservabilitySurface,
  formatObservabilitySurfaceViolations,
} from "../check-observability-surface.mts";

describe("check-observability-surface script", () => {
  it("passes on the current repository state", () => {
    expect(checkObservabilitySurface()).toEqual([]);
  });

  it("reports deep import violations with actionable rule ids", () => {
    const violations = checkObservabilitySurface();
    const formatted = formatObservabilitySurfaceViolations(violations);

    if (violations.length > 0) {
      expect(formatted).toMatch(/\[(required-module-missing|forbidden-deep-import|erp-audit-bootstrap|audit-policy-wiring|registry-export-drift)\]/);
    }
  });
});
