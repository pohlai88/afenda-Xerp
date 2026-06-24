import type { ConsolidationScopeContext } from "./consolidation-scope-context.contract.js";
import { deriveConsolidationScopeContext } from "./consolidation-scope-resolution.server.js";
import type { EntityGroupContext } from "./entity-group-context.contract.js";
import type { LegalEntityContext } from "./legal-entity-context.contract.js";
import type { OperatingContext } from "./operating-context.contract.js";
import type { OrganizationUnitContext } from "./organization-unit-context.contract.js";
import type { OwnershipInterestContext } from "./ownership-interest-context.contract.js";

/**
 * Serializable accounting-readiness slice — authority fields only.
 * No journals, ledgers, eliminations, or reporting arithmetic.
 */
export interface AccountingReadinessContext {
  readonly baseCurrency: string;
  readonly consolidationScope: ConsolidationScopeContext | null;
  readonly entityGroup: EntityGroupContext | null;
  readonly legalEntity: LegalEntityContext;
  readonly organizationUnit: OrganizationUnitContext | null;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly reportingCurrency: string;
}

export function resolveReportingCurrency(
  legalEntity: Pick<LegalEntityContext, "baseCurrency" | "reportingCurrency">
): string {
  return legalEntity.reportingCurrency ?? legalEntity.baseCurrency;
}

export function isCostCenterOrganizationUnit(
  organizationUnit: Pick<OrganizationUnitContext, "organizationUnitType">
): boolean {
  return organizationUnit.organizationUnitType === "cost_center";
}

/** Wire-format alias — plain string ids, JSON-serializable at rest. */
export type AccountingReadinessWireContext = AccountingReadinessContext;

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _AccountingReadinessWireSerializable =
  AssertJsonSerializable<AccountingReadinessWireContext>;

/**
 * Compile-time guard — accounting readiness wire context must remain JSON-serializable.
 * No runtime overhead.
 */
export type assertAccountingReadinessContextJsonSerializable =
  _AccountingReadinessWireSerializable extends true ? true : never;

export function toAccountingReadinessContext(
  operatingContext: OperatingContext,
  options?: { readonly reportingDate?: string }
): AccountingReadinessContext {
  const reportingDate =
    options?.reportingDate ?? new Date().toISOString().slice(0, 10);
  const consolidationScope =
    operatingContext.consolidationScope ??
    (operatingContext.entityGroup
      ? deriveConsolidationScopeContext({
          entityGroupId: operatingContext.entityGroup.entityGroupId,
          tenantId: operatingContext.tenant.tenantId,
          ownershipInterests: operatingContext.ownershipInterests,
          reportingDate,
        })
      : null);

  return {
    entityGroup: operatingContext.entityGroup,
    legalEntity: operatingContext.legalEntity,
    ownershipInterests: operatingContext.ownershipInterests,
    consolidationScope,
    organizationUnit: operatingContext.organizationUnit,
    baseCurrency: operatingContext.legalEntity.baseCurrency,
    reportingCurrency: resolveReportingCurrency(operatingContext.legalEntity),
  };
}
