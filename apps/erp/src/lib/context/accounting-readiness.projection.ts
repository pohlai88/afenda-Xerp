import {
  type AccountingReadinessContext,
  deriveConsolidationScopeContext,
  type LegalEntityContext,
  type OperatingContext,
  type OrganizationUnitContext,
} from "@afenda/kernel";

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
