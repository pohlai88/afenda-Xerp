import type {
  SystemAdminMembershipRoleRequestDto,
  SystemAdminMembershipRoleResponseDto,
  SystemAdminMembershipsResponseDto,
  SystemAdminPermissionsResponseDto,
  SystemAdminRolesResponseDto,
  SystemAdminSettingsResponseDto,
  SystemAdminUserInviteRequestDto,
  SystemAdminUserInviteResponseDto,
  SystemAdminUsersResponseDto,
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
  INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIPS_PATH,
  INTERNAL_V1_SYSTEM_ADMIN_PERMISSIONS_PATH,
  INTERNAL_V1_SYSTEM_ADMIN_ROLES_PATH,
  INTERNAL_V1_SYSTEM_ADMIN_SETTINGS_PATH,
  INTERNAL_V1_SYSTEM_ADMIN_USER_INVITATIONS_PATH,
  INTERNAL_V1_SYSTEM_ADMIN_USERS_PATH,
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

export async function listSystemAdminUsers(
  scope: WorkspaceApiScope
): Promise<SystemAdminUsersResponseDto> {
  const response = await fetch(INTERNAL_V1_SYSTEM_ADMIN_USERS_PATH, {
    cache: "no-store",
    headers: buildWorkspaceScopeHeaders(scope),
    method: "GET",
  });

  const envelope = await readApiEnvelope<SystemAdminUsersResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to list system admin users."
    );
  }

  return assertApiSuccessEnvelope(
    envelope,
    "Failed to list system admin users."
  );
}

async function fetchSystemAdminList<T>(
  path: string,
  scope: WorkspaceApiScope,
  failureMessage: string
): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    headers: buildWorkspaceScopeHeaders(scope),
    method: "GET",
  });

  const envelope = await readApiEnvelope<T>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(envelope, failureMessage);
  }

  return assertApiSuccessEnvelope(envelope, failureMessage);
}

export async function listSystemAdminRoles(
  scope: WorkspaceApiScope
): Promise<SystemAdminRolesResponseDto> {
  return fetchSystemAdminList<SystemAdminRolesResponseDto>(
    INTERNAL_V1_SYSTEM_ADMIN_ROLES_PATH,
    scope,
    "Failed to list system admin roles."
  );
}

export async function listSystemAdminPermissions(
  scope: WorkspaceApiScope
): Promise<SystemAdminPermissionsResponseDto> {
  return fetchSystemAdminList<SystemAdminPermissionsResponseDto>(
    INTERNAL_V1_SYSTEM_ADMIN_PERMISSIONS_PATH,
    scope,
    "Failed to list system admin permissions."
  );
}

export async function listSystemAdminMemberships(
  scope: WorkspaceApiScope
): Promise<SystemAdminMembershipsResponseDto> {
  return fetchSystemAdminList<SystemAdminMembershipsResponseDto>(
    INTERNAL_V1_SYSTEM_ADMIN_MEMBERSHIPS_PATH,
    scope,
    "Failed to list system admin memberships."
  );
}

export async function listSystemAdminSettings(
  scope: WorkspaceApiScope
): Promise<SystemAdminSettingsResponseDto> {
  return fetchSystemAdminList<SystemAdminSettingsResponseDto>(
    INTERNAL_V1_SYSTEM_ADMIN_SETTINGS_PATH,
    scope,
    "Failed to list system admin settings."
  );
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
