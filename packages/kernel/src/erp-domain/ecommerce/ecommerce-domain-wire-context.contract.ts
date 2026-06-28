import type { ChannelType } from "./channel-type.contract.js";

/**
 * Serializable ecommerce domain wire slice — authority fields only.
 * CustomerId remains on kernel business-reference authority (PAS-001B Rule 2).
 */
export interface EcommerceDomainWireContext {
  readonly companyId: string;
  readonly defaultChannelType: ChannelType;
  readonly defaultCustomerId: string | null;
  readonly guestCheckoutEnabled: boolean;
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

type _EcommerceDomainWireSerializable =
  AssertJsonSerializable<EcommerceDomainWireContext>;

export type assertEcommerceDomainWireContextJsonSerializable =
  _EcommerceDomainWireSerializable extends true ? true : never;
