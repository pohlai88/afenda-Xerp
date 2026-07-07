import type { MembershipContract } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";

import { AUTH_PATHS, buildAuthPath } from "@/lib/auth/auth-path.registry";
import { DEFAULT_SAFE_INTERNAL_PATH } from "@/lib/auth/resolve-safe-internal-path";
import {
  computePostLoginMembershipValidation,
  validatePostLoginMembership,
} from "@/lib/auth/validate-post-login-membership.server";

const ACTOR_USER_ID = "user-001";
const TENANT_ID = "tenant-001";
const TENANT_SLUG = "acme-tenant";

const activeMembership: MembershipContract = {
  id: "membership-001",
  tenantId: TENANT_ID,
  companyId: "company-a",
  entityGroupId: null,
  organizationId: null,
  projectId: null,
  teamId: null,
  userId: ACTOR_USER_ID,
  roleId: "role-001",
  scopeType: "company",
  status: "active",
};

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    findTenantBySlug: vi.fn(),
  };
});

vi.mock("@/lib/context/load-actor-memberships.server", () => ({
  loadActorMemberships: vi.fn(),
}));

vi.mock("@/lib/context/resolve-allowed-context-options.server", () => ({
  resolveAllowedContextOptions: vi.fn(),
}));

import { findTenantBySlug } from "@afenda/database";
import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";

describe("validatePostLoginMembership", () => {
  it("routes unknown tenants to access denied", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(null);

    await expect(
      validatePostLoginMembership({
        actorUserId: ACTOR_USER_ID,
        tenantSlug: TENANT_SLUG,
      })
    ).resolves.toEqual({
      activeMembershipCount: 0,
      entryPath: AUTH_PATHS.accessDenied,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 0,
    });
  });

  it("routes unlinked memberships to access denied with reason", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce({
      id: TENANT_ID,
      slug: TENANT_SLUG,
      displayName: "Acme Tenant",
      status: "active",
    });
    vi.mocked(loadActorMemberships).mockResolvedValueOnce([
      { ...activeMembership, status: "inactive" },
    ]);

    await expect(
      validatePostLoginMembership({
        actorUserId: ACTOR_USER_ID,
        tenantSlug: TENANT_SLUG,
      })
    ).resolves.toEqual({
      activeMembershipCount: 0,
      entryPath: buildAuthPath("accessDenied", { reason: "unlinked" }),
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 0,
    });
  });

  it("continues directly when only one workspace target is available", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce({
      id: TENANT_ID,
      slug: TENANT_SLUG,
      displayName: "Acme Tenant",
      status: "active",
    });
    vi.mocked(loadActorMemberships).mockResolvedValueOnce([activeMembership]);
    vi.mocked(resolveAllowedContextOptions).mockResolvedValueOnce({
      targets: [
        {
          companySlug: "acme",
          isSelected: false,
          label: "Acme Corp",
        },
      ],
    });

    await expect(
      validatePostLoginMembership({
        actorUserId: ACTOR_USER_ID,
        tenantSlug: TENANT_SLUG,
      })
    ).resolves.toEqual({
      activeMembershipCount: 1,
      entryPath: DEFAULT_SAFE_INTERNAL_PATH,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 1,
    });
  });

  it("routes single-company multi-organization memberships to organization select", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce({
      id: TENANT_ID,
      slug: TENANT_SLUG,
      displayName: "Acme Tenant",
      status: "active",
    });
    vi.mocked(loadActorMemberships).mockResolvedValueOnce([activeMembership]);
    vi.mocked(resolveAllowedContextOptions).mockResolvedValueOnce({
      targets: [
        {
          companySlug: "acme",
          isSelected: false,
          label: "Acme — Finance",
          organizationSlug: "finance",
        },
        {
          companySlug: "acme",
          isSelected: false,
          label: "Acme — Ops",
          organizationSlug: "ops",
        },
      ],
    });

    await expect(
      validatePostLoginMembership({
        actorUserId: ACTOR_USER_ID,
        tenantSlug: TENANT_SLUG,
      })
    ).resolves.toEqual({
      activeMembershipCount: 1,
      entryPath: AUTH_PATHS.organizationSelect,
      requiresOrganizationSelect: true,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 2,
    });
  });

  it("routes multi-company memberships to workspace select", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce({
      id: TENANT_ID,
      slug: TENANT_SLUG,
      displayName: "Acme Tenant",
      status: "active",
    });
    vi.mocked(loadActorMemberships).mockResolvedValueOnce([
      activeMembership,
      {
        ...activeMembership,
        id: "membership-002",
        companyId: "company-b",
      },
    ]);
    vi.mocked(resolveAllowedContextOptions).mockResolvedValueOnce({
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
    });

    await expect(
      validatePostLoginMembership({
        actorUserId: ACTOR_USER_ID,
        tenantSlug: TENANT_SLUG,
      })
    ).resolves.toEqual({
      activeMembershipCount: 2,
      entryPath: AUTH_PATHS.workspaceSelect,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: true,
      workspaceTargetCount: 2,
    });
  });
});

describe("computePostLoginMembershipValidation", () => {
  it("continues directly when memberships exist but context targets are empty", () => {
    expect(
      computePostLoginMembershipValidation({
        activeMembershipCount: 1,
        allowedOptions: { targets: [] },
        memberships: [activeMembership],
        tenant: {
          id: TENANT_ID,
          slug: TENANT_SLUG,
          displayName: "Acme Tenant",
          status: "active",
        },
      })
    ).toEqual({
      activeMembershipCount: 1,
      entryPath: DEFAULT_SAFE_INTERNAL_PATH,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 0,
    });
  });
});
