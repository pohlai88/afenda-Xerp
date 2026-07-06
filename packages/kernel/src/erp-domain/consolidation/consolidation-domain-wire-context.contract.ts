import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { ReportingCurrencyMethod } from "./reporting-currency-method.contract.js";

export interface ConsolidationDomainWireContext {
  readonly companyId: string;
  readonly defaultReportingCurrencyMethod: ReportingCurrencyMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _ConsolidationDomainWireSerializable =
  AssertJsonSerializable<ConsolidationDomainWireContext>;

export type assertConsolidationDomainWireContextJsonSerializable =
  _ConsolidationDomainWireSerializable extends true ? true : never;
