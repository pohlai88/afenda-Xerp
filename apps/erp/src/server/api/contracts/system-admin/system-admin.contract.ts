import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { z } from "zod";

import type { ApiRouteContract } from "../api-contract";
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
  cache: { kind: "no-store" },
  id: "internal.v1.system-admin.users.invite.post",
  idempotency: { mode: "optional" },
  method: "POST",
  path: "/api/internal/v1/system-admin/users/invite",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.users.manage,
  },
  requestSchema: systemAdminUserInviteRequestSchema,
  responseSchema: systemAdminUserInviteResponseSchema,
  runtime: "nodejs",
  tags: ["system-admin", "users"],
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
  cache: { kind: "no-store" },
  id: "internal.v1.system-admin.memberships.role.post",
  idempotency: { mode: "optional" },
  method: "POST",
  path: "/api/internal/v1/system-admin/memberships/role",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.roles.manage,
  },
  requestSchema: systemAdminMembershipRoleRequestSchema,
  responseSchema: systemAdminMembershipRoleResponseSchema,
  runtime: "nodejs",
  tags: ["system-admin", "memberships"],
  version: "v1",
} as const satisfies ApiRouteContract<
  SystemAdminMembershipRoleRequestDto,
  SystemAdminMembershipRoleResponseDto
>;

export const systemAdminAuditEventsGetContract = {
  cache: { kind: "no-store" },
  id: "internal.v1.system-admin.audit-events.get",
  method: "GET",
  path: "/api/internal/v1/system-admin/audit-events",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.audit.read,
  },
  requestSchema: emptyGetRequestSchema,
  responseSchema: systemAdminAuditEventsResponseSchema,
  runtime: "nodejs",
  tags: ["system-admin", "audit"],
  version: "v1",
} as const satisfies ApiRouteContract<
  undefined,
  SystemAdminAuditEventsResponseDto
>;
