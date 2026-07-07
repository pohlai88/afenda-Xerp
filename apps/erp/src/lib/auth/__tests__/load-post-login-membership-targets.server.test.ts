import { findTenantBySlug } from "@afenda/database";
import type { MembershipContract } from "@afenda/permissions";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadPostLoginMembershipTargets } from "@/lib/auth/load-post-login-membership-targets.server";
import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";

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

describe("loadPostLoginMembershipTargets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads membership targets once for API dedupe", async () => {
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
      loadPostLoginMembershipTargets({
        actorUserId: ACTOR_USER_ID,
        tenantSlug: TENANT_SLUG,
      })
    ).resolves.toMatchObject({
      activeMembershipCount: 1,
      tenant: { id: TENANT_ID },
    });

    expect(findTenantBySlug).toHaveBeenCalledTimes(1);
    expect(loadActorMemberships).toHaveBeenCalledTimes(1);
    expect(resolveAllowedContextOptions).toHaveBeenCalledTimes(1);
  });

  it("returns empty targets when tenant is unknown", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(null);

    await expect(
      loadPostLoginMembershipTargets({
        actorUserId: ACTOR_USER_ID,
        tenantSlug: TENANT_SLUG,
      })
    ).resolves.toEqual({
      activeMembershipCount: 0,
      allowedOptions: { targets: [] },
      memberships: [],
      tenant: null,
    });

    expect(loadActorMemberships).not.toHaveBeenCalled();
    expect(resolveAllowedContextOptions).not.toHaveBeenCalled();
  });
});
