import type { InspectionType } from "./inspection-type.contract.js";

export interface QualityDomainWireContext {
  readonly companyId: string;
  readonly defaultInspectionType: InspectionType;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? { [K in keyof T]: AssertJsonSerializable<T[K]> } extends Record<
          keyof T,
          true
        >
        ? true
        : false
      : false;

type _QualityDomainWireSerializable =
  AssertJsonSerializable<QualityDomainWireContext>;

export type assertQualityDomainWireContextJsonSerializable =
  _QualityDomainWireSerializable extends true ? true : never;
