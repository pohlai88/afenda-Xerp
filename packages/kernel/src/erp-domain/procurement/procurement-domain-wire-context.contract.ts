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

type _ProcurementDomainWireSerializable =
  AssertJsonSerializable<ProcurementDomainWireContext>;

export type assertProcurementDomainWireContextJsonSerializable =
  _ProcurementDomainWireSerializable extends true ? true : never;
