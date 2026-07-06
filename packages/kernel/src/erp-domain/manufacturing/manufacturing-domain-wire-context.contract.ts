import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { CapacityPlanningMethod } from "./capacity-planning-method.contract.js";

export interface ManufacturingDomainWireContext {
  readonly companyId: string;
  readonly defaultCapacityPlanningMethod: CapacityPlanningMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _ManufacturingDomainWireSerializable =
  AssertJsonSerializable<ManufacturingDomainWireContext>;

export type assertManufacturingDomainWireContextJsonSerializable =
  _ManufacturingDomainWireSerializable extends true ? true : never;
