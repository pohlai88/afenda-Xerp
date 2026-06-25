import type { AppShellAccountSettings05PendingInviteRow } from "@afenda/appshell";
import { listPendingAuthInvitationsForTenant } from "@afenda/auth";
import { findMembershipById } from "@afenda/database";

import { listTenantMembersForSettings } from "@/lib/system-admin/list-tenant-members-for-settings.server";

export interface MembersSettingsViewModel {
  readonly members: Awaited<ReturnType<typeof listTenantMembersForSettings>>;
  readonly pendingInvites: readonly AppShellAccountSettings05PendingInviteRow[];
}

function deriveInviteDisplayName(email: string, displayName?: string): string {
  if (displayName && displayName.trim().length > 0) {
    return displayName.trim();
  }

  const localPart = email.split("@")[0]?.trim();
  return localPart && localPart.length > 0 ? localPart : email;
}

export async function resolveMembersSettings(input: {
  readonly companyId: string;
  readonly tenantId: string;
}): Promise<MembersSettingsViewModel> {
  const [members, pendingAuth] = await Promise.all([
    listTenantMembersForSettings({
      companyId: input.companyId,
      tenantId: input.tenantId,
    }),
    listPendingAuthInvitationsForTenant(input.tenantId),
  ]);

  const pendingInvites = await Promise.all(
    pendingAuth.map(async (invitation) => {
      const membership = await findMembershipById(invitation.invitationId);

      return {
        email: invitation.email,
        id: invitation.invitationId,
        name: deriveInviteDisplayName(invitation.email),
        role: membership?.roleId ?? "member",
      } satisfies AppShellAccountSettings05PendingInviteRow;
    })
  );

  return {
    members,
    pendingInvites,
  };
}
