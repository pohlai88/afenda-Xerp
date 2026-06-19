import { describe, expect, it } from "vitest";

import {
  isPublicRoute,
  PUBLIC_ROUTE_PREFIXES,
} from "../lib/auth/public-routes";

describe("protected route blocking helpers", () => {
  it("treats sign-in, sign-up, and Better Auth API as public", () => {
    for (const prefix of PUBLIC_ROUTE_PREFIXES) {
      expect(isPublicRoute(prefix)).toBe(true);
    }

    expect(isPublicRoute("/api/auth/sign-in/email")).toBe(true);
    expect(isPublicRoute("/sign-in")).toBe(true);
    expect(isPublicRoute("/sign-up")).toBe(true);
  });

  it("treats ERP dashboard routes as protected", () => {
    expect(isPublicRoute("/")).toBe(false);
    expect(isPublicRoute("/manufacturing")).toBe(false);
    expect(isPublicRoute("/system-admin")).toBe(false);
  });
});
