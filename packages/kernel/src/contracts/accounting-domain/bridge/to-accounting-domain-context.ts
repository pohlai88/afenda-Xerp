import type { AccountingReadinessContext } from "../../../context/accounting-readiness.contract.js";
import type { AccountingDomainWireContext } from "../accounting-domain-wire-context.contract.js";

/**
 * Maps kernel accounting-readiness context to the domain wire vocabulary.
 * Lives in kernel — no separate @afenda/accounting package (ADR-0020).
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
