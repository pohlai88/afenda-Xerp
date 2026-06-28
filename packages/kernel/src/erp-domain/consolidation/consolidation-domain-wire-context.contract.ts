import type { ReportingCurrencyMethod } from "./reporting-currency-method.contract.js";

export interface ConsolidationDomainWireContext {
  readonly companyId: string;
  readonly defaultReportingCurrencyMethod: ReportingCurrencyMethod;
  readonly enabled: boolean;
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

type _ConsolidationDomainWireSerializable =
  AssertJsonSerializable<ConsolidationDomainWireContext>;

export type assertConsolidationDomainWireContextJsonSerializable =
  _ConsolidationDomainWireSerializable extends true ? true : never;
