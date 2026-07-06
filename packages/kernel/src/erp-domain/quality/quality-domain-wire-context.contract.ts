import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { InspectionType } from "./inspection-type.contract.js";

export interface QualityDomainWireContext {
  readonly companyId: string;
  readonly defaultInspectionType: InspectionType;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _QualityDomainWireSerializable =
  AssertJsonSerializable<QualityDomainWireContext>;

export type assertQualityDomainWireContextJsonSerializable =
  _QualityDomainWireSerializable extends true ? true : never;
