import type { LegalEntityCompanyType } from "../../context/legal-entity-context.contract.js";
import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";

export interface AccountingDomainWireContext {
  readonly baseCurrency: string;
  readonly companyId: string;
  readonly companyType: LegalEntityCompanyType;
  readonly countryCode: string;
  readonly entityGroupId: string | null;
  readonly fiscalCalendarId: string | null;
  readonly organizationUnitId: string | null;
  readonly reportingCurrency: string;
  readonly tenantId: string;
}

type _AccountingDomainWireSerializable =
  AssertJsonSerializable<AccountingDomainWireContext>;

export type assertAccountingDomainWireContextJsonSerializable =
  _AccountingDomainWireSerializable extends true ? true : never;
