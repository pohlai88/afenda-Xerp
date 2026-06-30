import type {
  SystemAdminMembershipRoleRequestDto,
  SystemAdminMembershipRoleResponseDto,
  SystemAdminUserInviteRequestDto,
  SystemAdminUserInviteResponseDto,
} from "@/server/api/contracts/system-admin/system-admin.api-contract";

import { readApiEnvelope } from "./api-envelope.client";
import {
  assertApiSuccessEnvelope,
  createApiClientErrorFromEnvelope,
} from "./api-policy-gate.error";
import {
  buildWorkspaceScopeHeaders,
  type WorkspaceApiScope,
} from "./api-scope-headers.client";
import {
  INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIP_ROLE_ASSIGNMENTS_PATH,
  INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_PATH,
} from "./internal-v1-system-admin-routes";

function buildSystemAdminMutationRequestInit(
  scope: WorkspaceApiScope,
  body: unknown,
  idempotencyKey?: string
): RequestInit {
  const headers: Record<string, string> = {
    ...buildWorkspaceScopeHeaders(scope),
    "Content-Type": "application/json",
  };

  if (idempotencyKey !== undefined && idempotencyKey.length > 0) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  return {
    body: JSON.stringify(body),
    cache: "no-store",
    headers,
    method: "POST",
  };
}

export async function createSystemAdminUserInvitation(
  scope: WorkspaceApiScope,
  request: SystemAdminUserInviteRequestDto,
  options?: { readonly idempotencyKey?: string }
): Promise<SystemAdminUserInviteResponseDto> {
  const response = await fetch(
    INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_PATH,
    buildSystemAdminMutationRequestInit(scope, request, options?.idempotencyKey)
  );

  const envelope =
    await readApiEnvelope<SystemAdminUserInviteResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to create system admin user invitation."
    );
  }

  return assertApiSuccessEnvelope(
    envelope,
    "Failed to create system admin user invitation."
  );
}

export async function createSystemAdminMembershipRoleAssignment(
  scope: WorkspaceApiScope,
  request: SystemAdminMembershipRoleRequestDto,
  options?: { readonly idempotencyKey?: string }
): Promise<SystemAdminMembershipRoleResponseDto> {
  const response = await fetch(
    INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIP_ROLE_ASSIGNMENTS_PATH,
    buildSystemAdminMutationRequestInit(scope, request, options?.idempotencyKey)
  );

  const envelope =
    await readApiEnvelope<SystemAdminMembershipRoleResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to create system admin membership role assignment."
    );
  }

  return assertApiSuccessEnvelope(
    envelope,
    "Failed to create system admin membership role assignment."
  );
}
