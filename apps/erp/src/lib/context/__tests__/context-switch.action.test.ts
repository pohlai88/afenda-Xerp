import {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  type OperatingContext,
} from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  resolveActionOperatingContextMock,
  persistWorkspaceSelectionCookiesMock,
} = vi.hoisted(() => ({
  resolveActionOperatingContextMock: vi.fn(),
  persistWorkspaceSelectionCookiesMock: vi.fn(),
}));

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: resolveActionOperatingContextMock,
}));

vi.mock("@/lib/context/workspace-selection-cookies.server", () => ({
  persistWorkspaceSelectionCookies: persistWorkspaceSelectionCookiesMock,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/server-actions/log-action-error", () => ({
  logServerActionError: vi.fn(async () => undefined),
}));

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: vi.fn(async () => undefined),
}));

import { switchOperatingContextAction } from "../context-switch.action";

const sampleSession = {
  sessionId: "sess-switch-test",
  user: {
    userId: "user-001",
    email: "user@example.com",
    name: "Test User",
    emailVerified: true,
  },
  metadata: {
    image: null,
    issuedAt: "2026-06-20T00:00:00.000Z",
    expiresAt: "2026-06-27T00:00:00.000Z",
    ipAddress: null,
    userAgent: null,
  },
} as const;

const TENANT_ID = "tenant-001";
const COMPANY_ID = "company-001";

function createMockOperatingContext(
  overrides: Partial<OperatingContext> = {}
): OperatingContext {
  return {
    actor: { userId: "user-001" },
    correlationId: "corr-switch-test",
    tenant: {
      tenantId: TENANT_ID,
      slug: "dev-local",
      displayName: "Dev Local",
      status: "active",
    },
    entityGroup: null,
    legalEntity: {
      companyId: COMPANY_ID,
      tenantId: TENANT_ID,
      entityGroupId: null,
      slug: "dev-company",
      legalName: "Dev Company",
      displayName: "Dev Company",
      registrationNumber: null,
      taxRegistrationNumber: null,
      countryCode: "AU",
      baseCurrency: "AUD",
      reportingCurrency: null,
      companyType: "standalone",
      fiscalCalendarId: null,
      effectiveFrom: null,
      effectiveTo: null,
      status: "active",
    },
    ownershipInterests: [],
    organizationUnit: null,
    team: null,
    project: null,
    workspace: {
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationId: null,
      projectId: null,
    },
    permissionScope: {
      grantScopeType: "company",
      tenantId: TENANT_ID,
      entityGroupId: null,
      companyId: COMPANY_ID,
      organizationId: null,
      teamId: null,
      projectId: null,
      membershipId: "membership-001",
      roleId: "role-001",
      elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
    },
    consolidationScope: null,
    surface: null,
    workflow: null,
    ...overrides,
  };
}

describe("switchOperatingContextAction", () => {
  beforeEach(() => {
    resolveActionOperatingContextMock.mockReset();
    persistWorkspaceSelectionCookiesMock.mockReset();
    persistWorkspaceSelectionCookiesMock.mockResolvedValue(undefined);
  });

  it("rejects client-provided legalEntityId before operating context resolution", async () => {
    const result = await switchOperatingContextAction({
      companySlug: "dev-company",
      legalEntityId: "spoofed-company-id",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("VALIDATION_ERROR");
    }
    expect(resolveActionOperatingContextMock).not.toHaveBeenCalled();
    expect(persistWorkspaceSelectionCookiesMock).not.toHaveBeenCalled();
  });

  it("validates context switch server-side via resolveActionOperatingContext", async () => {
    resolveActionOperatingContextMock.mockResolvedValue({
      ok: false,
      error: {
        code: "MEMBERSHIP_DENIED",
        message: "Membership denied",
      },
    });

    const result = await switchOperatingContextAction({
      companySlug: "other-company",
    });

    expect(result.ok).toBe(false);
    expect(resolveActionOperatingContextMock).toHaveBeenCalledWith({
      selection: {
        companySlug: "other-company",
        organizationSlug: null,
      },
    });
    expect(persistWorkspaceSelectionCookiesMock).not.toHaveBeenCalled();
  });

  it("persists slug hints only after successful server-side resolution", async () => {
    resolveActionOperatingContextMock.mockResolvedValue({
      ok: true,
      session: sampleSession,
      operatingContext: createMockOperatingContext(),
    });

    const result = await switchOperatingContextAction({
      companySlug: "dev-company",
    });

    expect(result.ok).toBe(true);
    expect(persistWorkspaceSelectionCookiesMock).toHaveBeenCalledWith({
      companySlug: "dev-company",
      organizationSlug: null,
    });
    if (result.ok) {
      expect(result.data.operatingContext.legalEntityLabel).toBe("Dev Company");
      expect(result.data.workspace.companyId).toBe("company-001");
    }
  });
});
