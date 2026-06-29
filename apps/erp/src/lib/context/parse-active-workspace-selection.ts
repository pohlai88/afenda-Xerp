/**
 * Parses Better Auth `activeWorkspaceId` into tenant/company workspace selection.
 *
 * Wire format: `{tenantId}:{companyId}:{scopeRoot}` (ARCH-AUTH-001 FR-A05).
 */

export interface ActiveWorkspaceSelection {
  readonly companyId: string;
  readonly scopeRoot: string;
  readonly tenantId: string;
}

export function parseActiveWorkspaceSelection(
  activeWorkspaceId: string | null | undefined
): ActiveWorkspaceSelection | null {
  if (activeWorkspaceId === null || activeWorkspaceId === undefined) {
    return null;
  }

  const trimmed = activeWorkspaceId.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const parts = trimmed.split(":");

  if (parts.length !== 3) {
    return null;
  }

  const tenantId = parts[0]?.trim();
  const companyId = parts[1]?.trim();
  const scopeRoot = parts[2]?.trim();

  if (
    tenantId === undefined ||
    tenantId.length === 0 ||
    companyId === undefined ||
    companyId.length === 0 ||
    scopeRoot === undefined ||
    scopeRoot.length === 0
  ) {
    return null;
  }

  return { tenantId, companyId, scopeRoot };
}
