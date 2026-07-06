import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { TransportMode } from "./transport-mode.contract.js";

export interface SupplyChainDomainWireContext {
  readonly companyId: string;
  readonly defaultTransportMode: TransportMode;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _SupplyChainDomainWireSerializable =
  AssertJsonSerializable<SupplyChainDomainWireContext>;

export type assertSupplyChainDomainWireContextJsonSerializable =
  _SupplyChainDomainWireSerializable extends true ? true : never;
