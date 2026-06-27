import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAfendaAuthSessionMock, resolveOperatingContextFromHeadersMock } =
  vi.hoisted(() => ({
    getAfendaAuthSessionMock: vi.fn(),
    resolveOperatingContextFromHeadersMock: vi.fn(),
  }));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    getAfendaAuthSession: getAfendaAuthSessionMock,
  };
});

vi.mock("@/lib/context/resolve-operating-context-from-headers.server", () => ({
  resolveOperatingContextFromHeaders: resolveOperatingContextFromHeadersMock,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

import { testLegalEntityCurrencyFields } from "@/lib/context/__tests__/legal-entity-test-fixtures";
import { resolveUserSettingsOperatingContext } from "../resolve-user-settings-context.server";

const linkedSession = {
  sessionId: "sess-user-settings",
  user: {
    authUserId: "auth-user-001",
    userId: "user-001",
    email: "user@example.com",
    name: "Test User",
    emailVerified: true,
    linkStatus: "linked" as const,
  },
  metadata: {
    image: null,
    issuedAt: "2026-06-20T00:00:00.000Z",
    expiresAt: "2026-06-27T00:00:00.000Z",
    ipAddress: null,
    userAgent: null,
    activeWorkspaceId: null,
  },
};

const operatingContext = {
  actor: { userId: "user-001" },
  correlationId: "corr-user-settings",
  tenant: {
    tenantId: "tenant-001",
    slug: "dev-local",
    displayName: "Dev Local",
    status: "active" as const,
  },
  entityGroup: null,
  legalEntity: {
    companyId: "company-001",
    tenantId: "tenant-001",
    entityGroupId: null,
    slug: "dev-company",
    legalName: "Dev Company",
    displayName: "Dev Company",
    registrationNumber: null,
    taxRegistrationNumber: null,
    ...testLegalEntityCurrencyFields(),
    status: "active" as const,
  },
  organizationUnit: null,
  ownershipInterests: [],
  permissionScope: {
    grantScopeType: "company" as const,
    tenantId: "tenant-001",
    entityGroupId: null,
    companyId: "company-001",
    organizationId: null,
    teamId: null,
    projectId: null,
    membershipId: "membership-001",
    roleId: "role-001",
    elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  },
  workspace: {
    tenantId: "tenant-001",
    companyId: "company-001",
    organizationId: null,
    projectId: null,
  },
  team: null,
  project: null,
  consolidationScope: null,
  surface: null,
  workflow: null,
};

describe("resolveUserSettingsOperatingContext", () => {
  beforeEach(() => {
    getAfendaAuthSessionMock.mockReset();
    resolveOperatingContextFromHeadersMock.mockReset();
  });

  it("redirects unauthenticated users to sign-in", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce(null);

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({
      kind: "redirect",
      href: "/sign-in",
    });
  });

  it("redirects unlinked sessions to sign-in error", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce({
      ...linkedSession,
      user: { ...linkedSession.user, linkStatus: "unlinked" as const },
    });

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({
      kind: "redirect",
      href: "/sign-in?error=unlinked",
    });
  });

  it("returns forbidden when operating context cannot be verified", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce(linkedSession);
    resolveOperatingContextFromHeadersMock.mockResolvedValueOnce({
      ok: false,
      error: { code: "MEMBERSHIP_DENIED", userMessage: "Denied" },
    });

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({ kind: "forbidden" });
  });

  it("returns actor and operating context for linked sessions", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce(linkedSession);
    resolveOperatingContextFromHeadersMock.mockResolvedValueOnce({
      ok: true,
      value: operatingContext,
    });

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({
      kind: "ready",
      actorUserId: "user-001",
      operatingContext,
    });
    expect(resolveOperatingContextFromHeadersMock).toHaveBeenCalledWith({
      actorUserId: "user-001",
      activeWorkspaceId: null,
    });
  });
});
