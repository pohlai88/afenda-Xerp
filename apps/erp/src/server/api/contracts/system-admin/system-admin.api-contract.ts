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
