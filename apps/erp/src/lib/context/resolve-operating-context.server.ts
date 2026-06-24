import {
  type AfendaDatabase,
  findOrganizationByCompanyAndSlug,
  findOrganizationById,
  findTeamById,
  findTenantBySlug,
  getTenantAccessBlockReason,
  isTeamOrganizationRow,
  isTenantOperational,
} from "@afenda/database";
import {
  type OperatingContext,
  type OperatingContextResult,
  type OperatingContextSelection,
  ok,
  type TeamContext,
  toSurfaceContext,
  toWorkflowContext,
  type WorkspaceContext,
} from "@afenda/kernel";
import type { MembershipContract } from "@afenda/permissions";

import {
  denyOperatingContext,
  ORGANIZATION_ACCESS_BLOCK_REASON,
} from "./context-errors";
import { logOperatingContextResolution } from "./log-operating-context-resolution.server";
import {
  toOrganizationUnitContext,
  toTeamContext,
  toTenantContext,
} from "./operating-context.mappers";
import { verifyProjectSelection } from "./operating-context.resolution.contract";
import { resolveConsolidationScope } from "./resolve-consolidation-scope.server";
import {
  loadActorMemberships,
  resolveGrantScope,
} from "./resolve-grant-scope.server";
import { resolveLegalEntityContext } from "./resolve-legal-entity-context.server";

function resolveTeamContext(input: {
  readonly organizationRow: {
    readonly type: string;
  } | null;
  readonly organizationUnit: ReturnType<
    typeof toOrganizationUnitContext
  > | null;
}): TeamContext | null {
  if (
    !(
      input.organizationUnit &&
      input.organizationRow &&
      isTeamOrganizationRow(input.organizationRow)
    )
  ) {
    return null;
  }

  return toTeamContext(input.organizationUnit);
}

export interface ResolveOperatingContextInput {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly db?: AfendaDatabase;
  readonly memberships?: readonly MembershipContract[];
  readonly selection: OperatingContextSelection;
}

/**
 * Server-side operating context resolver — Step 7 §561–571.
 * Client-provided slugs/IDs are selection hints only — always verified here.
 * Registry: `operating-context-resolver-registry.ts`.
 */
