import { z } from "zod";

export const authMembershipSwitchTargetSchema = z.object({
  companySlug: z.string(),
  isSelected: z.boolean(),
  label: z.string(),
  organizationSlug: z.string().optional(),
});

export type AuthMembershipSwitchTargetDto = z.infer<
  typeof authMembershipSwitchTargetSchema
>;

export const authMembershipsGetResponseSchema = z.object({
  activeMembershipCount: z.number().int().nonnegative(),
  entryPath: z.string(),
  requiresOrganizationSelect: z.boolean(),
  requiresWorkspaceSelect: z.boolean(),
  targets: z.array(authMembershipSwitchTargetSchema),
  workspaceTargetCount: z.number().int().nonnegative(),
});

export type AuthMembershipsGetResponseDto = z.infer<
  typeof authMembershipsGetResponseSchema
>;
