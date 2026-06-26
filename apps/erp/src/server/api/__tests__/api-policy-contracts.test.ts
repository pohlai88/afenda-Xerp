import { describe, expect, it } from "vitest";

import {
  API_AUTH_POLICIES,
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "@/server/api/contracts/auth-policy.contract";
import { API_CONTEXT_POLICIES } from "@/server/api/contracts/context-policy.contract";
import { API_ROUTE_LIFECYCLE_STATUSES } from "@/server/api/contracts/lifecycle.contract";
import { API_RATE_LIMIT_POLICIES } from "@/server/api/contracts/rate-limit.contract";
import { API_STABILITY_CLASSIFICATIONS } from "@/server/api/contracts/stability.contract";

describe("API policy contracts", () => {
  it("defines serializable auth policies", () => {
    expect(API_AUTH_POLICIES.length).toBeGreaterThan(0);
    expect(isPublicAuthPolicy("public")).toBe(true);
    expect(requiresSessionAuth("session-required")).toBe(true);
  });

  it("defines serializable context policies", () => {
    expect(API_CONTEXT_POLICIES).toContain("tenant-company-org-required");
  });

  it("defines serializable rate-limit policies", () => {
    expect(API_RATE_LIMIT_POLICIES).toContain("authenticated-standard");
  });

  it("defines route lifecycle statuses", () => {
    expect(API_ROUTE_LIFECYCLE_STATUSES).toContain("active");
  });

  it("defines stability classifications", () => {
    expect(API_STABILITY_CLASSIFICATIONS).toContain("internal-stable");
  });
});
