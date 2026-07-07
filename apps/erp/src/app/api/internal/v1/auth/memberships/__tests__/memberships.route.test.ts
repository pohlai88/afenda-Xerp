import { normalizeAfendaAuthSession } from "@afenda/auth";
import { createTestEnterpriseId } from "@afenda/kernel";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/internal/v1/auth/memberships/route";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { loadPostLoginMembershipTargets } from "@/lib/auth/load-post-login-membership-targets.server";
import { DEFAULT_SAFE_INTERNAL_PATH } from "@/lib/auth/resolve-safe-internal-path";

const ACTOR_USER_ID = createTestEnterpriseId(
  "user",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const TENANT_SLUG = "acme-tenant";

function createLinkedSession() {
  return normalizeAfendaAuthSession(
    {
      session: {
        id: "sess_memberships_test",
        createdAt: new Date("2026-06-20T00:00:00.000Z"),
        expiresAt: new Date("2026-06-27T00:00:00.000Z"),
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: "auth_user_memberships_test",
        email: "user@example.com",
        name: "Test User",
        emailVerified: true,
        image: null,
      },
    },
    ACTOR_USER_ID
  );
}

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/server/api/runtime/api-rate-limit", () => ({
  assertRateLimitAllowed: vi.fn(async () => null),
  consumeRateLimitForRequest: vi.fn(async () => ({
    allowed: true,
    limit: 120,
    policy: "authenticated-standard",
    remaining: 119,
    resetAtUnix: Math.floor(Date.now() / 1000) + 60,
    retryAfterSeconds: null,
  })),
}));

vi.mock("@/server/api/runtime/api-handler-audit", () => ({
  emitApiAuditEvidence: vi.fn(async () => undefined),
  emitApiDeniedAuditEvidence: vi.fn(async () => undefined),
}));

vi.mock("@/server/api/runtime/api-handler-logging", () => ({
  createApiHandlerLogger: vi.fn(() => ({
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  })),
  logApiRequest: vi.fn(),
}));

vi.mock("@/lib/context/create-server-execution-context.server", () => ({
  createServerExecutionContext: vi.fn(
    (input: { readonly correlationId: string }) => ({
      actorId: ACTOR_USER_ID,
      correlationId: input.correlationId,
      executionId: "01TESTEXECUTIONCONTEXTID00000001",
      source: "api" as const,
      tenantId: "00000000-0000-0000-0000-000000000001",
    })
  ),
}));

vi.mock("@/server/api/runtime/idempotency", () => ({
  readCachedIdempotentResponse: vi.fn(async () => null),
  recordIdempotentResponse: vi.fn(async () => undefined),
  resolveRequestIdempotencyKey: vi.fn(() => null),
}));

vi.mock("@/lib/spine/run-protected-mutation", () => ({
  runProtectedMutation: vi.fn(
    async (input: {
      readonly execute: (scope: unknown) => Promise<unknown>;
    }) => ({
      result: await input.execute({}),
    })
  ),
}));

vi.mock("@/lib/auth/resolve-api-route-auth-actor.server", () => ({
  resolveApiRouteAuthActor: vi.fn(),
}));

vi.mock("@/lib/auth/resolve-post-auth-tenant-slug.server", () => ({
  resolvePostAuthTenantSlugFromRequest: vi.fn(),
}));

vi.mock("@/lib/auth/load-post-login-membership-targets.server", () => ({
  loadPostLoginMembershipTargets: vi.fn(),
}));

import { resolveApiRouteAuthActor } from "@/lib/auth/resolve-api-route-auth-actor.server";
import { resolvePostAuthTenantSlugFromRequest } from "@/lib/auth/resolve-post-auth-tenant-slug.server";

function buildMembershipsRequest(): Request {
  return new Request("http://localhost/api/internal/v1/auth/memberships", {
    headers: {
      "x-correlation-id": "cor_01ARZ3NDEKTSV4RRFFQ69G5FAV",
    },
    method: "GET",
  });
}

