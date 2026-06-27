import { describe, expect, it } from "vitest";

import {
  checkKernelIdentitySurface,
  formatIdentitySurfaceViolations,
} from "../check-kernel-identity-surface.mts";

describe("check-kernel-identity-surface", () => {
  it("passes on the current repository state", () => {
    const violations = checkKernelIdentitySurface();
    expect(violations, formatIdentitySurfaceViolations(violations)).toEqual([]);
  });
});