export async function resolveOperatingContext(
  input: ResolveOperatingContextInput
): Promise<OperatingContextResult> {
  const db = input.db;
  const tenantSlug = input.selection.tenantSlug;
  const tenantRow = await findTenantBySlug(tenantSlug, db);

  if (!tenantRow) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: {
        code: "TENANT_NOT_FOUND",
        userMessage: "Workspace tenant was not found.",
      },
    });
  }

  if (!isTenantOperational(tenantRow)) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: {
        code: "TENANT_NOT_OPERATIONAL",
        userMessage:
          getTenantAccessBlockReason(tenantRow.status) ??
          "Workspace tenant is not available.",
      },
    });
  }

  const projectSelectionError = verifyProjectSelection(input.selection);
  if (projectSelectionError) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: projectSelectionError,
    });
  }

  const tenant = toTenantContext(tenantRow);
  const memberships =
    input.memberships ??
    (await loadActorMemberships({
      actorUserId: input.actorUserId,
      tenantId: tenant.tenantId,
      ...(db === undefined ? {} : { db }),
    }));

  const legalEntityResult = await resolveLegalEntityContext({
    tenant,
    memberships,
    selection: {
      companySlug: input.selection.companySlug ?? null,
      companyId: input.selection.companyId ?? null,
    },
    ...(db === undefined ? {} : { db }),
  });

  if (!legalEntityResult.ok) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: legalEntityResult.error,
    });
  }

  const { entityGroup, legalEntity } = legalEntityResult.value;

  const organizationSlug = input.selection.organizationSlug?.trim() || null;
  const organizationIdHint = input.selection.organizationId?.trim() || null;
  let organizationRow = organizationSlug
    ? await findOrganizationByCompanyAndSlug(
        legalEntity.companyId,
        organizationSlug,
        db
      )
    : null;

  if (!organizationRow && organizationIdHint) {
    organizationRow = await findOrganizationById(organizationIdHint, db);
    if (!organizationRow) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "ORGANIZATION_NOT_FOUND",
          userMessage:
            "Selected organization unit was not found in this legal entity.",
        },
      });
    }
  }

  if (organizationSlug && !organizationRow) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: {
        code: "ORGANIZATION_NOT_FOUND",
        userMessage:
          "Selected organization unit was not found in this legal entity.",
      },
    });
  }

  if (organizationRow) {
    if (organizationRow.tenantId !== tenant.tenantId) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "ORGANIZATION_SCOPE_MISMATCH",
          userMessage: "Organization unit does not belong to this tenant.",
        },
      });
    }

    if (organizationRow.companyId !== legalEntity.companyId) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "ORGANIZATION_SCOPE_MISMATCH",
          userMessage:
            "Organization unit does not belong to the selected legal entity.",
        },
      });
    }

    if (organizationRow.status !== "active") {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "ORGANIZATION_NOT_OPERATIONAL",
          userMessage:
            ORGANIZATION_ACCESS_BLOCK_REASON[organizationRow.status] ??
            "Organization unit is not available.",
        },
      });
    }
  }

  const teamIdHint = input.selection.teamId?.trim() || null;
  if (teamIdHint && !organizationRow) {
    const teamRow = await findTeamById(teamIdHint, db);
    if (!teamRow) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "TEAM_NOT_FOUND",
          userMessage: "Selected team was not found.",
        },
      });
    }

    if (teamRow.tenantId !== tenant.tenantId) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "TEAM_SCOPE_MISMATCH",
          userMessage: "Team does not belong to this tenant.",
        },
      });
    }

    if (teamRow.companyId !== legalEntity.companyId) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "TEAM_SCOPE_MISMATCH",
          userMessage: "Team does not belong to the selected legal entity.",
        },
      });
    }

    if (teamRow.status !== "active") {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "ORGANIZATION_NOT_OPERATIONAL",
          userMessage:
            ORGANIZATION_ACCESS_BLOCK_REASON[teamRow.status] ??
            "Team is not available.",
        },
      });
    }

    organizationRow = teamRow;
  }

  const organizationId = organizationRow?.id ?? null;
  const organizationUnit = organizationRow
    ? toOrganizationUnitContext(organizationRow)
    : null;

  const team = resolveTeamContext({
    organizationRow,
    organizationUnit,
  });

  if (teamIdHint && !team) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: {
        code: "TEAM_SCOPE_MISMATCH",
        userMessage: "Selected team is not allowed in this workspace scope.",
      },
    });
  }

  const surfaceSelection = input.selection.surfaceId?.trim() || null;
  if (surfaceSelection && !toSurfaceContext(surfaceSelection)) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: {
        code: "INVALID_SURFACE_ID",
        userMessage: "Surface identifier is not valid.",
      },
    });
  }

  const workflowSelection = input.selection.workflowId?.trim() || null;
  if (
    workflowSelection &&
    !toWorkflowContext({ workflowId: workflowSelection })
  ) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: {
        code: "INVALID_WORKFLOW_ID",
        userMessage: "Workflow identifier is not valid.",
      },
    });
  }

  const workspace: WorkspaceContext = {
    tenantId: tenant.tenantId,
    companyId: legalEntity.companyId,
    organizationId,
    projectId: null,
  };

  const grantScopeResult = await resolveGrantScope({
    actorUserId: input.actorUserId,
    tenantId: tenant.tenantId,
    companyId: legalEntity.companyId,
    organizationId,
    entityGroupId: entityGroup?.entityGroupId ?? null,
    teamId: team?.teamId ?? null,
    projectId: workspace.projectId,
    memberships,
    ...(db === undefined ? {} : { db }),
  });

  if (!grantScopeResult.ok) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: grantScopeResult.error,
    });
  }

  const { permissionScope } = grantScopeResult.value;

  const reportingDate = new Date().toISOString().slice(0, 10);
  const { consolidationScope, ownershipInterests } =
    await resolveConsolidationScope({
      tenantId: tenant.tenantId,
      entityGroup,
      reportingDate,
      ...(db === undefined ? {} : { db }),
    });

  const operatingContext: OperatingContext = {
    actor: { userId: input.actorUserId },
    correlationId: input.correlationId,
    tenant,
    entityGroup,
    legalEntity,
    ownershipInterests,
    organizationUnit,
    team,
    project: null,
    workspace,
    permissionScope,
    consolidationScope,
    surface: toSurfaceContext(surfaceSelection),
    workflow: toWorkflowContext({
      workflowId: workflowSelection,
      surfaceId: surfaceSelection,
    }),
  };

  logOperatingContextResolution({
    correlationId: input.correlationId,
    outcome: "resolved",
    tenantSlug,
  });

  return ok(operatingContext);
}
