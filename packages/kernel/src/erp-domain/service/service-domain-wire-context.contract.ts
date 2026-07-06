import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { ServiceLevel } from "./service-level.contract.js";

export interface ServiceDomainWireContext {
  readonly companyId: string;
  readonly defaultServiceLevel: ServiceLevel;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _ServiceDomainWireSerializable =
  AssertJsonSerializable<ServiceDomainWireContext>;

export type assertServiceDomainWireContextJsonSerializable =
  _ServiceDomainWireSerializable extends true ? true : never;
