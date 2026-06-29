import { z } from "zod";

export const authMembershipSwitchTargetSchema = z
  .object({
    companySlug: z.string().meta({
      description: "URL-safe slug identifying the target company.",
      example: "acme-corp",
    }),
    isSelected: z.boolean().meta({
      description:
        "Whether this target matches the caller's currently active membership context.",
      example: true,
    }),
    label: z.string().meta({
      description: "Human-readable label for the membership switch target.",
      example: "Acme Corp — Finance",
    }),
    organizationSlug: z.string().optional().meta({
      description:
        "Optional organization slug when the target is scoped below company level.",
      example: "finance",
    }),
  })
  .meta({
    id: "AuthMembershipSwitchTarget",
    description:
      "A selectable company or organization membership the caller may switch into.",
  });

export type AuthMembershipSwitchTargetDto = z.infer<
  typeof authMembershipSwitchTargetSchema
>;

export const authMembershipsGetResponseSchema = z
  .object({
    activeMembershipCount: z.number().int().nonnegative().meta({
      description: "Total number of active memberships for the signed-in user.",
      example: 2,
    }),
    entryPath: z.string().meta({
      description:
        "Relative post-auth path the client should navigate to after membership resolution.",
      example: "/dashboard",
    }),
    requiresOrganizationSelect: z.boolean().meta({
      description:
        "Whether the client must prompt the user to select an organization before continuing.",
      example: false,
    }),
    requiresWorkspaceSelect: z.boolean().meta({
      description:
        "Whether the client must prompt the user to select a workspace before continuing.",
      example: true,
    }),
    targets: z.array(authMembershipSwitchTargetSchema).meta({
      description: "Membership switch targets available to the signed-in user.",
    }),
    workspaceTargetCount: z.number().int().nonnegative().meta({
      description:
        "Number of workspace-level targets requiring selection when applicable.",
      example: 3,
    }),
  })
  .meta({
    id: "AuthMembershipsGetResponse",
    description:
      "Post-login membership resolution payload guiding client navigation and context selection.",
  });

export type AuthMembershipsGetResponseDto = z.infer<
  typeof authMembershipsGetResponseSchema
>;
