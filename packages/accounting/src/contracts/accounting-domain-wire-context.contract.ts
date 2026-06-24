import type { LegalEntityCompanyType } from "@afenda/kernel";

/**
 * Serializable accounting domain wire slice — authority fields only.
 * No journal lines, balances, posting amounts, or elimination arithmetic.
 */
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
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _AccountingDomainWireSerializable =
  AssertJsonSerializable<AccountingDomainWireContext>;

/** Compile-time guard — domain wire context must remain JSON-serializable. */
export type assertAccountingDomainWireContextJsonSerializable =
  _AccountingDomainWireSerializable extends true ? true : never;
