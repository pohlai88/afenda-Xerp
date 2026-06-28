import {
  createTestEnterpriseId,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  type OperatingContext,
  parseUnknownPermissionScopeContext,
} from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  resolveActionOperatingContextMock,
  persistWorkspaceSelectionCookiesMock,
  persistAuthSessionActiveWorkspaceIdMock,
  recordActionAuditMock,
} = vi.hoisted(() => ({
  resolveActionOperatingContextMock: vi.fn(),
  persistWorkspaceSelectionCookiesMock: vi.fn(),
  persistAuthSessionActiveWorkspaceIdMock: vi.fn(),
  recordActionAuditMock: vi.fn(async () => undefined),
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    persistAuthSessionActiveWorkspaceId:
      persistAuthSessionActiveWorkspaceIdMock,
  };
});

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
  recordActionAudit: recordActionAuditMock,
}));

import {
  testLegalEntityCurrencyFields,
  testStandaloneLegalEntityProfileFields,
} from "@/lib/context/__tests__/legal-entity-test-fixtures";
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
    activeWorkspaceId: null,
  },
} as const;

const TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5T02"
);
const COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5C02"
);
const MEMBERSHIP_ID = createTestEnterpriseId(
  "membership",
  "01ARZ3NDEKTSV4RRFFQ69G5M02"
);
const ROLE_ID = createTestEnterpriseId("role", "01ARZ3NDEKTSV4RRFFQ69G5R02");
const ACTOR_ID = createTestEnterpriseId("user", "01ARZ3NDEKTSV4RRFFQ69G5FAV");

function createMockOperatingContext(
  overrides: Partial<OperatingContext> = {}
): OperatingContext {
  return {
    actor: { userId: ACTOR_ID },
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
      ...testLegalEntityCurrencyFields(),
      ...testStandaloneLegalEntityProfileFields(),
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
    permissionScope: parseUnknownPermissionScopeContext({
      grantScopeType: "company",
      tenantId: TENANT_ID,
      entityGroupId: null,
      companyId: COMPANY_ID,
      organizationId: null,
      teamId: null,
      projectId: null,
      membershipId: MEMBERSHIP_ID,
      roleId: ROLE_ID,
      elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
    }),
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
    persistAuthSessionActiveWorkspaceIdMock.mockReset();
    recordActionAuditMock.mockReset();
    persistWorkspaceSelectionCookiesMock.mockResolvedValue(undefined);
    persistAuthSessionActiveWorkspaceIdMock.mockResolvedValue(undefined);
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
    expect(persistAuthSessionActiveWorkspaceIdMock).toHaveBeenCalledWith({
      sessionId: "sess-switch-test",
      activeWorkspaceId: `${TENANT_ID}:${COMPANY_ID}:root`,
    });
    if (result.ok) {
      expect(result.data.operatingContext.legalEntityLabel).toBe("Dev Company");
      expect(result.data.workspace.companyId).toBe(`${COMPANY_ID}`);
    }
  });

  it("records audit actor from resolved operating context, not session payload", async () => {
    resolveActionOperatingContextMock.mockResolvedValue({
      ok: true,
      session: {
        ...sampleSession,
        user: {
          ...sampleSession.user,
          userId: "session-user-drift",
        },
      },
      operatingContext: createMockOperatingContext({
        actor: { userId: ACTOR_ID },
      }),
    });

    await switchOperatingContextAction({
      companySlug: "dev-company",
    });

    expect(recordActionAuditMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "auth.workspace.context_switched",
        actorUserId: `${ACTOR_ID}`,
      })
    );
  });
});
