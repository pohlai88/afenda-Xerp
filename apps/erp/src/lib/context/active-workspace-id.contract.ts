/**
 * Serializable workspace scope key — aligned with metadata workspaceId format.
 * Format: `{tenantId}:{companyId}:{organizationId|"root"}`
 */

export interface ParsedActiveWorkspaceId {
  readonly companyId: string;
  readonly organizationId: string | null;
  readonly tenantId: string;
}

const ACTIVE_WORKSPACE_ROOT_ORG = "root" as const;

export function formatActiveWorkspaceId(input: {
  readonly companyId: string;
  readonly organizationId: string | null;
  readonly tenantId: string;
}): string {
  const orgSegment =
    input.organizationId === null || input.organizationId.trim().length === 0
      ? ACTIVE_WORKSPACE_ROOT_ORG
      : input.organizationId.trim();

  return `${input.tenantId.trim()}:${input.companyId.trim()}:${orgSegment}`;
}

export function parseActiveWorkspaceId(
  value: string | null | undefined
): ParsedActiveWorkspaceId | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const parts = trimmed.split(":");
  if (parts.length !== 3) {
    return null;
  }

  const [tenantId, companyId, organizationSegment] = parts;
  if (
    tenantId === undefined ||
    companyId === undefined ||
    organizationSegment === undefined ||
    tenantId.length === 0 ||
    companyId.length === 0 ||
    organizationSegment.length === 0
  ) {
    return null;
  }

  const organizationId =
    organizationSegment === ACTIVE_WORKSPACE_ROOT_ORG
      ? null
      : organizationSegment;

  return {
    tenantId,
    companyId,
    organizationId,
  };
}
