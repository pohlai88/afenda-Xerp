import {
  type AfendaDatabase,
  findOrganizationByCompanyAndSlug,
  findOrganizationById,
  findProjectByEnterpriseId,
  findProjectById,
  findProjectByTenantAndSlug,
  findTeamById,
  findTenantBySlug,
  getTenantAccessBlockReason,
  isTeamOrganizationRow,
  isTenantOperational,
} from "@afenda/database";
import {
  brandPermissionScopeContextFromUnknownWire,
  type OperatingContext,
  type OperatingContextResult,
  type OperatingContextSelection,
  ok,
  type TeamContext,
  tryParseCanonicalId,
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
import { verifyProjectBoundary } from "./operating-context.resolution.contract";
import { resolveConsolidationScope } from "./resolve-consolidation-scope.server";
import {
  loadActorMemberships,
  resolveGrantScope,
} from "./resolve-grant-scope.server";
import { resolveLegalEntityContext } from "./resolve-legal-entity-context.server";
import { toSurfaceContext } from "./surface-context.resolution.server.js";
import { toProjectContext } from "./to-project-context";
import { toWorkflowContext } from "./workflow-context.resolution.server.js";

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

async function resolveProjectLookupRow(input: {
  readonly db: AfendaDatabase | undefined;
  readonly projectIdHint: string | null;
  readonly projectSlug: string | null;
  readonly tenantPk: string;
}): Promise<Awaited<ReturnType<typeof findProjectByTenantAndSlug>> | null> {
  const db = input.db;

  if (input.projectSlug) {
    return findProjectByTenantAndSlug(input.tenantPk, input.projectSlug, db);
  }

  if (!input.projectIdHint) {
    return null;
  }

  if (tryParseCanonicalId(input.projectIdHint, "project") !== null) {
    return findProjectByEnterpriseId(input.projectIdHint, db);
  }

  return findProjectById(input.projectIdHint, db);
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

  const tenant = toTenantContext(tenantRow);
  const memberships =
    input.memberships ??
    (await loadActorMemberships({
      actorUserId: input.actorUserId,
      tenantId: tenantRow.id,
      ...(db === undefined ? {} : { db }),
    }));

  const legalEntityResult = await resolveLegalEntityContext({
    tenant,
    tenantPk: tenantRow.id,
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

  const { companyPk, entityGroup, entityGroupPk, legalEntity } =
    legalEntityResult.value;

  const organizationSlug = input.selection.organizationSlug?.trim() || null;
  const organizationIdHint = input.selection.organizationId?.trim() || null;
  let organizationRow = organizationSlug
    ? await findOrganizationByCompanyAndSlug(companyPk, organizationSlug, db)
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
    if (organizationRow.tenantId !== tenantRow.id) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "ORGANIZATION_SCOPE_MISMATCH",
          userMessage: "Organization unit does not belong to this tenant.",
        },
      });
    }

    if (organizationRow.companyId !== companyPk) {
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

    if (teamRow.tenantId !== tenantRow.id) {
      return denyOperatingContext({
        correlationId: input.correlationId,
        tenantSlug,
        error: {
          code: "TEAM_SCOPE_MISMATCH",
          userMessage: "Team does not belong to this tenant.",
        },
      });
    }

    if (teamRow.companyId !== companyPk) {
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
    ? toOrganizationUnitContext(organizationRow, tenant.tenantId)
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

  const projectSlug = input.selection.projectSlug?.trim() || null;
  const projectIdHint = input.selection.projectId?.trim() || null;
  const projectRow = await resolveProjectLookupRow({
    tenantPk: tenantRow.id,
    projectSlug,
    projectIdHint,
    db,
  });

  const projectBoundaryError = verifyProjectBoundary({
    tenantId: tenantRow.id,
    companyId: companyPk,
    organizationId,
    projectSlug,
    projectIdHint,
    projectRow,
  });

  if (projectBoundaryError) {
    return denyOperatingContext({
      correlationId: input.correlationId,
      tenantSlug,
      error: projectBoundaryError,
    });
  }

  const project = projectRow
    ? toProjectContext(projectRow, tenant.tenantId)
    : null;

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
    projectId: projectRow?.id ?? null,
  };

  const grantScopeResult = await resolveGrantScope({
    actorUserId: input.actorUserId,
    tenantId: tenant.tenantId,
    companyId: companyPk,
    organizationId,
    entityGroupId: entityGroupPk,
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

  const { permissionScope: resolvedPermissionScope } = grantScopeResult.value;

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
    project,
    workspace,
    permissionScope: brandPermissionScopeContextFromUnknownWire({
      ...resolvedPermissionScope,
      tenantId: tenant.tenantId,
      companyId: legalEntity.companyId,
      entityGroupId: entityGroup?.entityGroupId ?? null,
      organizationId: organizationUnit?.organizationUnitId ?? null,
      teamId: team?.teamId ?? null,
      projectId: project?.projectId ?? null,
    }),
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
