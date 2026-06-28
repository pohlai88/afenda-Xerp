import { describe, expect, it } from "vitest";

import {
  checkObservabilityIdentityParity,
  formatObservabilityIdentityParityViolations,
} from "../identity/observability-identity-parity.governance.mts";

describe("check-observability-identity-parity", () => {
  it("passes on the current repository state", () => {
    const violations = checkObservabilityIdentityParity();
    expect(
      violations,
      formatObservabilityIdentityParityViolations(violations)
    ).toEqual([]);
  });
});
