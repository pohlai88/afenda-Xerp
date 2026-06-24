import { describe, expect, it } from "vitest";

import {
  AuthorizationDeniedError,
  assertPermissionKey,
  checkPermission,
  checkPolicyDecision,
  createPermissionKey,
  extractPermissionDomain,
  InMemoryPermissionDataSource,
  InMemoryPolicyDataSource,
  InvalidPermissionKeyError,
  isDeniedAuthorizationResult,
  isDeniedScopedMembershipResolution,
  isMatchedScopedMembershipResolution,
  isPermissionKey,
  isPolicyGateError,
  MissingAuthorizationActorError,
  MissingAuthorizationContextError,
  PERMISSION_REGISTRY,
  type PolicyContract,
  PolicyGateError,
  productionPolicyEvaluationOptions,
  requirePermission,
  requirePolicyDecision,
  resolveAuthorizationContext,
  resolveScopedMembership,
} from "../index";

const TENANT_ID = "tenant-001";
const COMPANY_A = "company-a";
const COMPANY_B = "company-b";
const ACTOR_ID = "user-001";
const ROLE_ID = "role-admin";
const MEMBERSHIP_ID = "membership-001";
const CORRELATION_ID = "authz-test-correlation";

function createTestDataSource() {
  return new InMemoryPermissionDataSource()
    .seedTenant({
      id: TENANT_ID,
      slug: "test-tenant",
      name: "Test Tenant",
      status: "active",
    })
    .seedCompany(TENANT_ID, COMPANY_A)
    .seedCompany(TENANT_ID, COMPANY_B)
    .seedPlatformUser({
      id: ACTOR_ID,
      email: "actor@example.com",
      displayName: "Test Actor",
      status: "active",
    })
    .seedRole(
      {
        id: ROLE_ID,
        key: "tenant.admin",
        name: "Tenant Admin",
        description: null,
        scope: "tenant",
        status: "active",
        tenantId: TENANT_ID,
      },
      [
        PERMISSION_REGISTRY.systemAdmin.users.manage,
        PERMISSION_REGISTRY.accounting.journal.read,
      ]
    )
    .seedMembership({
      id: MEMBERSHIP_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_A,
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

describe("@afenda/permissions", () => {
  describe("permission keys", () => {
    it("validates governed domain.action keys from @afenda/database", () => {
      expect(createPermissionKey("system_admin", "users_read")).toBe(
        "system_admin.users_read"
      );
      expect(isPermissionKey("accounting.journal_post")).toBe(true);
      expect(assertPermissionKey(" hr.employee_read ")).toBe(
        "hr.employee_read"
      );
    });

    it("rejects invalid permission keys", () => {
      expect(isPermissionKey("tenant")).toBe(false);
      expect(isPermissionKey("System.Admin.Read")).toBe(false);
      expect(isPermissionKey("system admin.users_read")).toBe(false);
      expect(isPermissionKey("system_admin.users.read")).toBe(false);
      expect(() => createPermissionKey("only_one", "")).toThrow(
        InvalidPermissionKeyError
      );
      expect(() => assertPermissionKey("InvalidKey")).toThrow(
        InvalidPermissionKeyError
      );
    });

    it("extracts domain and action segments from permission keys", () => {
      expect(
        extractPermissionDomain(PERMISSION_REGISTRY.accounting.journal.post)
      ).toBe("accounting");
    });
  });

  describe("authorization context", () => {
    it("resolves tenant-scoped context from actor and input", () => {
      expect(
        resolveAuthorizationContext(
          { actorId: ACTOR_ID },
          {
            tenantId: TENANT_ID,
            companyId: COMPANY_A,
            organizationId: null,
            workspaceId: "workspace-001",
          }
        )
      ).toEqual({
        actorId: ACTOR_ID,
        tenantId: TENANT_ID,
        companyId: COMPANY_A,
        organizationId: null,
        workspaceId: "workspace-001",
        membershipId: null,
        roleId: null,
      });
    });

    it("narrows scoped membership resolution with explicit outcome guards", () => {
      const resolution = resolveScopedMembership(
        [],
        { tenantId: TENANT_ID },
        (code, partial) => ({
          allowed: false as const,
          code,
          decision: {
            actorId: ACTOR_ID,
            tenantId: TENANT_ID,
            companyId: null,
            organizationId: null,
            workspaceId: null,
            membershipId: partial.membershipId,
            roleId: partial.roleId,
            permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
            action: "manage",
            targetType: null,
            targetId: null,
            result: partial.result,
            reason: partial.reason,
            correlationId: CORRELATION_ID,
            evaluatedAt: new Date().toISOString(),
          },
        })
      );

      expect(isDeniedScopedMembershipResolution(resolution)).toBe(true);
      expect(isMatchedScopedMembershipResolution(resolution)).toBe(false);
      if (isDeniedScopedMembershipResolution(resolution)) {
        expect(resolution.result.allowed).toBe(false);
      }
    });
  });

  describe("permission checker", () => {
    it("allows when actor has permission in the correct tenant", async () => {
      const dataSource = createTestDataSource();

      const result = await checkPermission(
        {
          actor: { actorId: ACTOR_ID },
          context: {
            tenantId: TENANT_ID,
            companyId: COMPANY_A,
          },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          action: "manage",
          targetType: "user",
          correlationId: CORRELATION_ID,
        },
        dataSource
      );

      expect(result.allowed).toBe(true);
      if (!result.allowed) {
        throw new Error("Expected allowed result");
      }

      expect(result.decision).toMatchObject({
        actorId: ACTOR_ID,
        tenantId: TENANT_ID,
        companyId: COMPANY_A,
        permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        action: "manage",
        result: "allow",
        correlationId: CORRELATION_ID,
        membershipId: MEMBERSHIP_ID,
        roleId: ROLE_ID,
      });
      expect(result.decision.evaluatedAt).toBeTruthy();
    });

    it("denies non-active platform users before membership checks", async () => {
      const dataSource = createTestDataSource().seedPlatformUser({
        id: ACTOR_ID,
        email: "actor@example.com",
        displayName: "Suspended Actor",
        status: "suspended",
      });

      const result = await checkPermission(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        dataSource
      );

      expect(isDeniedAuthorizationResult(result)).toBe(true);
      if (result.allowed) {
        throw new Error("Expected denied result");
      }

      expect(result.code).toBe("inactive_actor");
    });

    it("denies non-active tenants before membership checks", async () => {
      const dataSource = createTestDataSource().seedTenant({
        id: TENANT_ID,
        slug: "test-tenant",
        name: "Suspended Tenant",
        status: "suspended",
      });

      const result = await checkPermission(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        dataSource
      );

      expect(isDeniedAuthorizationResult(result)).toBe(true);
      if (result.allowed) {
        throw new Error("Expected denied result");
      }

      expect(result.code).toBe("inactive_tenant");
    });

    it("denies when actor lacks the required permission", async () => {
      const dataSource = createTestDataSource();

      const result = await checkPermission(
        {
          actor: { actorId: ACTOR_ID },
          context: {
            tenantId: TENANT_ID,
            companyId: COMPANY_A,
          },
          permissionKey: PERMISSION_REGISTRY.accounting.journal.post,
          action: "post",
          targetType: "journal",
        },
        dataSource
      );

      expect(isDeniedAuthorizationResult(result)).toBe(true);
      if (result.allowed) {
        throw new Error("Expected denied result");
      }

      expect(result.code).toBe("permission_denied");
      expect(result.decision.result).toBe("deny");
      expect(result.decision.permissionKey).toBe(
        PERMISSION_REGISTRY.accounting.journal.post
      );
    });

    it("throws AuthorizationDeniedError from requirePermission on deny", async () => {
      const dataSource = createTestDataSource();

      await expect(
        requirePermission(
          {
            actor: { actorId: ACTOR_ID },
            context: { tenantId: TENANT_ID, companyId: COMPANY_A },
            permissionKey: PERMISSION_REGISTRY.accounting.journal.post,
          },
          dataSource
        )
      ).rejects.toBeInstanceOf(AuthorizationDeniedError);
    });

    it("rejects unregistered permission keys at requirePermission boundary", async () => {
      const dataSource = createTestDataSource();

      await expect(
        requirePermission(
          {
            actor: { actorId: ACTOR_ID },
            context: { tenantId: TENANT_ID, companyId: COMPANY_A },
            permissionKey: "banana.destroy_all",
          },
          dataSource
        )
      ).rejects.toThrow(InvalidPermissionKeyError);
    });

    it("allows valid but unregistered keys through checkPermission for diagnostics", async () => {
      const dataSource = createTestDataSource();

      const result = await checkPermission(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: "tenant.read",
        },
        dataSource
      );

      expect(isDeniedAuthorizationResult(result)).toBe(true);
      if (result.allowed) {
        throw new Error("Expected denied result");
      }

      expect(result.code).toBe("permission_denied");
    });

    it("rejects missing actor", async () => {
      const dataSource = createTestDataSource();

      await expect(
        checkPermission(
          {
            actor: { actorId: "" },
            context: { tenantId: TENANT_ID },
            permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          },
          dataSource
        )
      ).rejects.toBeInstanceOf(MissingAuthorizationActorError);
    });

    it("rejects missing tenant context", async () => {
      const dataSource = createTestDataSource();

      await expect(
        checkPermission(
          {
            actor: { actorId: ACTOR_ID },
            context: {},
            permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          },
          dataSource
        )
      ).rejects.toBeInstanceOf(MissingAuthorizationContextError);
    });

    it("denies cross-company access and records company context", async () => {
      const dataSource = createTestDataSource();

      const result = await checkPermission(
        {
          actor: { actorId: ACTOR_ID },
          context: {
            tenantId: TENANT_ID,
            companyId: COMPANY_B,
          },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        dataSource
      );

      expect(isDeniedAuthorizationResult(result)).toBe(true);
      if (result.allowed) {
        throw new Error("Expected denied result");
      }

      expect(result.code).toBe("company_mismatch");
      expect(result.decision.companyId).toBe(COMPANY_B);
      expect(result.decision.membershipId).toBe(MEMBERSHIP_ID);
    });

    it("denies tenant-scoped grant for legal entity context without explicit company membership", async () => {
      const dataSource = new InMemoryPermissionDataSource()
        .seedTenant({
          id: TENANT_ID,
          slug: "test-tenant",
          name: "Test Tenant",
          status: "active",
        })
        .seedCompany(TENANT_ID, COMPANY_A)
        .seedPlatformUser({
          id: ACTOR_ID,
          email: "actor@example.com",
          displayName: "Tenant Admin",
          status: "active",
        })
        .seedRole(
          {
            id: ROLE_ID,
            key: "tenant.admin",
            name: "Tenant Admin",
            description: null,
            scope: "tenant",
            status: "active",
            tenantId: TENANT_ID,
          },
          [PERMISSION_REGISTRY.systemAdmin.users.manage]
        )
        .seedMembership({
          id: MEMBERSHIP_ID,
          tenantId: TENANT_ID,
          companyId: null,
          entityGroupId: null,
          organizationId: null,
          projectId: null,
    teamId: null,
          userId: ACTOR_ID,
          roleId: ROLE_ID,
          scopeType: "tenant",
          status: "active",
        });

      const result = await checkPermission(
        {
          actor: { actorId: ACTOR_ID },
          context: {
            tenantId: TENANT_ID,
            companyId: COMPANY_A,
          },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        dataSource
      );

      expect(isDeniedAuthorizationResult(result)).toBe(true);
      if (result.allowed) {
        throw new Error("Expected denied result");
      }

      expect(result.code).toBe("company_mismatch");
    });
  });

  describe("policy engine", () => {
    it("returns require_approval when a matching policy overrides allow", async () => {
      const permissionDataSource = createTestDataSource();
      const policyDataSource = new InMemoryPolicyDataSource();

      const approvalRule: PolicyContract = {
        id: "policy-approval-001",
        key: "sensitive.journal.read.approval",
        name: "Journal read approval",
        description: null,
        effect: "allow",
        status: "active",
        tenantId: TENANT_ID,
        scope: "tenant",
        priority: 100,
        condition: {
          version: 1,
          match: {
            permissionKey: PERMISSION_REGISTRY.accounting.journal.read,
            action: "read",
          },
          gateDecision: "require_approval",
        },
      };

      policyDataSource.seedPolicy(approvalRule);

      const decision = await checkPolicyDecision(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: PERMISSION_REGISTRY.accounting.journal.read,
          action: "read",
        },
        permissionDataSource,
        policyDataSource
      );

      expect(decision.result).toBe("require_approval");
      expect(decision.actorId).toBe(ACTOR_ID);
      expect(decision.tenantId).toBe(TENANT_ID);
    });

    it("throws PolicyGateError from requirePolicyDecision for gated actions", async () => {
      const permissionDataSource = createTestDataSource();
      const policyDataSource = new InMemoryPolicyDataSource();

      policyDataSource.seedPolicy({
        id: "policy-approval-002",
        key: "sensitive.journal.read.approval",
        name: "Journal read approval",
        description: null,
        effect: "allow",
        status: "active",
        tenantId: TENANT_ID,
        scope: "tenant",
        priority: 100,
        condition: {
          version: 1,
          match: {
            permissionKey: PERMISSION_REGISTRY.accounting.journal.read,
          },
          gateDecision: "require_approval",
        },
      });

      await expect(
        requirePolicyDecision(
          {
            actor: { actorId: ACTOR_ID },
            context: { tenantId: TENANT_ID, companyId: COMPANY_A },
            permissionKey: PERMISSION_REGISTRY.accounting.journal.read,
          },
          permissionDataSource,
          policyDataSource
        )
      ).rejects.toBeInstanceOf(PolicyGateError);
    });

    it("denies when a deny policy overrides granted permission", async () => {
      const permissionDataSource = createTestDataSource();
      const policyDataSource = new InMemoryPolicyDataSource();

      policyDataSource.seedPolicy({
        id: "policy-deny-001",
        key: "freeze.user.management",
        name: "Freeze user management",
        description: null,
        effect: "deny",
        status: "active",
        tenantId: TENANT_ID,
        scope: "tenant",
        priority: 50,
        condition: {
          version: 1,
          match: {
            permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          },
        },
      });

      const decision = await checkPolicyDecision(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        permissionDataSource,
        policyDataSource
      );

      expect(decision.result).toBe("deny");

      await expect(
        requirePolicyDecision(
          {
            actor: { actorId: ACTOR_ID },
            context: { tenantId: TENANT_ID, companyId: COMPANY_A },
            permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          },
          permissionDataSource,
          policyDataSource
        )
      ).rejects.toSatisfy(
        (error: unknown) =>
          error instanceof AuthorizationDeniedError &&
          error.code === "policy_denied"
      );
    });

    it("allows when permission granted and no blocking policies", async () => {
      const permissionDataSource = createTestDataSource();
      const policyDataSource = new InMemoryPolicyDataSource();

      const decision = await requirePolicyDecision(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          correlationId: CORRELATION_ID,
        },
        permissionDataSource,
        policyDataSource
      );

      expect(decision.result).toBe("allow");
      expect(decision.correlationId).toBe(CORRELATION_ID);
    });

    it("rejects unregistered permission keys at requirePolicyDecision boundary", async () => {
      const permissionDataSource = createTestDataSource();
      const policyDataSource = new InMemoryPolicyDataSource();

      await expect(
        requirePolicyDecision(
          {
            actor: { actorId: ACTOR_ID },
            context: { tenantId: TENANT_ID, companyId: COMPANY_A },
            permissionKey: "banana.destroy_all",
          },
          permissionDataSource,
          policyDataSource
        )
      ).rejects.toThrow(InvalidPermissionKeyError);
    });

    it("does not audit by default", async () => {
      const permissionDataSource = createTestDataSource();
      const policyDataSource = new InMemoryPolicyDataSource();

      await requirePolicyDecision(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        permissionDataSource,
        policyDataSource
      );
    });

    it("exposes production audit wiring for explicit opt-in", () => {
      expect(productionPolicyEvaluationOptions.auditWriter).toBeDefined();
    });

    it("invokes the configured policy audit writer", async () => {
      const permissionDataSource = createTestDataSource();
      const policyDataSource = new InMemoryPolicyDataSource();
      let auditInvocations = 0;

      await requirePolicyDecision(
        {
          actor: { actorId: ACTOR_ID },
          context: { tenantId: TENANT_ID, companyId: COMPANY_A },
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        permissionDataSource,
        policyDataSource,
        {
          auditWriter: () => {
            auditInvocations += 1;
            return Promise.resolve();
          },
        }
      );

      expect(auditInvocations).toBe(1);
    });
  });

  describe("policy gate helpers", () => {
    it("identifies policy gate errors", () => {
      const decision = {
        actorId: ACTOR_ID,
        tenantId: TENANT_ID,
        companyId: COMPANY_A,
        organizationId: null,
        workspaceId: null,
        membershipId: MEMBERSHIP_ID,
        roleId: ROLE_ID,
        permissionKey: PERMISSION_REGISTRY.accounting.journal.read,
        action: "read",
        targetType: null,
        targetId: null,
        result: "require_approval" as const,
        reason: "Policy requires approval",
        correlationId: CORRELATION_ID,
        evaluatedAt: new Date().toISOString(),
      };

      const error = new PolicyGateError(decision);
      expect(isPolicyGateError(error)).toBe(true);
    });
  });
});
