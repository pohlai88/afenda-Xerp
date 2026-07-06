import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
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

type _IntercompanyDomainWireSerializable =
  AssertJsonSerializable<IntercompanyDomainWireContext>;

export type assertIntercompanyDomainWireContextJsonSerializable =
  _IntercompanyDomainWireSerializable extends true ? true : never;
