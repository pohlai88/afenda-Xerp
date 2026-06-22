import type { EntityGroupLookupRow } from "@afenda/database";
import type { OperatingContextError } from "@afenda/kernel";

import { ENTITY_GROUP_ACCESS_BLOCK_REASON } from "./context-errors";

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

/**
 * Project scope is planned for TIP-030 — reject any client hint until persistence exists.
 */
export function verifyProjectSelection(input: {
  readonly projectId?: string | null;
}): OperatingContextError | null {
  const projectId = input.projectId?.trim();
  if (!projectId) {
    return null;
  }

  return {
    code: "PROJECT_SCOPE_MISMATCH",
    userMessage: "Project scope is not available in this workspace yet.",
  };
}
