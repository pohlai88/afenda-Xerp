import type { TenderType } from "./tender-type.contract.js";

export interface PosDomainWireContext {
  readonly companyId: string;
  readonly defaultTenderType: TenderType;
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

type _PosDomainWireSerializable = AssertJsonSerializable<PosDomainWireContext>;

export type assertPosDomainWireContextJsonSerializable =
  _PosDomainWireSerializable extends true ? true : never;
