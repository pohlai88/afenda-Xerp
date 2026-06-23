import {
  type AfendaDatabase,
  type CompanyLookupRow,
  findCompanyById,
  findCompanyByTenantAndSlug,
  findEntityGroupById,
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
  readonly entityGroup: EntityGroupContext | null;
  readonly legalEntity: LegalEntityContext;
}

export type ResolveLegalEntityContextResult = Result<
  ResolvedLegalEntityContext,
  OperatingContextError
>;

function resolveDefaultCompanyId(
  memberships: readonly MembershipContract[]
): string | null {
  const companyMembership = memberships.find(
    (membership) =>
      membership.scopeType === "company" && membership.companyId !== null
  );
  if (companyMembership?.companyId) {
    return companyMembership.companyId;
  }

  const organizationMembership = memberships.find(
    (membership) =>
      membership.scopeType === "organization" && membership.companyId !== null
  );

  return organizationMembership?.companyId ?? null;
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
}): Promise<Result<CompanyLookupRow, OperatingContextError>> {
  const companySlug = input.companySlug?.trim() || null;
  const companyIdHint = input.companyIdHint?.trim() || null;

  let companyRow = companySlug
    ? await findCompanyByTenantAndSlug(
        input.tenant.tenantId,
        companySlug,
        input.db
      )
    : null;

  if (!companyRow && companyIdHint) {
    companyRow = await findCompanyById(companyIdHint, input.db);
    if (companyRow && companyRow.tenantId !== input.tenant.tenantId) {
      return err(companyScopeMismatchError());
    }
  }

  if (companySlug && !companyRow) {
    return err(companyNotFoundError());
  }

  if (!companyRow) {
    const defaultCompanyId = resolveDefaultCompanyId(input.memberships);
    if (!defaultCompanyId) {
      return err(missingLegalEntitySelectionError());
    }

    companyRow = await findCompanyById(defaultCompanyId, input.db);
    if (!companyRow || companyRow.tenantId !== input.tenant.tenantId) {
      return err(companyScopeMismatchError());
    }
  }

  if (companyRow.tenantId !== input.tenant.tenantId) {
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
    memberships: input.memberships,
    companySlug: input.selection.companySlug ?? null,
    companyIdHint: input.selection.companyId ?? null,
    ...(input.db === undefined ? {} : { db: input.db }),
  });

  if (!companyResult.ok) {
    return companyResult;
  }

  const legalEntity = toLegalEntityContext(companyResult.value);
  const entityGroupRow = legalEntity.entityGroupId
    ? await findEntityGroupById(legalEntity.entityGroupId, input.db)
    : null;

  const entityGroupBoundaryError = verifyEntityGroupBoundary({
    entityGroupId: legalEntity.entityGroupId,
    entityGroupRow,
    tenantId: input.tenant.tenantId,
  });

  if (entityGroupBoundaryError) {
    return err(entityGroupBoundaryError);
  }

  return ok({
    legalEntity,
    entityGroup: entityGroupRow ? toEntityGroupContext(entityGroupRow) : null,
  });
}
