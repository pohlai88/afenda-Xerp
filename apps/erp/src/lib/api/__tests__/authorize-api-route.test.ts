import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS, ok } from "@afenda/kernel";
import {
  InMemoryPermissionDataSource,
  InMemoryPolicyDataSource,
  PERMISSION_REGISTRY,
} from "@afenda/permissions";
import { describe, expect, it } from "vitest";
import {
  testGroupCompanyLegalEntityProfileFields,
  testLegalEntityCurrencyFields,
  testStandaloneLegalEntityProfileFields,
} from "@/lib/context/__tests__/legal-entity-test-fixtures";
import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import type { ResolveOperatingContextInput } from "@/lib/context/resolve-operating-context.server";
import {
  AFENDA_TENANT_ID_HEADER,
  readScopeCandidateFromHeaders,
} from "../api-route-context";
import {
  assertAuthorizedApiRoute,
  authorizeApiRoute,
} from "../authorize-api-route";

import {
  API_TEST_ACTOR_ID,
  API_TEST_COMPANY_B_ID,
  API_TEST_COMPANY_ID,
  API_TEST_COMPANY_UNKNOWN_ID,
  API_TEST_CORRELATION_ID,
  API_TEST_ENTITY_GROUP_A_ID,
  API_TEST_ENTITY_GROUP_B_ID,
  API_TEST_MEMBERSHIP_ID,
  API_TEST_ROLE_ID,
  API_TEST_ROLE_READONLY_ID,
  API_TEST_TENANT_ID,
} from "./api-id-test-fixtures";

const TENANT_ID = API_TEST_TENANT_ID;
const COMPANY_ID = API_TEST_COMPANY_ID;
const COMPANY_B = API_TEST_COMPANY_B_ID;
const ENTITY_GROUP_A = API_TEST_ENTITY_GROUP_A_ID;
const ENTITY_GROUP_B = API_TEST_ENTITY_GROUP_B_ID;
const ACTOR_ID = API_TEST_ACTOR_ID;
const ROLE_ID = API_TEST_ROLE_ID;
const MEMBERSHIP_ID = API_TEST_MEMBERSHIP_ID;
const CORRELATION_ID = API_TEST_CORRELATION_ID;

