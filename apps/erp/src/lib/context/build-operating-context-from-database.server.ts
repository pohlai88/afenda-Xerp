import type { AfendaAuthSession } from "@afenda/auth";
import {
  findActiveCompanyMembershipForUser,
  findCompanyById,
  findTenantById,
} from "@afenda/database";
import {
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  err,
  type OperatingContext,
  type OperatingContextError,
  type OperatingContextResult,
  type OperatingContextWireContext,
  ok,
  parseUnknownOperatingContext,
} from "@afenda/kernel";
import {
  mapDbLegalEntityCompanyTypeToKernelWire,
  toTenantContext,
} from "./operating-context.mappers";
import { parseActiveWorkspaceSelection } from "./parse-active-workspace-selection";

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

  const membershipRow = await findActiveCompanyMembershipForUser({
    userId: platformUserId,
    companyId: companyRow.id,
  });

  if (membershipRow === null) {
    return err({
      code: "MEMBERSHIP_DENIED",
      userMessage:
        "You do not have an active membership for the selected company.",
    } satisfies OperatingContextError);
  }

  const tenant = toTenantContext(tenantRow);
  const legalEntityMapping = mapDbLegalEntityCompanyTypeToKernelWire(
    companyRow.companyType
  );

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
    entityGroup: null,
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
    ownershipInterests: [],
    organizationUnit: null,
    team: null,
    project: null,
    workspace: {
      tenantId: tenantRow.enterpriseId,
      companyId: companyRow.enterpriseId,
      organizationId: null,
      projectId: null,
    },
    permissionScope: {
      grantScopeType: membershipRow.scopeType,
      tenantId: tenantRow.enterpriseId,
      entityGroupId: companyRow.entityGroupEnterpriseId,
      companyId: companyRow.enterpriseId,
      organizationId: null,
      teamId: null,
      projectId: null,
      membershipId: membershipRow.membershipEnterpriseId,
      roleId: membershipRow.roleEnterpriseId,
      elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
    },
    consolidationScope: null,
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
