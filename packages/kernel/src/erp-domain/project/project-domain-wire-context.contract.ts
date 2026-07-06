import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { BillingMethod } from "./billing-method.contract.js";

export interface ProjectDomainWireContext {
  readonly companyId: string;
  readonly defaultBillingMethod: BillingMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _ProjectDomainWireSerializable =
  AssertJsonSerializable<ProjectDomainWireContext>;

export type assertProjectDomainWireContextJsonSerializable =
  _ProjectDomainWireSerializable extends true ? true : never;