function createMockOperatingContext(
  overrides: Partial<OperatingContext> = {}
): OperatingContext {
  return {
    actor: { userId: ACTOR_ID },
    correlationId: CORRELATION_ID,
    tenant: {
      tenantId: TENANT_ID,
      slug: "acme",
      displayName: "Acme",
      status: "active",
    },
    entityGroup: null,
    legalEntity: {
      companyId: COMPANY_ID,
      tenantId: TENANT_ID,
      entityGroupId: null,
      slug: "acme-co",
      legalName: "Acme Co",
      displayName: "Acme Co",
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
    permissionScope: {
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
    },
    consolidationScope: null,
    surface: null,
    workflow: null,
    ...overrides,
  };
}

function createOperatingContextResolver(
  operatingContext: OperatingContext = createMockOperatingContext()
) {
  return async (_input: ResolveOperatingContextInput) => ok(operatingContext);
}

function createAuthorizedDataSource() {
  return new InMemoryPermissionDataSource()
    .seedTenant({
      id: TENANT_ID,
      slug: "acme",
      name: "Acme",
      status: "active",
    })
    .seedCompany(TENANT_ID, COMPANY_ID)
    .seedPlatformUser({
      id: ACTOR_ID,
      email: "actor@example.com",
      displayName: "Actor",
      status: "active",
    })
    .seedRole(
      {
        id: ROLE_ID,
        key: "company.admin",
        name: "Company Admin",
        description: null,
        scope: "company",
        status: "active",
        tenantId: TENANT_ID,
      },
      [PERMISSION_REGISTRY.workspace.dashboard.read]
    )
    .seedMembership({
      id: MEMBERSHIP_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      entityGroupId: null,
      organizationId: null,
      projectId: null,
      teamId: null,
      userId: ACTOR_ID,
      roleId: ROLE_ID,
      scopeType: "company",
      status: "active",
    });
}

function createRequest(headers: Record<string, string> = {}): Request {
  return new Request(
    "https://erp.local/api/internal/v1/workspace/dashboard-layout",
    {
      headers,
      method: "GET",
    }
  );
}

describe("authorizeApiRoute", () => {
  it("returns unauthenticated when actor id is missing", async () => {
    const result = await authorizeApiRoute(
      {
        actorId: null,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest(),
      },
      {
        permission: createAuthorizedDataSource(),
        resolveOperatingContext: createOperatingContextResolver(),
        session: null,
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.apiCode).toBe("unauthenticated");
    expect(result.denialCode).toBe("missing_session");
  });

  it("returns forbidden when session exists but platform user is unlinked", async () => {
    const result = await authorizeApiRoute(
      {
        actorId: null,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest(),
      },
      {
        permission: createAuthorizedDataSource(),
        resolveOperatingContext: createOperatingContextResolver(),
        session: {
          sessionId: "sess_unlinked",
          user: {
            authUserId: "auth_user_unlinked",
            email: "unlinked@example.com",
            name: "Unlinked User",
            emailVerified: true,
            linkStatus: "unlinked",
            userId: null,
          },
          metadata: {
            image: null,
            issuedAt: "2026-06-20T00:00:00.000Z",
            expiresAt: "2026-06-27T00:00:00.000Z",
            ipAddress: null,
            userAgent: null,
            activeWorkspaceId: null,
          },
        },
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.apiCode).toBe("forbidden");
    expect(result.denialCode).toBe("missing_session");
    expect(result.message).toContain("Platform user link");
  });

  it("returns forbidden when workspace context is missing", async () => {
    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest(),
      },
      { permission: createAuthorizedDataSource() }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.apiCode).toBe("forbidden");
    expect(result.denialCode).toBe("missing_context");
  });

  it("returns forbidden when actor lacks permission", async () => {
    const dataSource = new InMemoryPermissionDataSource()
      .seedTenant({
        id: TENANT_ID,
        slug: "acme",
        name: "Acme",
        status: "active",
      })
      .seedCompany(TENANT_ID, COMPANY_ID)
      .seedPlatformUser({
        id: ACTOR_ID,
        email: "actor@example.com",
        displayName: "Actor",
        status: "active",
      })
      .seedRole(
        {
          id: API_TEST_ROLE_READONLY_ID,
          key: "readonly",
          name: "Readonly",
          description: null,
          scope: "company",
          status: "active",
          tenantId: TENANT_ID,
        },
        []
      )
      .seedMembership({
        id: MEMBERSHIP_ID,
        tenantId: TENANT_ID,
        companyId: COMPANY_ID,
        entityGroupId: null,
        organizationId: null,
        projectId: null,
        teamId: null,
        userId: ACTOR_ID,
        roleId: API_TEST_ROLE_READONLY_ID,
        scopeType: "company",
        status: "active",
      });

    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
        }),
      },
      {
        permission: dataSource,
        resolveOperatingContext: createOperatingContextResolver(),
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.apiCode).toBe("forbidden");
    expect(result.denialCode).toBe("permission_denied");
  });

  it("allows authorized actor with verified operating context", async () => {
    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
        }),
      },
      {
        permission: createAuthorizedDataSource(),
        resolveOperatingContext: createOperatingContextResolver(),
      }
    );

    expect(result.kind).toBe("success");
    if (result.kind !== "success") {
      return;
    }

    expect(result.authorization.tenantId).toBe(TENANT_ID);
    expect(result.decision.result).toBe("allow");
    expect(result.execution.tenantId).toBe(TENANT_ID);
  });

  it("returns forbidden when an active deny policy blocks the action", async () => {
    const policyDataSource = new InMemoryPolicyDataSource().seedPolicy({
      id: "policy-deny-dashboard",
      key: "workspace.dashboard.read.freeze",
      name: "Dashboard read freeze",
      description: null,
      effect: "deny",
      status: "active",
      tenantId: TENANT_ID,
      scope: "tenant",
      priority: 100,
      condition: {
        version: 1,
        match: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
      },
    });

    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
        }),
      },
      {
        permission: createAuthorizedDataSource(),
        policy: policyDataSource,
        resolveOperatingContext: createOperatingContextResolver(),
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.denialCode).toBe("policy_denied");
    expect(result.apiCode).toBe("forbidden");
  });

  it("returns forbidden when a policy gate requires approval", async () => {
    const policyDataSource = new InMemoryPolicyDataSource().seedPolicy({
      id: "policy-gate-dashboard",
      key: "workspace.dashboard.write.approval",
      name: "Dashboard write approval",
      description: null,
      effect: "allow",
      status: "active",
      tenantId: TENANT_ID,
      scope: "tenant",
      priority: 100,
      condition: {
        version: 1,
        match: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        gateDecision: "require_approval",
      },
    });

    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
        }),
      },
      {
        permission: createAuthorizedDataSource(),
        policy: policyDataSource,
        resolveOperatingContext: createOperatingContextResolver(),
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.denialCode).toBe("policy_gated");
    expect(result.details).toEqual({ gateDecision: "require_approval" });
  });

  it("rejects cross-company scope mismatch with forbidden and correlation id", async () => {
    const dataSource = new InMemoryPermissionDataSource()
      .seedTenant({
        id: TENANT_ID,
        slug: "acme",
        name: "Acme",
        status: "active",
      })
      .seedCompany(TENANT_ID, COMPANY_ID)
      .seedCompany(TENANT_ID, COMPANY_B)
      .seedPlatformUser({
        id: ACTOR_ID,
        email: "actor@example.com",
        displayName: "Actor",
        status: "active",
      })
      .seedRole(
        {
          id: ROLE_ID,
          key: "company.admin",
          name: "Company Admin",
          description: null,
          scope: "company",
          status: "active",
          tenantId: TENANT_ID,
        },
        [PERMISSION_REGISTRY.workspace.dashboard.read]
      )
      .seedMembership({
        id: MEMBERSHIP_ID,
        tenantId: TENANT_ID,
        companyId: COMPANY_ID,
        entityGroupId: null,
        organizationId: null,
        projectId: null,
        teamId: null,
        userId: ACTOR_ID,
        roleId: ROLE_ID,
        scopeType: "company",
        status: "active",
      });

    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
          "x-afenda-company-id": COMPANY_B,
        }),
      },
      {
        permission: dataSource,
        resolveOperatingContext: createOperatingContextResolver(
          createMockOperatingContext({
            legalEntity: {
              companyId: COMPANY_B,
              tenantId: TENANT_ID,
              entityGroupId: null,
              slug: "acme-co-b",
              legalName: "Acme Co B",
              displayName: "Acme Co B",
              registrationNumber: null,
              taxRegistrationNumber: null,
              ...testLegalEntityCurrencyFields(),
              ...testStandaloneLegalEntityProfileFields(),
            },
            workspace: {
              tenantId: TENANT_ID,
              companyId: COMPANY_B,
              organizationId: null,
              projectId: null,
            },
            permissionScope: {
              grantScopeType: "company",
              tenantId: TENANT_ID,
              entityGroupId: null,
              companyId: COMPANY_B,
              organizationId: null,
              teamId: null,
              projectId: null,
              membershipId: MEMBERSHIP_ID,
              roleId: ROLE_ID,
              elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
            },
          })
        ),
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.apiCode).toBe("forbidden");
    expect(result.denialCode).toBe("company_mismatch");
    expect(result.correlationId).toBe(CORRELATION_ID);
  });

  it("rejects subsidiary legal entity outside entity_group membership boundary", async () => {
    const dataSource = new InMemoryPermissionDataSource()
      .seedTenant({
        id: TENANT_ID,
        slug: "acme",
        name: "Acme",
        status: "active",
      })
      .seedCompany(TENANT_ID, COMPANY_ID)
      .seedCompany(TENANT_ID, COMPANY_B)
      .seedPlatformUser({
        id: ACTOR_ID,
        email: "group.cfo@example.com",
        displayName: "Group CFO",
        status: "active",
      })
      .seedRole(
        {
          id: ROLE_ID,
          key: "group.cfo",
          name: "Group CFO",
          description: null,
          scope: "tenant",
          status: "active",
          tenantId: TENANT_ID,
        },
        [PERMISSION_REGISTRY.workspace.dashboard.read]
      )
      .seedMembership({
        id: MEMBERSHIP_ID,
        tenantId: TENANT_ID,
        companyId: null,
        entityGroupId: ENTITY_GROUP_A,
        organizationId: null,
        projectId: null,
        teamId: null,
        userId: ACTOR_ID,
        roleId: ROLE_ID,
        scopeType: "entity_group",
        status: "active",
      });

    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
          "x-afenda-company-id": COMPANY_B,
        }),
      },
      {
        permission: dataSource,
        resolveOperatingContext: createOperatingContextResolver(
          createMockOperatingContext({
            entityGroup: {
              entityGroupId: ENTITY_GROUP_B,
              tenantId: TENANT_ID,
              slug: "acme-group-b",
              displayName: "Acme Group B",
              parentLegalEntityId: null,
              status: "active",
            },
            legalEntity: {
              companyId: COMPANY_B,
              tenantId: TENANT_ID,
              entityGroupId: ENTITY_GROUP_B,
              slug: "acme-subsidiary-b",
              legalName: "Acme Subsidiary B",
              displayName: "Acme Subsidiary B",
              registrationNumber: null,
              taxRegistrationNumber: null,
              ...testLegalEntityCurrencyFields(),
              ...testGroupCompanyLegalEntityProfileFields(),
            },
            workspace: {
              tenantId: TENANT_ID,
              companyId: COMPANY_B,
              organizationId: null,
              projectId: null,
            },
            permissionScope: {
              grantScopeType: "entity_group",
              tenantId: TENANT_ID,
              entityGroupId: ENTITY_GROUP_B,
              companyId: COMPANY_B,
              organizationId: null,
              teamId: null,
              projectId: null,
              membershipId: MEMBERSHIP_ID,
              roleId: ROLE_ID,
              elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
            },
          })
        ),
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.apiCode).toBe("forbidden");
    expect(result.denialCode).toBe("company_mismatch");
    expect(result.correlationId).toBe(CORRELATION_ID);
  });

  it("authorizes entity_group membership for subsidiary within the same group", async () => {
    const dataSource = new InMemoryPermissionDataSource()
      .seedTenant({
        id: TENANT_ID,
        slug: "acme",
        name: "Acme",
        status: "active",
      })
      .seedCompany(TENANT_ID, COMPANY_ID)
      .seedPlatformUser({
        id: ACTOR_ID,
        email: "group.cfo@example.com",
        displayName: "Group CFO",
        status: "active",
      })
      .seedRole(
        {
          id: ROLE_ID,
          key: "group.cfo",
          name: "Group CFO",
          description: null,
          scope: "tenant",
          status: "active",
          tenantId: TENANT_ID,
        },
        [PERMISSION_REGISTRY.workspace.dashboard.read]
      )
      .seedMembership({
        id: MEMBERSHIP_ID,
        tenantId: TENANT_ID,
        companyId: null,
        entityGroupId: ENTITY_GROUP_A,
        organizationId: null,
        projectId: null,
        teamId: null,
        userId: ACTOR_ID,
        roleId: ROLE_ID,
        scopeType: "entity_group",
        status: "active",
      });

    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
          "x-afenda-company-id": COMPANY_ID,
        }),
      },
      {
        permission: dataSource,
        resolveOperatingContext: createOperatingContextResolver(
          createMockOperatingContext({
            entityGroup: {
              entityGroupId: ENTITY_GROUP_A,
              tenantId: TENANT_ID,
              slug: "acme-group",
              displayName: "Acme Group",
              parentLegalEntityId: null,
              status: "active",
            },
            legalEntity: {
              companyId: COMPANY_ID,
              tenantId: TENANT_ID,
              entityGroupId: ENTITY_GROUP_A,
              slug: "acme-subsidiary",
              legalName: "Acme Subsidiary",
              displayName: "Acme Subsidiary",
              registrationNumber: null,
              taxRegistrationNumber: null,
              ...testLegalEntityCurrencyFields(),
              ...testGroupCompanyLegalEntityProfileFields(),
            },
            workspace: {
              tenantId: TENANT_ID,
              companyId: COMPANY_ID,
              organizationId: null,
              projectId: null,
            },
            permissionScope: {
              grantScopeType: "entity_group",
              tenantId: TENANT_ID,
              entityGroupId: ENTITY_GROUP_A,
              companyId: COMPANY_ID,
              organizationId: null,
              teamId: null,
              projectId: null,
              membershipId: MEMBERSHIP_ID,
              roleId: ROLE_ID,
              elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
            },
          })
        ),
      }
    );

    expect(result.kind).toBe("success");
    if (result.kind !== "success") {
      return;
    }

    expect(result.decision.result).toBe("allow");
    expect(result.decision.entityGroupId).toBe(ENTITY_GROUP_A);
    expect(result.decision.companyId).toBe(COMPANY_ID);
  });

  it("authorizes system-admin audit read when actor has system_admin.audit_read", async () => {
    const dataSource = new InMemoryPermissionDataSource()
      .seedTenant({
        id: TENANT_ID,
        slug: "acme",
        name: "Acme",
        status: "active",
      })
      .seedCompany(TENANT_ID, COMPANY_ID)
      .seedPlatformUser({
        id: ACTOR_ID,
        email: "actor@example.com",
        displayName: "Actor",
        status: "active",
      })
      .seedRole(
        {
          id: ROLE_ID,
          key: "system.admin",
          name: "System Admin",
          description: null,
          scope: "company",
          status: "active",
          tenantId: TENANT_ID,
        },
        [PERMISSION_REGISTRY.systemAdmin.audit.read]
      )
      .seedMembership({
        id: MEMBERSHIP_ID,
        tenantId: TENANT_ID,
        companyId: COMPANY_ID,
        entityGroupId: null,
        organizationId: null,
        projectId: null,
        teamId: null,
        userId: ACTOR_ID,
        roleId: ROLE_ID,
        scopeType: "company",
        status: "active",
      });

    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/system-admin/audit-events",
        permission: {
          permissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
        }),
      },
      {
        permission: dataSource,
        resolveOperatingContext: createOperatingContextResolver(),
      }
    );

    expect(result.kind).toBe("success");
    if (result.kind !== "success") {
      return;
    }

    expect(result.decision.permissionKey).toBe(
      PERMISSION_REGISTRY.systemAdmin.audit.read
    );
  });

  it("rejects spoofed company selection at operating context boundary", async () => {
    const result = await authorizeApiRoute(
      {
        actorId: ACTOR_ID,
        correlationId: CORRELATION_ID,
        method: "GET",
        path: "/api/internal/v1/workspace/dashboard-layout",
        permission: {
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
        },
        protectionLevel: "tenant-protected",
        request: createRequest({
          [TENANT_SLUG_HEADER]: "acme",
          "x-afenda-company-id": API_TEST_COMPANY_UNKNOWN_ID,
        }),
      },
      {
        permission: createAuthorizedDataSource(),
        resolveOperatingContext: async () => ({
          ok: false,
          error: {
            code: "COMPANY_SCOPE_MISMATCH",
            userMessage: "Legal entity does not belong to this tenant.",
          },
        }),
      }
    );

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") {
      return;
    }

    expect(result.apiCode).toBe("forbidden");
    expect(result.denialCode).toBe("missing_context");
  });

  it("throws ApiRouteError from assertAuthorizedApiRoute on denial", async () => {
    await expect(
      assertAuthorizedApiRoute(
        {
          actorId: null,
          correlationId: CORRELATION_ID,
          method: "PUT",
          path: "/api/internal/v1/workspace/dashboard-layout",
          permission: {
            permissionKey: PERMISSION_REGISTRY.workspace.dashboard.write,
          },
          protectionLevel: "tenant-protected",
          request: createRequest(),
        },
        { session: null }
      )
    ).rejects.toMatchObject({
      code: "unauthenticated",
    });
  });
});

describe("readScopeCandidateFromHeaders", () => {
  it("reads governed scope headers as selection hints only", () => {
    const request = createRequest({
      [AFENDA_TENANT_ID_HEADER]: TENANT_ID,
      "x-afenda-company-id": COMPANY_ID,
    });

    expect(readScopeCandidateFromHeaders(request)).toEqual({
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationId: null,
      workspaceId: null,
    });
  });
});
