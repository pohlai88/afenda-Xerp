import { auditResultSchema } from "@afenda/database";
import { z } from "zod";

export const systemAdminUserInviteRequestSchema = z.object({
  displayName: z.string().trim().min(1),
  email: z.string().trim().email(),
  roleId: z.string().trim().min(1),
});

export type SystemAdminUserInviteRequestDto = z.infer<
  typeof systemAdminUserInviteRequestSchema
>;

export const systemAdminUserInviteResponseSchema = z.object({
  membershipId: z.string(),
  userId: z.string(),
});

export type SystemAdminUserInviteResponseDto = z.infer<
  typeof systemAdminUserInviteResponseSchema
>;

export const systemAdminMembershipRoleRequestSchema = z.object({
  companyId: z.string().trim().min(1),
  membershipId: z.string().trim().min(1),
  roleId: z.string().trim().min(1),
});

export type SystemAdminMembershipRoleRequestDto = z.infer<
  typeof systemAdminMembershipRoleRequestSchema
>;

export const systemAdminMembershipRoleResponseSchema = z.object({
  membershipId: z.string(),
  roleId: z.string(),
});

export type SystemAdminMembershipRoleResponseDto = z.infer<
  typeof systemAdminMembershipRoleResponseSchema
>;

export const systemAdminAuditEventRowSchema = z.object({
  action: z.string(),
  correlationId: z.string(),
  createdAt: z.string(),
  id: z.string(),
  module: z.string(),
  result: auditResultSchema,
  targetId: z.string().nullable(),
  targetType: z.string(),
});

export type SystemAdminAuditEventRowDto = z.infer<
  typeof systemAdminAuditEventRowSchema
>;

export const systemAdminAuditEventsResponseSchema = z.object({
  events: z.array(systemAdminAuditEventRowSchema),
});

export type SystemAdminAuditEventsResponseDto = z.infer<
  typeof systemAdminAuditEventsResponseSchema
>;
