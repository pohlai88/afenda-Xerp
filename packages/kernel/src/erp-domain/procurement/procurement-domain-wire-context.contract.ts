import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { SourcingMethod } from "./sourcing-method.contract.js";

/**
 * Serializable procurement domain wire slice — authority fields only.
 * SupplierId remains on kernel business-reference authority (PAS-001B Rule 2).
 */
export interface ProcurementDomainWireContext {
  readonly companyId: string;
  readonly defaultSourcingMethod: SourcingMethod;
  readonly defaultSupplierId: string | null;
  readonly requisitionApprovalRequired: boolean;
  readonly tenantId: string;
}

type _ProcurementDomainWireSerializable =
  AssertJsonSerializable<ProcurementDomainWireContext>;

export type assertProcurementDomainWireContextJsonSerializable =
  _ProcurementDomainWireSerializable extends true ? true : never;
