import type {
  AccountingDomainWireContext,
  LegalEntityContext,
  OperatingContext,
  OrganizationUnitContext,
} from "@afenda/kernel";

import type { AccountingReadinessContext } from "./accounting-readiness-context.types.js";

import { deriveConsolidationScopeContext } from "./consolidation-scope-resolution.server.js";

/**
 * ERP accounting-readiness projection — maps resolved operating context to
 * authority fields. Currency fallback and reporting-date defaults belong here,
 * not in kernel vocabulary.
 */
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

/**
 * Maps kernel accounting-readiness context to accounting-domain wire vocabulary.
 * Relocated from @afenda/kernel (slice K1).
 */
export function toAccountingDomainContext(
  readiness: AccountingReadinessContext
): AccountingDomainWireContext {
  const { legalEntity, entityGroup, organizationUnit } = readiness;

  return {
    tenantId: legalEntity.tenantId,
    companyId: legalEntity.companyId,
    baseCurrency: readiness.baseCurrency,
    reportingCurrency: readiness.reportingCurrency,
    entityGroupId: entityGroup?.entityGroupId ?? null,
    organizationUnitId: organizationUnit?.organizationUnitId ?? null,
    fiscalCalendarId: legalEntity.fiscalCalendarId,
    companyType: legalEntity.companyType,
    countryCode: legalEntity.countryCode,
  };
}

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
