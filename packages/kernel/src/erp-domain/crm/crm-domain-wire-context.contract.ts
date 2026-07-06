import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { AccountTier } from "./account-tier.contract.js";

export interface CrmDomainWireContext {
  readonly companyId: string;
  readonly defaultAccountTier: AccountTier;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _CrmDomainWireSerializable = AssertJsonSerializable<CrmDomainWireContext>;

export type assertCrmDomainWireContextJsonSerializable =
  _CrmDomainWireSerializable extends true ? true : never;
