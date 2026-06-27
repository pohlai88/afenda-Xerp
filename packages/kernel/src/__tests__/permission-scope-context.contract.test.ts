import { describe, expect, it } from "vitest";

import {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isPermissionGrantScopeType,
  PERMISSION_GRANT_SCOPE_TYPES,
} from "../context/permission-grant-vocabulary.contract.js";

describe("@afenda/kernel permission grant vocabulary (K5)", () => {
  it("keeps grant scope vocabulary separate from resolved scope shape", () => {
    expect(PERMISSION_GRANT_SCOPE_TYPES).toContain("tenant");
    expect(PERMISSION_GRANT_SCOPE_TYPES).toContain("consolidation_view");
    expect(isPermissionGrantScopeType("company")).toBe(true);
    expect(isPermissionGrantScopeType("invalid")).toBe(false);
    expect(DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS.platformAdmin).toBe(false);
  });
});