describe("GET /api/internal/v1/auth/memberships", () => {
  beforeEach(() => {
    vi.mocked(resolveApiRouteAuthActor).mockResolvedValue({
      kind: "human",
      session: createLinkedSession(),
    });
    vi.mocked(resolvePostAuthTenantSlugFromRequest).mockResolvedValue(
      TENANT_SLUG
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns membership resolution for a linked session", async () => {
    vi.mocked(loadPostLoginMembershipTargets).mockResolvedValueOnce({
      activeMembershipCount: 2,
      allowedOptions: {
        targets: [
          {
            companySlug: "acme",
            isSelected: false,
            label: "Acme Corp",
          },
          {
            companySlug: "beta",
            isSelected: false,
            label: "Beta Corp",
          },
        ],
      },
      memberships: [],
      tenant: {
        id: "tenant-001",
        slug: TENANT_SLUG,
        displayName: "Acme Tenant",
        status: "active",
      },
    });

    const response = await GET(buildMembershipsRequest());

    expect(response.status).toBe(200);
    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: true,
      data: {
        activeMembershipCount: 2,
        entryPath: AUTH_PATHS.workspaceSelect,
        requiresOrganizationSelect: false,
        requiresWorkspaceSelect: true,
        targets: [
          { companySlug: "acme", label: "Acme Corp" },
          { companySlug: "beta", label: "Beta Corp" },
        ],
        workspaceTargetCount: 2,
      },
    });
    expect(loadPostLoginMembershipTargets).toHaveBeenCalledWith({
      actorUserId: ACTOR_USER_ID,
      tenantSlug: TENANT_SLUG,
    });
  });

  it("returns 401 when session is missing", async () => {
    vi.mocked(resolveApiRouteAuthActor).mockResolvedValueOnce(null);

    const response = await GET(buildMembershipsRequest());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
    expect(loadPostLoginMembershipTargets).not.toHaveBeenCalled();
  });

  it("returns 403 when tenant context is unavailable", async () => {
    vi.mocked(resolvePostAuthTenantSlugFromRequest).mockResolvedValueOnce(null);

    const response = await GET(buildMembershipsRequest());

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
    expect(loadPostLoginMembershipTargets).not.toHaveBeenCalled();
  });

  it("returns empty targets when tenant lookup fails", async () => {
    vi.mocked(loadPostLoginMembershipTargets).mockResolvedValueOnce({
      activeMembershipCount: 0,
      allowedOptions: { targets: [] },
      memberships: [],
      tenant: null,
    });

    const response = await GET(buildMembershipsRequest());

    expect(response.status).toBe(200);
    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: true,
      data: {
        activeMembershipCount: 0,
        entryPath: AUTH_PATHS.accessDenied,
        requiresOrganizationSelect: false,
        requiresWorkspaceSelect: false,
        targets: [],
        workspaceTargetCount: 0,
      },
    });
  });

  it("returns direct entry when a single target is available", async () => {
    vi.mocked(loadPostLoginMembershipTargets).mockResolvedValueOnce({
      activeMembershipCount: 1,
      allowedOptions: {
        targets: [
          {
            companySlug: "acme",
            isSelected: false,
            label: "Acme Corp",
          },
        ],
      },
      memberships: [],
      tenant: {
        id: "tenant-001",
        slug: TENANT_SLUG,
        displayName: "Acme Tenant",
        status: "active",
      },
    });

    const response = await GET(buildMembershipsRequest());

    expect(response.status).toBe(200);
    const body: unknown = await response.json();
    expect(body).toMatchObject({
      ok: true,
      data: {
        entryPath: DEFAULT_SAFE_INTERNAL_PATH,
        requiresOrganizationSelect: false,
        requiresWorkspaceSelect: false,
        workspaceTargetCount: 1,
      },
    });
  });
});
