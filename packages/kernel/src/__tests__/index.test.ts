import { describe, expect, it } from "vitest";

import {
  createTestEnterpriseId,
  getPackageName,
  normalizeUserIdForWire,
  PACKAGE_NAME,
} from "../index.js";

describe("@afenda/kernel", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/kernel");
    expect(getPackageName()).toBe("@afenda/kernel");
  });

  it("exports normalizeUserIdForWire from package root", () => {
    const enterpriseUserId = createTestEnterpriseId("user");
    expect(normalizeUserIdForWire(enterpriseUserId)).toBe(enterpriseUserId);
  });
});
