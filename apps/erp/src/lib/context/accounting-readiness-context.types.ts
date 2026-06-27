import type {
  ConsolidationScopeContext,
  EntityGroupContext,
  LegalEntityContext,
  OrganizationUnitContext,
  OwnershipInterestContext,
} from "@afenda/kernel";

/**
 * ERP accounting-readiness operating-context slice — projected from resolved
 * `OperatingContext` at the trust boundary (PAS-001 §4.4 gate layer).
 */
export interface AccountingReadinessContext {
  readonly baseCurrency: string;
  readonly consolidationScope: ConsolidationScopeContext | null;
  readonly entityGroup: EntityGroupContext | null;
  readonly legalEntity: LegalEntityContext;
  readonly organizationUnit: OrganizationUnitContext | null;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly reportingCurrency: string;
}

/** Wire-format alias — plain string ids, JSON-serializable at rest. */
export type AccountingReadinessWireContext = AccountingReadinessContext;

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

type _AccountingReadinessWireSerializable =
  AssertJsonSerializable<AccountingReadinessWireContext>;

/**
 * Compile-time guard — accounting readiness wire context must remain JSON-serializable.
 * No runtime overhead.
 */
export type assertAccountingReadinessContextJsonSerializable =
  _AccountingReadinessWireSerializable extends true ? true : never;
