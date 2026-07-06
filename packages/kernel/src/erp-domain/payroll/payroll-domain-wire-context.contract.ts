import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { PayFrequency } from "./pay-frequency.contract.js";

export interface PayrollDomainWireContext {
  readonly companyId: string;
  readonly defaultPayFrequency: PayFrequency;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _PayrollDomainWireSerializable =
  AssertJsonSerializable<PayrollDomainWireContext>;

export type assertPayrollDomainWireContextJsonSerializable =
  _PayrollDomainWireSerializable extends true ? true : never;
