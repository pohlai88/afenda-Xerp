import { describe, expect, it } from "vitest";

import {
  AUTH_LANES,
  AUTH_PATH_LANE_MAP,
  AUTH_PATHS,
  AUTH_SEGMENT_PATHS,
  buildAuthPath,
} from "@/lib/auth/auth-path.registry";

describe("auth-path.registry", () => {
  it("defines every enterprise lane route", () => {
    expect(AUTH_SEGMENT_PATHS).toHaveLength(20);
    expect(AUTH_SEGMENT_PATHS).toContain(AUTH_PATHS.signIn);
    expect(AUTH_SEGMENT_PATHS).toContain(AUTH_PATHS.verifyEmail.sent);
    expect(AUTH_SEGMENT_PATHS).toContain(AUTH_PATHS.workspaceSelect);
    expect(AUTH_SEGMENT_PATHS).toContain(AUTH_PATHS.securityReview);
  });

  it("maps every segment path to a governed lane", () => {
    for (const path of AUTH_SEGMENT_PATHS) {
      const lane = AUTH_PATH_LANE_MAP[path];
      expect(AUTH_LANES).toContain(lane);
    }
  });

  it("builds query strings for auth paths", () => {
    expect(buildAuthPath("signIn", { next: "/dashboard" })).toBe(
      "/sign-in?next=%2Fdashboard"
    );
    expect(buildAuthPath("accessDenied", { reason: "unlinked" })).toBe(
      "/access-denied?reason=unlinked"
    );
  });
});
