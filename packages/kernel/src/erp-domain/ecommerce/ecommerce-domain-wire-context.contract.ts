import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
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

type _EcommerceDomainWireSerializable =
  AssertJsonSerializable<EcommerceDomainWireContext>;

export type assertEcommerceDomainWireContextJsonSerializable =
  _EcommerceDomainWireSerializable extends true ? true : never;
