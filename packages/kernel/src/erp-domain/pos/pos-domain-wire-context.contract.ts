import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { TenderType } from "./tender-type.contract.js";

export interface PosDomainWireContext {
  readonly companyId: string;
  readonly defaultTenderType: TenderType;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _PosDomainWireSerializable = AssertJsonSerializable<PosDomainWireContext>;

export type assertPosDomainWireContextJsonSerializable =
  _PosDomainWireSerializable extends true ? true : never;
