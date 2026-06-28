import type { EntityGroupLookupRow, ProjectLookupRow } from "@afenda/database";
import type { OperatingContextError } from "@afenda/kernel";

import {
  ENTITY_GROUP_ACCESS_BLOCK_REASON,
  PROJECT_ACCESS_BLOCK_REASON,
} from "./context-errors";

export interface EntityGroupBoundaryInput {
  readonly entityGroupId: string | null;
  readonly entityGroupRow: EntityGroupLookupRow | null;
  readonly tenantId: string;
}

/**
 * Verifies a legal entity's entity group belongs to the tenant and is operational.
 * Fail-closed when the company references a group that cannot be verified.
 */
export function verifyEntityGroupBoundary(
  input: EntityGroupBoundaryInput
): OperatingContextError | null {
  if (!input.entityGroupId) {
    return null;
  }

  if (!input.entityGroupRow) {
    return {
      code: "ENTITY_GROUP_NOT_FOUND",
      userMessage: "Corporate group for this legal entity was not found.",
    };
  }

  if (input.entityGroupRow.tenantId !== input.tenantId) {
    return {
      code: "ENTITY_GROUP_SCOPE_MISMATCH",
      userMessage: "Corporate group does not belong to this tenant.",
    };
  }

  if (input.entityGroupRow.status !== "active") {
    return {
      code: "ENTITY_GROUP_NOT_OPERATIONAL",
      userMessage:
        ENTITY_GROUP_ACCESS_BLOCK_REASON[input.entityGroupRow.status] ??
        "Corporate group is not available.",
    };
  }

  return null;
}

export interface ProjectBoundaryInput {
  readonly companyId: string;
  readonly organizationId: string | null;
  readonly projectIdHint?: string | null;
  readonly projectRow: ProjectLookupRow | null;
  readonly projectSlug?: string | null;
  readonly tenantId: string;
}

/**
 * Verifies a resolved project row matches tenant, company, and optional org scope.
 * Fail-closed when a client hint cannot be verified.
 */
export function verifyProjectBoundary(
  input: ProjectBoundaryInput
): OperatingContextError | null {
  const projectSlug = input.projectSlug?.trim() || null;
  const projectIdHint = input.projectIdHint?.trim() || null;

  if (!(projectSlug || projectIdHint)) {
    return null;
  }

  if (!input.projectRow) {
    return {
      code: "PROJECT_NOT_FOUND",
      userMessage: "Selected project was not found in this workspace.",
    };
  }

  if (input.projectRow.tenantId !== input.tenantId) {
    return {
      code: "PROJECT_SCOPE_MISMATCH",
      userMessage: "Project does not belong to this tenant.",
    };
  }

  if (input.projectRow.companyId !== input.companyId) {
    return {
      code: "PROJECT_SCOPE_MISMATCH",
      userMessage: "Project does not belong to the selected legal entity.",
    };
  }

  const organizationId = input.organizationId;
  const projectOrganizationId = input.projectRow.organizationUnitId;

  if (
    organizationId &&
    projectOrganizationId &&
    projectOrganizationId !== organizationId
  ) {
    return {
      code: "PROJECT_SCOPE_MISMATCH",
      userMessage: "Project does not belong to the selected organization unit.",
    };
  }

  if (input.projectRow.status !== "active") {
    return {
      code: "PROJECT_NOT_OPERATIONAL",
      userMessage:
        PROJECT_ACCESS_BLOCK_REASON[input.projectRow.status] ??
        "Project is not available.",
    };
  }

  return null;
}
