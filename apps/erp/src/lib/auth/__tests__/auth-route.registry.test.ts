import { describe, expect, it } from "vitest";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import {
  AUTH_ROUTE_REGISTRY,
  resolveAuthRouteCopy,
} from "@/lib/auth/auth-route.registry";

describe("auth-route.registry", () => {
  it("defines metadata-driven copy for core auth entry routes", () => {
    expect(AUTH_ROUTE_REGISTRY.signIn.title).toBe("Sign in to Afenda ERP");
    expect(AUTH_ROUTE_REGISTRY.signUp.title).toBe("Create account");
    expect(AUTH_ROUTE_REGISTRY.forgotPassword.title).toBe(
      "Reset your password"
    );
    expect(AUTH_ROUTE_REGISTRY.resetPassword.title).toBe(
      "Choose a new password"
    );
    expect(AUTH_ROUTE_REGISTRY.verifyEmail.title).toBe("Verify your email");
    expect(AUTH_ROUTE_REGISTRY.workspaceSelect.title).toBe("Choose workspace");
  });

  it("defines lane-aware form eyebrows for entry routes", () => {
    expect(AUTH_ROUTE_REGISTRY.signIn.eyebrow).toBe(
      `Access Lane · ${AUTH_PATHS.signIn}`
    );
    expect(AUTH_ROUTE_REGISTRY.forgotPassword.eyebrow).toBe(
      `Recovery Lane · ${AUTH_PATHS.forgotPassword}`
    );
    expect(AUTH_ROUTE_REGISTRY.accessDenied.eyebrow).toBe(
      `Error Lane · ${AUTH_PATHS.accessDenied}`
    );
  });

  it("resolves route copy for entry routes", () => {
    expect(resolveAuthRouteCopy("signIn")).toEqual({
      description: AUTH_ROUTE_REGISTRY.signIn.description,
      eyebrow: AUTH_ROUTE_REGISTRY.signIn.eyebrow,
      title: AUTH_ROUTE_REGISTRY.signIn.title,
      lane: AUTH_ROUTE_REGISTRY.signIn.lane,
    });
  });

  it("exports non-indexable metadata for each route", () => {
    for (const route of Object.values(AUTH_ROUTE_REGISTRY)) {
      expect(route.metadata.robots).toEqual({
        follow: false,
        index: false,
      });
    }
  });
});
