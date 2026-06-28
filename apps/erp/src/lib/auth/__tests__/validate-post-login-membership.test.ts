import { createTestEnterpriseId } from "@afenda/kernel";
import type { MembershipContract } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";

import { validatePostLoginMembership } from "@/lib/auth/validate-post-login-membership.server";

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

const TENANT_ID = "tenant-001";
const TENANT_ENTERPRISE_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ACTOR_ID = "user-001";

const activeMembership: MembershipContract = {
  id: "membership-001",
  tenantId: TENANT_ID,
  companyId: "company-a",
  entityGroupId: null,
  organizationId: null,
  projectId: null,
  teamId: null,
  userId: ACTOR_ID,
  roleId: "role-001",
  scopeType: "company",
  status: "active",
};

describe("validatePostLoginMembership", () => {
  it("routes unlinked actors to access denied", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce({
      id: TENANT_ID,
      enterpriseId: TENANT_ENTERPRISE_ID,
      name: "Dev",
      slug: "dev-local",
      status: "active",
    });
    vi.mocked(loadActorMemberships).mockResolvedValueOnce([]);

    await expect(
      validatePostLoginMembership({
        actorUserId: ACTOR_ID,
        tenantSlug: "dev-local",
      })
    ).resolves.toMatchObject({
      activeMembershipCount: 0,
      entryPath: "/access-denied?reason=unlinked",
      requiresWorkspaceSelect: false,
    });
  });

  it("routes multi-target memberships to workspace select", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce({
      id: TENANT_ID,
      enterpriseId: TENANT_ENTERPRISE_ID,
      name: "Dev",
      slug: "dev-local",
      status: "active",
    });
    vi.mocked(loadActorMemberships).mockResolvedValueOnce([activeMembership]);
    vi.mocked(resolveAllowedContextOptions).mockResolvedValueOnce({
      targets: [
        {
          companySlug: "company-a",
          label: "Company A",
          isSelected: false,
        },
        {
          companySlug: "company-b",
          label: "Company B",
          isSelected: false,
        },
      ],
    });

    await expect(
      validatePostLoginMembership({
        actorUserId: ACTOR_ID,
        tenantSlug: "dev-local",
      })
    ).resolves.toMatchObject({
      activeMembershipCount: 1,
      entryPath: "/workspace/select",
      requiresWorkspaceSelect: true,
      workspaceTargetCount: 2,
    });
  });
});
