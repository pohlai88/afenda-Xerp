import {
  DEFAULT_RLS_GRANT_ELEVATION_FLAGS,
  RLS_GRANT_SCOPE_TYPES,
} from "@afenda/database";
import {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  PERMISSION_GRANT_SCOPE_TYPES,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

describe("grant scope vocabulary parity (kernel ↔ database RLS authority)", () => {
  it("keeps PERMISSION_GRANT_SCOPE_TYPES aligned with RLS_GRANT_SCOPE_TYPES", () => {
    expect([...PERMISSION_GRANT_SCOPE_TYPES]).toEqual([
      ...RLS_GRANT_SCOPE_TYPES,
    ]);
  });

  it("keeps elevation flag defaults aligned", () => {
    expect(DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS).toEqual(
      DEFAULT_RLS_GRANT_ELEVATION_FLAGS
    );
  });
});
