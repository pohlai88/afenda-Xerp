import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { TaxCalculationMethod } from "./tax-calculation-method.contract.js";

export interface TaxDomainWireContext {
  readonly companyId: string;
  readonly defaultTaxCalculationMethod: TaxCalculationMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _TaxDomainWireSerializable = AssertJsonSerializable<TaxDomainWireContext>;

export type assertTaxDomainWireContextJsonSerializable =
  _TaxDomainWireSerializable extends true ? true : never;
