import type { IcSettlementMethod } from "./ic-settlement-method.contract.js";

/**
 * Serializable intercompany domain wire slice — authority fields only.
 * CompanyId and CustomerId remain on kernel business-reference authority (PAS-001B Rule 2).
 */
export interface IntercompanyDomainWireContext {
  readonly bilateralBillingEnabled: boolean;
  readonly companyId: string;
  readonly defaultIcSettlementMethod: IcSettlementMethod;
  readonly icMatchingEnabled: boolean;
  readonly tenantId: string;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _IntercompanyDomainWireSerializable =
  AssertJsonSerializable<IntercompanyDomainWireContext>;

export type assertIntercompanyDomainWireContextJsonSerializable =
  _IntercompanyDomainWireSerializable extends true ? true : never;
