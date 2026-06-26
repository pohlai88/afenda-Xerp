import { describe, expect, it } from "vitest";
import {
  AUTH_V2_SEGMENT_PATHS,
  buildAuthV2Path,
} from "@/lib/auth-v2/auth-v2-path.registry";
import {
  AUTH_V2_ROUTE_REGISTRY,
  type AuthV2RouteId,
} from "@/lib/auth-v2/auth-v2-route.registry";

describe("auth-v2-path.registry", () => {
  it("registers every route registry path in segment paths", () => {
    const registryPaths = new Set(
      (Object.keys(AUTH_V2_ROUTE_REGISTRY) as AuthV2RouteId[]).map((route) => {
        switch (route) {
          case "signIn":
            return buildAuthV2Path("signIn");
          case "signUp":
            return buildAuthV2Path("signUp");
          case "otp":
            return buildAuthV2Path("otp");
          case "mfa":
            return buildAuthV2Path("mfa");
          case "mfaRecovery":
            return buildAuthV2Path("mfaRecovery");
          case "verifyEmail":
            return buildAuthV2Path("verifyEmail.root");
          case "verifyEmailSent":
            return buildAuthV2Path("verifyEmail.sent");
          case "verifyEmailExpired":
            return buildAuthV2Path("verifyEmail.expired");
          case "verifyEmailSuccess":
            return buildAuthV2Path("verifyEmail.success");
          case "forgotPassword":
            return buildAuthV2Path("forgotPassword");
          case "resetPassword":
            return buildAuthV2Path("resetPassword.root");
          case "resetPasswordSuccess":
            return buildAuthV2Path("resetPassword.success");
          case "sessionExpired":
            return buildAuthV2Path("sessionExpired");
          case "accessDenied":
            return buildAuthV2Path("accessDenied");
          case "securityReview":
            return buildAuthV2Path("securityReview");
          case "invite":
            return buildAuthV2Path("invite.root");
          case "inviteExpired":
            return buildAuthV2Path("invite.expired");
          case "workspaceSelect":
            return buildAuthV2Path("workspaceSelect");
          case "organizationSelect":
            return buildAuthV2Path("organizationSelect");
          default: {
            const _exhaustive: never = route;
            return _exhaustive;
          }
        }
      })
    );

    for (const path of registryPaths) {
      expect(AUTH_V2_SEGMENT_PATHS).toContain(path);
    }
  });

  it("builds safe query strings", () => {
    expect(buildAuthV2Path("signIn", { next: "/dashboard" })).toBe(
      "/v2/sign-in?next=%2Fdashboard"
    );
  });
});
