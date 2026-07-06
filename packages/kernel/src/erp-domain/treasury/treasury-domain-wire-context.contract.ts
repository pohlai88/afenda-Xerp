import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { HedgeAccountingMethod } from "./hedge-accounting-method.contract.js";

export interface TreasuryDomainWireContext {
  readonly companyId: string;
  readonly defaultHedgeAccountingMethod: HedgeAccountingMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _TreasuryDomainWireSerializable =
  AssertJsonSerializable<TreasuryDomainWireContext>;

export type assertTreasuryDomainWireContextJsonSerializable =
  _TreasuryDomainWireSerializable extends true ? true : never;
