import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { MaintenancePriority } from "./maintenance-priority.contract.js";

export interface MaintenanceDomainWireContext {
  readonly companyId: string;
  readonly defaultMaintenancePriority: MaintenancePriority;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _MaintenanceDomainWireSerializable =
  AssertJsonSerializable<MaintenanceDomainWireContext>;

export type assertMaintenanceDomainWireContextJsonSerializable =
  _MaintenanceDomainWireSerializable extends true ? true : never;
