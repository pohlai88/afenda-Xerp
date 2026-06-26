import { MfaPolicyBypassBlockedError } from "@afenda/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  assertTenantMfaPolicySatisfied: vi.fn(),
  isMfaPolicyBypassBlockedError: vi.fn(
    (error: unknown): error is MfaPolicyBypassBlockedError =>
      error instanceof MfaPolicyBypassBlockedError
  ),
}));

const navigationMocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();

  return {
    ...actual,
    assertTenantMfaPolicySatisfied: authMocks.assertTenantMfaPolicySatisfied,
    isMfaPolicyBypassBlockedError: authMocks.isMfaPolicyBypassBlockedError,
  };
});
vi.mock("next/navigation", () => navigationMocks);

describe("gateTenantMfaPolicyBeforeProtectedAccess", () => {
  beforeEach(() => {
    authMocks.assertTenantMfaPolicySatisfied.mockReset();
    navigationMocks.redirect.mockClear();
  });

  it("allows access on the MFA enrollment route", async () => {
    const { gateTenantMfaPolicyBeforeProtectedAccess } = await import(
      "../gate-tenant-mfa-policy.server"
    );

    await gateTenantMfaPolicyBeforeProtectedAccess({
      activeRoutePath: "/settings/security",
      companyId: "company_1",
      session: {
        metadata: { activeWorkspaceId: null },
        sessionId: "sess_1",
        user: {
          authUserId: "auth_user_1",
          email: "user@example.com",
          emailVerified: true,
          linkStatus: "linked",
          name: "User",
          userId: "user_1",
        },
      },
      tenantId: "tenant_1",
    });

    expect(authMocks.assertTenantMfaPolicySatisfied).not.toHaveBeenCalled();
  });

  it("redirects non-compliant users to MFA enrollment", async () => {
    authMocks.assertTenantMfaPolicySatisfied.mockRejectedValue(
      new MfaPolicyBypassBlockedError("tenant_1")
    );

    const { gateTenantMfaPolicyBeforeProtectedAccess } = await import(
      "../gate-tenant-mfa-policy.server"
    );

    await expect(
      gateTenantMfaPolicyBeforeProtectedAccess({
        activeRoutePath: "/dashboard",
        companyId: "company_1",
        session: {
          metadata: { activeWorkspaceId: null },
          sessionId: "sess_1",
          user: {
            authUserId: "auth_user_1",
            email: "user@example.com",
            emailVerified: true,
            linkStatus: "linked",
            name: "User",
            userId: "user_1",
          },
        },
        tenantId: "tenant_1",
      })
    ).rejects.toThrow(
      "REDIRECT:/settings/security?notice=mfa-required&next=%2Fdashboard"
    );
  });
});
