import type { AccountingReadinessContext } from "@afenda/kernel";

import type { AccountingDomainWireContext } from "../contracts/accounting-domain-wire-context.contract.js";

/**
 * Maps kernel accounting-readiness context to the domain wire vocabulary.
 * One-way bridge — kernel never imports @afenda/accounting.
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
