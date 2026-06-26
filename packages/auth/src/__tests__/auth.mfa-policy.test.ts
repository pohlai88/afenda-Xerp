import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_EVENT } from "../auth.contract.js";
import {
  assertTenantMfaPolicySatisfied,
  getEffectiveMfaPolicy,
  getTenantMfaPolicy,
  isAuthUserMfaEnabled,
  MfaPolicyBypassBlockedError,
  parseCompanyIdFromActiveWorkspaceId,
  updateTenantMfaPolicy,
} from "../auth.mfa-policy.js";

const persistAuthAuditEvent = vi.fn().mockResolvedValue(undefined);

const mockPlatformDb = {
  select: vi.fn(),
  update: vi.fn(),
};

const mockAuthDb = {
  select: vi.fn(),
};

vi.mock("../auth.audit.js", () => ({
  persistAuthAuditEvent: (...args: unknown[]) => persistAuthAuditEvent(...args),
}));

vi.mock("@afenda/database", () => ({
  authUser: {
    id: "id",
    twoFactorEnabled: "twoFactorEnabled",
  },
  getAuthDb: () => mockAuthDb,
  getDb: () => mockPlatformDb,
  tenants: {
    id: "id",
    mfaRequired: "mfaRequired",
    updatedAt: "updatedAt",
  },
  companies: {
    id: "id",
    mfaRequiredOverride: "mfaRequiredOverride",
  },
}));

function chainSelect(
  db: { select: ReturnType<typeof vi.fn> },
  rows: unknown[]
): void {
  const limit = vi.fn().mockResolvedValue(rows);
  const where = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ where });
  db.select.mockReturnValueOnce({ from });
}

describe("auth.mfa-policy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlatformDb.update.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ mfaRequired: true }]),
        }),
      }),
    });
  });

  it("returns tenant MFA policy when tenant exists", async () => {
    chainSelect(mockPlatformDb, [{ mfaRequired: true }]);

    await expect(
      getTenantMfaPolicy("tenant_1", mockPlatformDb as never)
    ).resolves.toEqual({ mfaRequired: true });
  });

  it("returns null when tenant is missing", async () => {
    chainSelect(mockPlatformDb, []);

    await expect(
      getTenantMfaPolicy("tenant_missing", mockPlatformDb as never)
    ).resolves.toBeNull();
  });

  it("reads Better Auth two_factor_enabled flag", async () => {
    chainSelect(mockAuthDb, [{ twoFactorEnabled: true }]);

    await expect(
      isAuthUserMfaEnabled("auth_1", mockAuthDb as never)
    ).resolves.toBe(true);
  });

  it("allows access when tenant MFA is not required", async () => {
    chainSelect(mockPlatformDb, [{ mfaRequired: false }]);

    await expect(
      assertTenantMfaPolicySatisfied(
        { authUserId: "auth_1", tenantId: "tenant_1" },
        { authDb: mockAuthDb as never, platformDb: mockPlatformDb as never }
      )
    ).resolves.toBeUndefined();
  });

  it("blocks access and audits when MFA is required but not enabled", async () => {
    chainSelect(mockPlatformDb, [{ mfaRequired: true }]);
    chainSelect(mockAuthDb, [{ twoFactorEnabled: false }]);

    await expect(
      assertTenantMfaPolicySatisfied(
        { authUserId: "auth_1", tenantId: "tenant_1" },
        { authDb: mockAuthDb as never, platformDb: mockPlatformDb as never }
      )
    ).rejects.toBeInstanceOf(MfaPolicyBypassBlockedError);

    expect(persistAuthAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: AUTH_EVENT.mfaBypassBlocked,
        result: "failure",
      })
    );
  });

  it("persists tenant MFA policy updates with audit event", async () => {
    await expect(
      updateTenantMfaPolicy(
        {
          authUserId: "auth_admin",
          mfaRequired: true,
          tenantId: "tenant_1",
        },
        mockPlatformDb as never
      )
    ).resolves.toEqual({ mfaRequired: true });

    expect(persistAuthAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: AUTH_EVENT.mfaPolicyUpdated,
        result: "success",
      })
    );
  });

  it("parses company id from active workspace id", () => {
    expect(
      parseCompanyIdFromActiveWorkspaceId("tenant:company_1:workspace_1")
    ).toBe("company_1");
    expect(parseCompanyIdFromActiveWorkspaceId("invalid")).toBeUndefined();
    expect(parseCompanyIdFromActiveWorkspaceId(null)).toBeUndefined();
  });

  it("prefers company MFA override over tenant default", async () => {
    chainSelect(mockPlatformDb, [{ mfaRequiredOverride: false }]);

    await expect(
      getEffectiveMfaPolicy(
        { companyId: "company_1", tenantId: "tenant_1" },
        mockPlatformDb as never
      )
    ).resolves.toEqual({ mfaRequired: false });
  });

  it("falls back to tenant MFA when company override is null", async () => {
    chainSelect(mockPlatformDb, [{ mfaRequiredOverride: null }]);
    chainSelect(mockPlatformDb, [{ mfaRequired: true }]);

    await expect(
      getEffectiveMfaPolicy(
        { companyId: "company_1", tenantId: "tenant_1" },
        mockPlatformDb as never
      )
    ).resolves.toEqual({ mfaRequired: true });
  });

  it("uses company override path in assertTenantMfaPolicySatisfied", async () => {
    chainSelect(mockPlatformDb, [{ mfaRequiredOverride: true }]);
    chainSelect(mockAuthDb, [{ twoFactorEnabled: true }]);

    await expect(
      assertTenantMfaPolicySatisfied(
        {
          authUserId: "auth_1",
          companyId: "company_1",
          tenantId: "tenant_1",
        },
        { authDb: mockAuthDb as never, platformDb: mockPlatformDb as never }
      )
    ).resolves.toBeUndefined();
  });
});
