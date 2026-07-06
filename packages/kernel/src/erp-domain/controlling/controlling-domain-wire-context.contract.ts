import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { AllocationMethod } from "./allocation-method.contract.js";

export interface ControllingDomainWireContext {
  readonly companyId: string;
  readonly defaultAllocationMethod: AllocationMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _ControllingDomainWireSerializable =
  AssertJsonSerializable<ControllingDomainWireContext>;

export type assertControllingDomainWireContextJsonSerializable =
  _ControllingDomainWireSerializable extends true ? true : never;
