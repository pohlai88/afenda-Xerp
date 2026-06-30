import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { z } from "zod";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";
import {
  type SystemAdminAuditEventsResponseDto,
  type SystemAdminMembershipRoleRequestDto,
  type SystemAdminMembershipRoleResponseDto,
  type SystemAdminUserInviteRequestDto,
  type SystemAdminUserInviteResponseDto,
  systemAdminAuditEventsResponseSchema,
  systemAdminMembershipRoleRequestSchema,
  systemAdminMembershipRoleResponseSchema,
  systemAdminUserInviteRequestSchema,
  systemAdminUserInviteResponseSchema,
} from "./system-admin.api-contract";

const emptyGetRequestSchema = z.undefined();

export const systemAdminUserInvitePostContract = {
  audit: {
    action: "system_admin.user.invited",
    enabled: true,
    targetType: "user",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  consumerImpact: {
    affected: ["internal-ui"],
  },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.system-admin.users.invite.post",
  summary: "Invite user",
  description:
    "Invites a new user to the tenant with a specified role. Audited mutation requiring system admin user management permission.",
  idempotency: { mode: "optional" },
  lifecycle: "deprecated",
  lifecycleMigration: {
    replacementOperationId: "internal.v1.system-admin.user-invitations.post",
    sunsetAt: "2027-06-30",
  },
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/system-admin/users/invite",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.users.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: systemAdminUserInviteRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminUserInviteRequestSchema",
  responseSchema: systemAdminUserInviteResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminUserInviteResponseSchema",
  runtime: "nodejs",
  stability: "deprecated",
  tags: ["system-admin", "users"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  SystemAdminUserInviteRequestDto,
  SystemAdminUserInviteResponseDto
>;

export const systemAdminUserInvitationsPostContract = {
  audit: {
    action: "system_admin.user.invited",
    enabled: true,
    targetType: "user",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.system-admin.user-invitations.post",
  summary: "Create user invitation",
  description:
    "Creates a user invitation for the active tenant with a specified role. Resource-oriented successor to users/invite.",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/system-admin/user-invitations",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.users.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: systemAdminUserInviteRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminUserInviteRequestSchema",
  responseSchema: systemAdminUserInviteResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminUserInviteResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["system-admin", "users"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  SystemAdminUserInviteRequestDto,
  SystemAdminUserInviteResponseDto
>;

export const systemAdminMembershipRolePostContract = {
  audit: {
    action: "system_admin.membership.role.assigned",
    enabled: true,
    targetType: "membership",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  consumerImpact: {
    affected: ["internal-ui"],
  },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.system-admin.memberships.role.post",
  summary: "Assign membership role",
  description:
    "Updates the role assigned to an existing membership within company scope. Audited mutation requiring system admin role management permission.",
  idempotency: { mode: "optional" },
  lifecycle: "deprecated",
  lifecycleMigration: {
    replacementOperationId:
      "internal.v1.system-admin.membership-role-assignments.post",
    sunsetAt: "2027-06-30",
  },
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/system-admin/memberships/role",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.roles.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: systemAdminMembershipRoleRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminMembershipRoleRequestSchema",
  responseSchema: systemAdminMembershipRoleResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminMembershipRoleResponseSchema",
  runtime: "nodejs",
  stability: "deprecated",
  tags: ["system-admin", "memberships"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  SystemAdminMembershipRoleRequestDto,
  SystemAdminMembershipRoleResponseDto
>;

export const systemAdminMembershipRoleAssignmentsPostContract = {
  audit: {
    action: "system_admin.membership.role.assigned",
    enabled: true,
    targetType: "membership",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.system-admin.membership-role-assignments.post",
  summary: "Create membership role assignment",
  description:
    "Assigns a role to an existing membership within company scope. Resource-oriented successor to memberships/role.",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/system-admin/membership-role-assignments",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.roles.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: systemAdminMembershipRoleRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminMembershipRoleRequestSchema",
  responseSchema: systemAdminMembershipRoleResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminMembershipRoleResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["system-admin", "memberships"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  SystemAdminMembershipRoleRequestDto,
  SystemAdminMembershipRoleResponseDto
>;

export const systemAdminAuditEventsGetContract = {
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.system-admin.audit-events.get",
  summary: "List audit events",
  description:
    "Returns recent system administration audit events for the active tenant, company, and organization context.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  pagination: { mode: "cursor" },
  path: "/api/internal/v1/system-admin/audit-events",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.audit.read,
  },
  rateLimitPolicy: "authenticated-standard",
  requestSchema: emptyGetRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#request:none",
  responseSchema: systemAdminAuditEventsResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts#systemAdminAuditEventsResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["system-admin", "audit"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  undefined,
  SystemAdminAuditEventsResponseDto
>;
