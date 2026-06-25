"use client";

import {
  AppShellAccountSettings05,
  type AppShellAccountSettings05MemberRow,
  type AppShellAccountSettings05PendingInviteRow,
  type AppShellAccountSettings05RoleOption,
} from "@afenda/appshell";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { readApiEnvelope } from "@/lib/api/api-envelope.client";
import {
  assertApiSuccessEnvelope,
  createApiClientErrorFromEnvelope,
} from "@/lib/api/api-policy-gate.error";
import { buildWorkspaceScopeHeaders } from "@/lib/api/api-scope-headers.client";
import {
  type ResendSystemAdminInviteActionState,
  resendSystemAdminInviteAction,
} from "@/lib/system-admin/resend-system-admin-invite.action";
import {
  type RevokeSystemAdminInviteActionState,
  revokeSystemAdminInviteAction,
} from "@/lib/system-admin/revoke-system-admin-invite.action";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";
import type { SystemAdminMembershipRoleResponseDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";
import { systemAdminMembershipRolePostContract } from "@/server/api/contracts/system-admin/system-admin.contract";

export interface SystemAdminMembersSettingsPanelProps {
  readonly apiScope: WorkspaceApiScope;
  readonly companyId: string;
  readonly inviteSlot: ReactNode;
  readonly members: readonly AppShellAccountSettings05MemberRow[];
  readonly pendingInvites: readonly AppShellAccountSettings05PendingInviteRow[];
  readonly roleOptions: readonly AppShellAccountSettings05RoleOption[];
}

type MembersPanelMessage =
  | { readonly kind: "error"; readonly text: string }
  | { readonly kind: "success"; readonly text: string };

async function assignMembershipRoleViaApi(
  scope: WorkspaceApiScope,
  request: {
    readonly companyId: string;
    readonly membershipId: string;
    readonly roleId: string;
  }
): Promise<SystemAdminMembershipRoleResponseDto> {
  const response = await fetch(systemAdminMembershipRolePostContract.path, {
    body: JSON.stringify(request),
    cache: "no-store",
    headers: {
      ...buildWorkspaceScopeHeaders(scope),
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const envelope =
    await readApiEnvelope<SystemAdminMembershipRoleResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to update the member role."
    );
  }

  return assertApiSuccessEnvelope(
    envelope,
    "Failed to update the member role."
  );
}

function readInviteActionErrorMessage(
  result:
    | ResendSystemAdminInviteActionState
    | RevokeSystemAdminInviteActionState
): string | null {
  if (result === null) {
    return "Something went wrong. Please try again.";
  }

  if (!result.ok) {
    return result.userMessage;
  }

  return null;
}

export function SystemAdminMembersSettingsPanel({
  apiScope,
  companyId,
  inviteSlot,
  members,
  pendingInvites,
  roleOptions,
}: SystemAdminMembersSettingsPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<MembersPanelMessage | null>(null);

  const refreshMembers = () => {
    router.refresh();
  };

  const handlePendingRemove = (inviteId: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("inviteId", inviteId);
      const result = await revokeSystemAdminInviteAction(null, formData);
      const errorMessage = readInviteActionErrorMessage(result);

      if (errorMessage !== null) {
        setMessage({ kind: "error", text: errorMessage });
        return;
      }

      setMessage({ kind: "success", text: "Invitation revoked." });
      refreshMembers();
    });
  };

  const handlePendingResend = (inviteId: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("inviteId", inviteId);
      const result = await resendSystemAdminInviteAction(null, formData);
      const errorMessage = readInviteActionErrorMessage(result);

      if (errorMessage !== null) {
        setMessage({ kind: "error", text: errorMessage });
        return;
      }

      setMessage({ kind: "success", text: "Invitation resent." });
      refreshMembers();
    });
  };

  const handleMemberRoleChange = (membershipId: string, roleId: string) => {
    startTransition(async () => {
      try {
        await assignMembershipRoleViaApi(apiScope, {
          companyId,
          membershipId,
          roleId,
        });
        setMessage({ kind: "success", text: "Member role updated." });
        refreshMembers();
      } catch (error: unknown) {
        const text =
          error instanceof Error
            ? error.message
            : "Failed to update the member role.";
        setMessage({ kind: "error", text });
      }
    });
  };

  const handlePendingRoleChange = (inviteId: string, roleId: string) => {
    startTransition(async () => {
      try {
        await assignMembershipRoleViaApi(apiScope, {
          companyId,
          membershipId: inviteId,
          roleId,
        });
        setMessage({ kind: "success", text: "Invite role updated." });
        refreshMembers();
      } catch (error: unknown) {
        const text =
          error instanceof Error
            ? error.message
            : "Failed to update the invite role.";
        setMessage({ kind: "error", text });
      }
    });
  };

  return (
    <>
      <AppShellAccountSettings05
        inviteSlot={inviteSlot}
        members={members}
        onMemberRoleChange={handleMemberRoleChange}
        onPendingRemove={handlePendingRemove}
        onPendingResend={handlePendingResend}
        onPendingRoleChange={handlePendingRoleChange}
        pending={pending}
        pendingInvites={pendingInvites}
        roleOptions={roleOptions}
      />
      {message?.kind === "error" ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {message.text}
        </p>
      ) : null}
      {message?.kind === "success" ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          {message.text}
        </p>
      ) : null}
    </>
  );
}
