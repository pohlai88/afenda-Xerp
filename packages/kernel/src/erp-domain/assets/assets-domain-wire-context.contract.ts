import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { DepreciationMethod } from "./depreciation-method.contract.js";

export interface AssetsDomainWireContext {
  readonly companyId: string;
  readonly defaultDepreciationMethod: DepreciationMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _AssetsDomainWireSerializable =
  AssertJsonSerializable<AssetsDomainWireContext>;

export type assertAssetsDomainWireContextJsonSerializable =
  _AssetsDomainWireSerializable extends true ? true : never;
