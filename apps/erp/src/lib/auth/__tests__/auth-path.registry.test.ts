import { describe, expect, it } from "vitest";
import {
  AUTH_SEGMENT_PATHS,
  buildAuthPath,
} from "@/lib/auth/auth-path.registry";
import {
  AUTH_ROUTE_REGISTRY,
  type AuthRouteId,
} from "@/lib/auth/auth-route.registry";

describe("auth-path.registry", () => {
  it("registers every route registry path in segment paths", () => {
    const registryPaths = new Set(
      (Object.keys(AUTH_ROUTE_REGISTRY) as AuthRouteId[]).map((route) => {
        switch (route) {
          case "signIn":
            return buildAuthPath("signIn");
          case "signUp":
            return buildAuthPath("signUp");
          case "otp":
            return buildAuthPath("otp");
          case "mfa":
            return buildAuthPath("mfa");
          case "mfaRecovery":
            return buildAuthPath("mfaRecovery");
          case "verifyEmail":
            return buildAuthPath("verifyEmail.root");
          case "verifyEmailSent":
            return buildAuthPath("verifyEmail.sent");
          case "verifyEmailExpired":
            return buildAuthPath("verifyEmail.expired");
          case "verifyEmailSuccess":
            return buildAuthPath("verifyEmail.success");
          case "forgotPassword":
            return buildAuthPath("forgotPassword");
          case "resetPassword":
            return buildAuthPath("resetPassword.root");
          case "resetPasswordSuccess":
            return buildAuthPath("resetPassword.success");
          case "sessionExpired":
            return buildAuthPath("sessionExpired");
          case "accessDenied":
            return buildAuthPath("accessDenied");
          case "securityReview":
            return buildAuthPath("securityReview");
          case "invite":
            return buildAuthPath("invite.root");
          case "inviteExpired":
            return buildAuthPath("invite.expired");
          case "workspaceSelect":
            return buildAuthPath("workspaceSelect");
          case "organizationSelect":
            return buildAuthPath("organizationSelect");
          default: {
            const _exhaustive: never = route;
            return _exhaustive;
          }
        }
      })
    );

    for (const path of registryPaths) {
      expect(AUTH_SEGMENT_PATHS).toContain(path);
    }
  });

  it("builds safe query strings", () => {
    expect(buildAuthPath("signIn", { next: "/dashboard" })).toBe(
      "/sign-in?next=%2Fdashboard"
    );
  });
});
