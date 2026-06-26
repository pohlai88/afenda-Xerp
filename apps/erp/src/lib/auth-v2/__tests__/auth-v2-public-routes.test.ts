import { describe, expect, it } from "vitest";
import { isPublicRoute } from "@/lib/auth/public-routes";
import { AUTH_V2_SEGMENT_PATHS } from "@/lib/auth-v2/auth-v2-path.registry";
import { isAuthV2EntryRoute } from "@/lib/auth-v2/auth-v2-public-routes";

describe("auth-v2-public-routes", () => {
  it("marks all v2 segment paths as public auth entry routes", () => {
    for (const path of AUTH_V2_SEGMENT_PATHS) {
      expect(isAuthV2EntryRoute(path)).toBe(true);
      expect(isPublicRoute(path)).toBe(true);
    }
  });

  it("does not treat ERP dashboard as auth entry", () => {
    expect(isAuthV2EntryRoute("/")).toBe(false);
    expect(isAuthV2EntryRoute("/settings")).toBe(false);
  });
});
