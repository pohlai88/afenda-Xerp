import { describe, expect, it } from "vitest";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import {
  AUTH_ROUTE_REGISTRY,
  resolveAuthEntryRouteCopy,
} from "@/lib/auth/auth-route.registry";

describe("auth-route.registry", () => {
  it("defines metadata-driven copy for core auth entry routes", () => {
    expect(AUTH_ROUTE_REGISTRY.signIn.formHeading).toBe(
      "Sign in to Afenda ERP"
    );
    expect(AUTH_ROUTE_REGISTRY.signUp.formHeading).toBe("Create account");
    expect(AUTH_ROUTE_REGISTRY.forgotPassword.formHeading).toBe(
      "Recover access"
    );
    expect(AUTH_ROUTE_REGISTRY.resetPassword.formHeading).toBe(
      "Choose a new password"
    );
    expect(AUTH_ROUTE_REGISTRY.verifyEmail.formHeading).toBe(
      "Verify your email"
    );
    expect(AUTH_ROUTE_REGISTRY.workspaceSelect.formHeading).toBe(
      "Choose workspace"
    );
  });

  it("defines lane-aware form eyebrows for entry routes", () => {
    expect(AUTH_ROUTE_REGISTRY.signIn.formEyebrow).toBe(
      `Access Lane · ${AUTH_PATHS.signIn}`
    );
    expect(AUTH_ROUTE_REGISTRY.forgotPassword.formEyebrow).toBe(
      `Recovery Lane · ${AUTH_PATHS.forgotPassword}`
    );
    expect(AUTH_ROUTE_REGISTRY.accessDenied.formEyebrow).toBe(
      `Security Lane · ${AUTH_PATHS.accessDenied}`
    );
  });

  it("resolves route copy for entry routes", () => {
    expect(resolveAuthEntryRouteCopy("signIn")).toEqual({
      formEyebrow: AUTH_ROUTE_REGISTRY.signIn.formEyebrow,
      formHeading: AUTH_ROUTE_REGISTRY.signIn.formHeading,
      formDescription: AUTH_ROUTE_REGISTRY.signIn.formDescription,
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
