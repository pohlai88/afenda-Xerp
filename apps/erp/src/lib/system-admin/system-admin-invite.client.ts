import { readApiEnvelope } from "@/lib/api/api-envelope.client";
import {
  assertApiSuccessEnvelope,
  createApiClientErrorFromEnvelope,
} from "@/lib/api/api-policy-gate.error";
import { buildWorkspaceScopeHeaders } from "@/lib/api/api-scope-headers.client";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";
import type {
  SystemAdminUserInviteRequestDto,
  SystemAdminUserInviteResponseDto,
} from "@/server/api/contracts/system-admin/system-admin.api-contract";
import { systemAdminUserInvitePostContract } from "@/server/api/contracts/system-admin/system-admin.contract";

function buildInviteRequestInit(
  scope: WorkspaceApiScope,
  body: SystemAdminUserInviteRequestDto
): RequestInit {
  return {
    body: JSON.stringify(body),
    cache: "no-store",
    headers: {
      ...buildWorkspaceScopeHeaders(scope),
      "Content-Type": "application/json",
    },
    method: "POST",
  };
}

export async function inviteSystemAdminUser(
  scope: WorkspaceApiScope,
  request: SystemAdminUserInviteRequestDto
): Promise<SystemAdminUserInviteResponseDto> {
  const response = await fetch(
    systemAdminUserInvitePostContract.path,
    buildInviteRequestInit(scope, request)
  );

  const envelope =
    await readApiEnvelope<SystemAdminUserInviteResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to invite the user."
    );
  }

  return assertApiSuccessEnvelope(envelope, "Failed to invite the user.");
}
