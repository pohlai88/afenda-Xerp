import type { LegalEntityCompanyType } from "../../context/legal-entity-context.contract.js";

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

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? { [K in keyof T]: AssertJsonSerializable<T[K]> } extends Record<
          keyof T,
          true
        >
        ? true
        : false
      : false;

type _AccountingDomainWireSerializable =
  AssertJsonSerializable<AccountingDomainWireContext>;

export type assertAccountingDomainWireContextJsonSerializable =
  _AccountingDomainWireSerializable extends true ? true : never;
