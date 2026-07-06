import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import type { AuthMembershipsGetResponseDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

export function isAccessDeniedEntryPath(entryPath: string): boolean {
  return (
    entryPath === AUTH_PATHS.accessDenied ||
    entryPath.startsWith(`${AUTH_PATHS.accessDenied}?`)
  );
}

export function shouldRedirectToPostLoginEntryPath(
  resolution: Pick<AuthMembershipsGetResponseDto, "entryPath">
): boolean {
  const { entryPath } = resolution;

  return (
    entryPath === AUTH_PATHS.workspaceSelect ||
    entryPath === AUTH_PATHS.organizationSelect ||
    isAccessDeniedEntryPath(entryPath)
  );
}
