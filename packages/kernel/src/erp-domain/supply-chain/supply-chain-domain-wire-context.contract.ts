import type { TransportMode } from "./transport-mode.contract.js";

export interface SupplyChainDomainWireContext {
  readonly companyId: string;
  readonly defaultTransportMode: TransportMode;
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

type _SupplyChainDomainWireSerializable =
  AssertJsonSerializable<SupplyChainDomainWireContext>;

export type assertSupplyChainDomainWireContextJsonSerializable =
  _SupplyChainDomainWireSerializable extends true ? true : never;
