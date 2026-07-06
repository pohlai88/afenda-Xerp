import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { EmploymentType } from "./employment-type.contract.js";

export interface HcmDomainWireContext {
  readonly companyId: string;
  readonly defaultEmploymentType: EmploymentType;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _HcmDomainWireSerializable = AssertJsonSerializable<HcmDomainWireContext>;

export type assertHcmDomainWireContextJsonSerializable =
  _HcmDomainWireSerializable extends true ? true : never;
