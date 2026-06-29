import type { AfendaAuthSession } from "@afenda/auth";
import {
  findCompanyById,
  findEntityGroupById,
  findTenantById,
} from "@afenda/database";
import {
  err,
  normalizeConsolidationScopeContextForWire,
  normalizeEntityGroupContextForWire,
  normalizeOwnershipInterestContextForWire,
  type OperatingContext,
  type OperatingContextError,
  type OperatingContextResult,
  type OperatingContextWireContext,
  ok,
  parseUnknownOperatingContext,
} from "@afenda/kernel";
import { normalizePermissionScopeContextForWire } from "@afenda/permissions";

import { loadActorMemberships } from "./load-actor-memberships.server";
import {
  mapDbLegalEntityCompanyTypeToKernelWire,
  toEntityGroupContext,
  toTenantContext,
} from "./operating-context.mappers";
import { parseActiveWorkspaceSelection } from "./parse-active-workspace-selection";
import { resolveConsolidationScope } from "./resolve-consolidation-scope.server";
import { resolveGrantScope } from "./resolve-grant-scope.server";

function resolveReportingDate(effectiveFrom: string | null): string {
  if (effectiveFrom !== null && effectiveFrom.trim().length > 0) {
    return effectiveFrom.slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

/** Builds kernel operating context from auth session + database workspace lookups. */
export async function buildOperatingContextFromDatabaseSession(
  session: AfendaAuthSession
): Promise<OperatingContextResult> {
  const enterpriseUserId = session.user.enterpriseUserId;
  const platformUserId = session.user.userId;

  if (enterpriseUserId === null || platformUserId === null) {
    return err({
      code: "MEMBERSHIP_DENIED",
      userMessage:
        "Enterprise user identity is required for protected surfaces.",
    } satisfies OperatingContextError);
  }

  const workspaceSelection = parseActiveWorkspaceSelection(
    session.metadata.activeWorkspaceId
  );

  if (workspaceSelection === null) {
    return err({
      code: "MISSING_LEGAL_ENTITY_SELECTION",
      userMessage:
        "Select an active workspace before opening metadata surfaces.",
    } satisfies OperatingContextError);
  }

  const tenantRow = await findTenantById(workspaceSelection.tenantId);

  if (tenantRow === null) {
    return err({
      code: "TENANT_NOT_FOUND",
      userMessage: "The selected tenant could not be found.",
    } satisfies OperatingContextError);
  }

  if (tenantRow.status !== "active") {
    return err({
      code: "TENANT_NOT_OPERATIONAL",
      userMessage: "The selected tenant is not operational.",
    } satisfies OperatingContextError);
  }

  const companyRow = await findCompanyById(workspaceSelection.companyId);

  if (companyRow === null) {
    return err({
      code: "COMPANY_NOT_FOUND",
      userMessage: "The selected company could not be found.",
    } satisfies OperatingContextError);
  }

  if (companyRow.status !== "active") {
    return err({
      code: "COMPANY_NOT_OPERATIONAL",
      userMessage: "The selected company is not operational.",
    } satisfies OperatingContextError);
  }

  if (companyRow.tenantId !== tenantRow.id) {
    return err({
      code: "COMPANY_SCOPE_MISMATCH",
      userMessage: "The selected company does not belong to the active tenant.",
    } satisfies OperatingContextError);
  }

  const memberships = await loadActorMemberships({
    actorUserId: platformUserId,
    tenantId: tenantRow.enterpriseId,
  });

  const grantScopeResult = await resolveGrantScope({
    actorUserId: platformUserId,
    tenantId: tenantRow.enterpriseId,
    companyId: companyRow.enterpriseId,
    entityGroupId: companyRow.entityGroupEnterpriseId,
    organizationId: null,
    teamId: null,
    projectId: null,
    memberships,
  });

  if (!grantScopeResult.ok) {
    return err(grantScopeResult.error);
  }

  const permissionScopeWire = normalizePermissionScopeContextForWire(
    grantScopeResult.value.permissionScope
  );

  const tenant = toTenantContext(tenantRow);
  const legalEntityMapping = mapDbLegalEntityCompanyTypeToKernelWire(
    companyRow.companyType
  );
  const reportingDate = resolveReportingDate(companyRow.effectiveFrom);

  let entityGroupWire: OperatingContextWireContext["entityGroup"] = null;
  let ownershipInterestWire: OperatingContextWireContext["ownershipInterests"] =
    [];
  let consolidationScopeWire: OperatingContextWireContext["consolidationScope"] =
    null;

  if (companyRow.entityGroupId) {
    const entityGroupRow = await findEntityGroupById(companyRow.entityGroupId);

    if (entityGroupRow === null) {
      return err({
        code: "ENTITY_GROUP_NOT_FOUND",
        userMessage: "Corporate group for this legal entity was not found.",
      } satisfies OperatingContextError);
    }

    if (entityGroupRow.tenantId !== tenantRow.id) {
      return err({
        code: "ENTITY_GROUP_SCOPE_MISMATCH",
        userMessage: "Corporate group does not belong to this tenant.",
      } satisfies OperatingContextError);
    }

    if (entityGroupRow.status !== "active") {
      return err({
        code: "ENTITY_GROUP_NOT_OPERATIONAL",
        userMessage: "Corporate group is not available.",
      } satisfies OperatingContextError);
    }

    const entityGroupContext = toEntityGroupContext(
      entityGroupRow,
      tenantRow.enterpriseId
    );
    const consolidation = await resolveConsolidationScope({
      tenantEnterpriseId: tenantRow.enterpriseId,
      tenantPk: tenantRow.id,
      entityGroup: entityGroupContext,
      entityGroupPk: companyRow.entityGroupId,
      reportingDate,
    });

    entityGroupWire = normalizeEntityGroupContextForWire(entityGroupContext);
    ownershipInterestWire = consolidation.ownershipInterests.map((interest) =>
      normalizeOwnershipInterestContextForWire(interest)
    );
    consolidationScopeWire =
      consolidation.consolidationScope === null
        ? null
        : normalizeConsolidationScopeContextForWire(
            consolidation.consolidationScope
          );
  }

  const wire = {
    actor: { userId: enterpriseUserId },
    correlationId: session.sessionId,
    tenant: {
      tenantId: `${tenant.tenantId}`,
      slug: tenant.slug,
      displayName: tenant.displayName,
      status: tenant.status,
      ...(tenant.saasLifecyclePhase === undefined
        ? {}
        : { saasLifecyclePhase: tenant.saasLifecyclePhase }),
    },
    entityGroup: entityGroupWire,
    legalEntity: {
      tenantId: tenantRow.enterpriseId,
      entityGroupId: companyRow.entityGroupEnterpriseId,
      companyId: companyRow.enterpriseId,
      legalName: companyRow.legalName,
      displayName: companyRow.displayName,
      slug: companyRow.slug,
      companyType: legalEntityMapping.companyType,
      relationshipToHoldingCompany:
        legalEntityMapping.relationshipToHoldingCompany,
      countryCode: companyRow.countryCode,
      baseCurrency: companyRow.baseCurrency,
      reportingCurrency: null,
      fiscalCalendarId: companyRow.fiscalCalendarId,
      registrationNumber: companyRow.registrationNumber,
      taxRegistrationNumber: companyRow.taxId,
      effectiveFrom: companyRow.effectiveFrom ?? "2026-01-01",
      effectiveTo: companyRow.effectiveTo,
      status: companyRow.status,
    },
    ownershipInterests: ownershipInterestWire,
    organizationUnit: null,
    team: null,
    project: null,
    workspace: {
      tenantId: tenantRow.enterpriseId,
      companyId: companyRow.enterpriseId,
      organizationId: null,
      projectId: null,
    },
    permissionScope: permissionScopeWire,
    consolidationScope: consolidationScopeWire,
    surface: { surfaceId: "surface.metadata-workspace" },
    workflow: null,
  } satisfies OperatingContextWireContext;

  try {
    const operatingContext: OperatingContext =
      parseUnknownOperatingContext(wire);

    return ok(operatingContext);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Operating context parse failed.";

    return err({
      code: "INVALID_SELECTION",
      userMessage: message,
    } satisfies OperatingContextError);
  }
}
