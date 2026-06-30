import { auditResultSchema } from "@afenda/database";
import { z } from "zod";

export const systemAdminUserInviteRequestSchema = z
  .object({
    displayName: z.string().trim().min(1).meta({
      description: "Display name for the invited user.",
      example: "Jordan Lee",
    }),
    email: z.string().trim().email().meta({
      description: "Email address where the invitation will be sent.",
      example: "jordan.lee@example.com",
    }),
    roleId: z.string().trim().min(1).meta({
      description: "Identifier of the role to assign upon invite acceptance.",
      example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
    }),
  })
  .meta({
    id: "SystemAdminUserInviteRequest",
    description: "Request body for inviting a new user into the tenant.",
  });

export type SystemAdminUserInviteRequestDto = z.infer<
  typeof systemAdminUserInviteRequestSchema
>;

export const systemAdminUserInviteResponseSchema = z
  .object({
    membershipId: z.string().meta({
      description: "UUID of the created pending membership record.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    userId: z.string().meta({
      description: "UUID of the invited or matched user record.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
  })
  .meta({
    id: "SystemAdminUserInviteResponse",
    description: "Identifiers for the invited user and pending membership.",
  });

export type SystemAdminUserInviteResponseDto = z.infer<
  typeof systemAdminUserInviteResponseSchema
>;

export const systemAdminMembershipRoleRequestSchema = z
  .object({
    companyId: z.string().trim().min(1).meta({
      description: "UUID of the company scope for the membership role change.",
      example: "2b3c4d5e-6f70-8192-a3b4-c5d6e7f8091a",
    }),
    membershipId: z.string().trim().min(1).meta({
      description: "UUID of the membership whose role is being updated.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    roleId: z.string().trim().min(1).meta({
      description: "UUID of the new role to assign to the membership.",
      example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
    }),
  })
  .meta({
    id: "SystemAdminMembershipRoleRequest",
    description: "Request body for updating a membership role assignment.",
  });

export type SystemAdminMembershipRoleRequestDto = z.infer<
  typeof systemAdminMembershipRoleRequestSchema
>;

export const systemAdminMembershipRoleResponseSchema = z
  .object({
    membershipId: z.string().meta({
      description: "UUID of the updated membership.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    roleId: z.string().meta({
      description: "UUID of the role now assigned to the membership.",
      example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
    }),
  })
  .meta({
    id: "SystemAdminMembershipRoleResponse",
    description: "Confirmation of the updated membership role assignment.",
  });

export type SystemAdminMembershipRoleResponseDto = z.infer<
  typeof systemAdminMembershipRoleResponseSchema
>;

export const systemAdminAuditEventRowSchema = z
  .object({
    action: z.string().meta({
      description: "Audit action verb (e.g. user.invite, role.assign).",
      example: "user.invite",
    }),
    correlationId: z.string().meta({
      description: "Request correlation identifier for traceability.",
      example: "req_01HXYZABCDEF",
    }),
    createdAt: z.string().meta({
      description: "ISO-8601 timestamp when the audit event was recorded.",
      example: "2026-06-26T14:22:00.000Z",
    }),
    id: z.string().meta({
      description: "UUID of the audit event row.",
      example: "9e8d7c6b-5a4f-3210-fedc-ba9876543210",
    }),
    module: z.string().meta({
      description: "Logical module that emitted the audit event.",
      example: "system-admin",
    }),
    result: auditResultSchema.meta({
      description: "Outcome of the audited action.",
      example: "success",
    }),
    targetId: z.string().nullable().meta({
      description: "UUID of the primary target entity, if applicable.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
    targetType: z.string().meta({
      description: "Entity type of the audit target (e.g. user, membership).",
      example: "user",
    }),
  })
  .meta({
    id: "SystemAdminAuditEventRow",
    description: "Single system-admin audit event row for list responses.",
  });

export type SystemAdminAuditEventRowDto = z.infer<
  typeof systemAdminAuditEventRowSchema
>;

export const systemAdminAuditEventsResponseSchema = z
  .object({
    events: z.array(systemAdminAuditEventRowSchema).meta({
      description: "Page of audit events matching the query filters.",
    }),
  })
  .meta({
    id: "SystemAdminAuditEventsResponse",
    description: "Paginated list of system-admin audit events.",
  });

export type SystemAdminAuditEventsResponseDto = z.infer<
  typeof systemAdminAuditEventsResponseSchema
>;

export const systemAdminUserRowSchema = z
  .object({
    displayName: z.string().meta({
      description: "User display name.",
      example: "Jordan Lee",
    }),
    email: z.string().meta({
      description: "Primary email address for the user.",
      example: "jordan.lee@example.com",
    }),
    membershipId: z.string().meta({
      description: "UUID of the company-scoped membership.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    membershipStatus: z.string().meta({
      description: "Membership lifecycle status.",
      example: "active",
    }),
    roleId: z.string().meta({
      description: "UUID of the assigned role.",
      example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
    }),
    roleKey: z.string().meta({
      description: "Stable role key used for permission binding.",
      example: "admin",
    }),
    roleName: z.string().meta({
      description: "Human-readable role label.",
      example: "Administrator",
    }),
    userId: z.string().meta({
      description: "UUID of the platform user.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
    userStatus: z.string().meta({
      description: "Platform user lifecycle status.",
      example: "active",
    }),
  })
  .meta({
    id: "SystemAdminUserRow",
    description: "Serializable system-admin user directory row.",
  });

export type SystemAdminUserRowDto = z.infer<typeof systemAdminUserRowSchema>;

export const systemAdminUsersResponseSchema = z
  .object({
    users: z.array(systemAdminUserRowSchema).meta({
      description: "Company-scoped users visible to the active operator.",
    }),
  })
  .meta({
    id: "SystemAdminUsersResponse",
    description: "List response for system-admin user directory reads.",
  });

export type SystemAdminUsersResponseDto = z.infer<
  typeof systemAdminUsersResponseSchema
>;

export const systemAdminMembershipRowSchema = z
  .object({
    displayName: z.string().meta({
      description: "Member display name.",
      example: "Jordan Lee",
    }),
    email: z.string().meta({
      description: "Member email address.",
      example: "jordan.lee@example.com",
    }),
    membershipId: z.string().meta({
      description: "UUID of the company-scoped membership.",
      example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
    }),
    membershipStatus: z.string().meta({
      description: "Membership lifecycle status.",
      example: "active",
    }),
    roleId: z.string().meta({
      description: "UUID of the assigned role.",
      example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
    }),
    roleKey: z.string().meta({
      description: "Stable role key for the membership grant.",
      example: "tenant.admin",
    }),
    roleName: z.string().meta({
      description: "Human-readable role label.",
      example: "Tenant Admin",
    }),
    userId: z.string().meta({
      description: "UUID of the platform user.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
  })
  .meta({
    id: "SystemAdminMembershipRow",
    description: "Company-scoped membership directory row.",
  });

export type SystemAdminMembershipRowDto = z.infer<
  typeof systemAdminMembershipRowSchema
>;

export const systemAdminMembershipsResponseSchema = z
  .object({
    memberships: z.array(systemAdminMembershipRowSchema).meta({
      description: "Company-scoped memberships for the active legal entity.",
    }),
  })
  .meta({
    id: "SystemAdminMembershipsResponse",
    description: "List response for system-admin membership directory reads.",
  });

export type SystemAdminMembershipsResponseDto = z.infer<
  typeof systemAdminMembershipsResponseSchema
>;

export const systemAdminRoleRowSchema = z
  .object({
    description: z.string().nullable().meta({
      description: "Optional role description.",
      example: "Tenant-wide administration for development workspaces.",
    }),
    id: z.string().meta({
      description: "UUID of the role record.",
      example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
    }),
    key: z.string().meta({
      description: "Stable role key within tenant scope.",
      example: "tenant.admin",
    }),
    name: z.string().meta({
      description: "Human-readable role label.",
      example: "Tenant Admin",
    }),
    scope: z.string().meta({
      description: "Role scope (tenant or platform).",
      example: "tenant",
    }),
    status: z.string().meta({
      description: "Role lifecycle status.",
      example: "active",
    }),
    tenantId: z.string().nullable().meta({
      description: "Tenant UUID when role is tenant-scoped.",
      example: "2b3c4d5e-6f70-8192-a3b4-c5d6e7f8091a",
    }),
  })
  .meta({
    id: "SystemAdminRoleRow",
    description: "Serializable system-admin role directory row.",
  });

export type SystemAdminRoleRowDto = z.infer<typeof systemAdminRoleRowSchema>;

export const systemAdminRolesResponseSchema = z
  .object({
    roles: z.array(systemAdminRoleRowSchema).meta({
      description: "Tenant-scoped roles visible to the active operator.",
    }),
  })
  .meta({
    id: "SystemAdminRolesResponse",
    description: "List response for system-admin role directory reads.",
  });

export type SystemAdminRolesResponseDto = z.infer<
  typeof systemAdminRolesResponseSchema
>;

export const systemAdminPermissionRowSchema = z
  .object({
    action: z.string().meta({
      description: "Permission action segment.",
      example: "users_read",
    }),
    description: z.string().nullable().meta({
      description: "Permission capability description.",
      example: "View platform user records within authorized scope.",
    }),
    domain: z.string().meta({
      description: "Permission domain segment.",
      example: "system_admin",
    }),
    id: z.string().meta({
      description: "UUID of the permission catalog row.",
      example: "9e8d7c6b-5a4f-3210-fedc-ba9876543210",
    }),
    key: z.string().meta({
      description: "Canonical permission key.",
      example: "system_admin.users_read",
    }),
    name: z.string().meta({
      description: "Human-readable permission label.",
      example: "Read platform users",
    }),
  })
  .meta({
    id: "SystemAdminPermissionRow",
    description: "Serializable global permission catalog row.",
  });

export type SystemAdminPermissionRowDto = z.infer<
  typeof systemAdminPermissionRowSchema
>;

export const systemAdminPermissionsResponseSchema = z
  .object({
    permissions: z.array(systemAdminPermissionRowSchema).meta({
      description: "Global permission catalog rows.",
    }),
  })
  .meta({
    id: "SystemAdminPermissionsResponse",
    description: "List response for system-admin permission catalog reads.",
  });

export type SystemAdminPermissionsResponseDto = z.infer<
  typeof systemAdminPermissionsResponseSchema
>;

export const systemAdminModuleSettingRowSchema = z
  .object({
    domain: z.string().meta({
      description: "Module domain key.",
      example: "accounting",
    }),
    label: z.string().meta({
      description: "Display label for the module domain.",
      example: "Accounting",
    }),
    permissionCount: z.number().int().nonnegative().meta({
      description: "Number of registered permissions in the domain.",
      example: 8,
    }),
  })
  .meta({
    id: "SystemAdminModuleSettingRow",
    description: "Module domain summary for system-admin settings.",
  });

export type SystemAdminModuleSettingRowDto = z.infer<
  typeof systemAdminModuleSettingRowSchema
>;

export const systemAdminSettingsResponseSchema = z
  .object({
    modules: z.array(systemAdminModuleSettingRowSchema).meta({
      description: "Module domain summaries for tenant configuration.",
    }),
  })
  .meta({
    id: "SystemAdminSettingsResponse",
    description: "Read model for system-admin module settings.",
  });

export type SystemAdminSettingsResponseDto = z.infer<
  typeof systemAdminSettingsResponseSchema
>;

export const systemAdminDiagnosticsSnapshotSchema = z
  .object({
    apiContractCount: z.number().int().nonnegative().meta({
      description: "Count of governed API route contracts.",
      example: 24,
    }),
    companyId: z.string().meta({
      description: "Active company scope identifier.",
      example: "2b3c4d5e-6f70-8192-a3b4-c5d6e7f8091a",
    }),
    correlationId: z.string().meta({
      description: "Request correlation identifier.",
      example: "req_01HXYZABCDEF",
    }),
    protectedSurfaceCount: z.number().int().nonnegative().meta({
      description: "Registered protected operating-context surfaces.",
      example: 12,
    }),
    recentAuditEventCount: z.number().int().nonnegative().meta({
      description: "Recent audit events for the active tenant.",
      example: 42,
    }),
    spineDelegateIds: z.array(z.string()).meta({
      description: "Operating-context spine delegate identifiers.",
    }),
    tenantId: z.string().meta({
      description: "Active tenant scope identifier.",
      example: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    }),
    workspaceId: z.string().meta({
      description: "Active workspace scope identifier.",
      example: "3c4d5e6f-7081-92a3-b4c5-d6e7f8091a2b",
    }),
  })
  .meta({
    id: "SystemAdminDiagnosticsSnapshot",
    description: "Operator diagnostics snapshot for system administration.",
  });

export type SystemAdminDiagnosticsSnapshotDto = z.infer<
  typeof systemAdminDiagnosticsSnapshotSchema
>;
