import {
  type AfendaDatabase,
  type CompanyLookupRow,
  findActiveCompaniesByEntityGroupId,
  findCompanyById,
  findCompanyByTenantAndSlug,
  findEntityGroupById,
  getDb,
} from "@afenda/database";
import {
  type EntityGroupContext,
  err,
  type LegalEntityContext,
  type OperatingContextError,
  type OperatingContextSelection,
  ok,
  type Result,
  type TenantContext,
} from "@afenda/kernel";
import type { MembershipContract } from "@afenda/permissions";

import { COMPANY_ACCESS_BLOCK_REASON } from "./context-errors";
import {
  toEntityGroupContext,
  toLegalEntityContext,
} from "./operating-context.mappers";
import { verifyEntityGroupBoundary } from "./operating-context.resolution.contract";

export interface ResolvedLegalEntityContext {
  /** Internal uuid PK for database FK lookups — not branded `CompanyId`. */
  readonly companyPk: string;
  readonly entityGroup: EntityGroupContext | null;
  /** Internal uuid PK for entity group FK lookups — not branded `EntityGroupId`. */
  readonly entityGroupPk: string | null;
  readonly legalEntity: LegalEntityContext;
}

export type ResolveLegalEntityContextResult = Result<
  ResolvedLegalEntityContext,
  OperatingContextError
>;

async function resolveDefaultCompanyId(input: {
  readonly db?: AfendaDatabase;
  readonly memberships: readonly MembershipContract[];
  readonly tenantId: string;
}): Promise<string | null> {
  const companyMembership = input.memberships.find(
    (membership) =>
      membership.scopeType === "company" && membership.companyId !== null
  );
  if (companyMembership?.companyId) {
    return companyMembership.companyId;
  }

  const organizationMembership = input.memberships.find(
    (membership) =>
      membership.scopeType === "organization" && membership.companyId !== null
  );
  if (organizationMembership?.companyId) {
    return organizationMembership.companyId;
  }

  const entityGroupMembership = input.memberships.find(
    (membership) =>
      membership.scopeType === "entity_group" &&
      membership.entityGroupId !== null
  );
  if (!entityGroupMembership?.entityGroupId) {
    return null;
  }

  const db = input.db ?? getDb();

  const entityGroup = await findEntityGroupById(
    entityGroupMembership.entityGroupId,
    db
  );
  if (
    entityGroup &&
    entityGroup.tenantId === input.tenantId &&
    entityGroup.parentLegalEntityId
  ) {
    const parentCompany = await findCompanyById(
      entityGroup.parentLegalEntityId,
      db
    );
    if (
      parentCompany &&
      parentCompany.tenantId === input.tenantId &&
      parentCompany.status === "active"
    ) {
      return parentCompany.id;
    }
  }

  const activeCompanies = await findActiveCompaniesByEntityGroupId(
    entityGroupMembership.entityGroupId,
    input.tenantId,
    db
  );

  return activeCompanies[0]?.id ?? null;
}

function companyScopeMismatchError(): OperatingContextError {
  return {
    code: "COMPANY_SCOPE_MISMATCH",
    userMessage: "Legal entity does not belong to this tenant.",
  };
}

function companyNotFoundError(): OperatingContextError {
  return {
    code: "COMPANY_NOT_FOUND",
    userMessage: "Selected legal entity was not found in this tenant.",
  };
}

function missingLegalEntitySelectionError(): OperatingContextError {
  return {
    code: "MISSING_LEGAL_ENTITY_SELECTION",
    userMessage: "Select a legal entity to continue.",
  };
}

function companyNotOperationalError(status: string): OperatingContextError {
  return {
    code: "COMPANY_NOT_OPERATIONAL",
    userMessage:
      COMPANY_ACCESS_BLOCK_REASON[status] ?? "Legal entity is not available.",
  };
}

async function resolveCompanyRow(input: {
  readonly companyIdHint: string | null;
  readonly companySlug: string | null;
  readonly db?: AfendaDatabase;
  readonly memberships: readonly MembershipContract[];
  readonly tenant: TenantContext;
  readonly tenantPk: string;
}): Promise<Result<CompanyLookupRow, OperatingContextError>> {
  const companySlug = input.companySlug?.trim() || null;
  const companyIdHint = input.companyIdHint?.trim() || null;

  let companyRow = companySlug
    ? await findCompanyByTenantAndSlug(input.tenantPk, companySlug, input.db)
    : null;

  if (!companyRow && companyIdHint) {
    companyRow = await findCompanyById(companyIdHint, input.db);
    if (companyRow && companyRow.tenantId !== input.tenantPk) {
      return err(companyScopeMismatchError());
    }
  }

  if (companySlug && !companyRow) {
    return err(companyNotFoundError());
  }

  if (!companyRow) {
    const defaultCompanyId = await resolveDefaultCompanyId({
      ...(input.db === undefined ? {} : { db: input.db }),
      memberships: input.memberships,
      tenantId: input.tenantPk,
    });
    if (!defaultCompanyId) {
      return err(missingLegalEntitySelectionError());
    }

    companyRow = await findCompanyById(defaultCompanyId, input.db);
    if (!companyRow || companyRow.tenantId !== input.tenantPk) {
      return err(companyScopeMismatchError());
    }
  }

  if (companyRow.tenantId !== input.tenantPk) {
    return err(companyScopeMismatchError());
  }

  if (companyRow.status !== "active") {
    return err(companyNotOperationalError(companyRow.status));
  }

  return ok(companyRow);
}

export interface ResolveLegalEntityContextInput {
  readonly db?: AfendaDatabase;
  readonly memberships: readonly MembershipContract[];
  readonly selection: Pick<
    OperatingContextSelection,
    "companyId" | "companySlug"
  >;
  readonly tenant: TenantContext;
  /** Internal uuid PK for database FK lookups — not branded `TenantId`. */
  readonly tenantPk: string;
}

/**
 * Resolves legal entity and optional entity group for the tenant.
 * Client company slugs/IDs are selection hints only — always verified here.
 */
export async function resolveLegalEntityContext(
  input: ResolveLegalEntityContextInput
): Promise<ResolveLegalEntityContextResult> {
  const companyResult = await resolveCompanyRow({
    tenant: input.tenant,
    tenantPk: input.tenantPk,
    memberships: input.memberships,
    companySlug: input.selection.companySlug ?? null,
    companyIdHint: input.selection.companyId ?? null,
    ...(input.db === undefined ? {} : { db: input.db }),
  });

  if (!companyResult.ok) {
    return companyResult;
  }

  const legalEntity = toLegalEntityContext(
    companyResult.value,
    input.tenant.tenantId
  );
  const entityGroupUuid = companyResult.value.entityGroupId;
  const entityGroupRow = entityGroupUuid
    ? await findEntityGroupById(entityGroupUuid, input.db)
    : null;

  const entityGroupBoundaryError = verifyEntityGroupBoundary({
    entityGroupId: legalEntity.entityGroupId,
    entityGroupRow,
    tenantId: input.tenantPk,
  });

  if (entityGroupBoundaryError) {
    return err(entityGroupBoundaryError);
  }

  return ok({
    companyPk: companyResult.value.id,
    entityGroupPk: entityGroupRow?.id ?? null,
    legalEntity,
    entityGroup: entityGroupRow
      ? toEntityGroupContext(entityGroupRow, input.tenant.tenantId)
      : null,
  });
}
