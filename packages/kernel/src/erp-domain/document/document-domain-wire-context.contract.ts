import type { RetentionPolicy } from "./retention-policy.contract.js";

export interface DocumentDomainWireContext {
  readonly companyId: string;
  readonly defaultRetentionPolicy: RetentionPolicy;
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

type _DocumentDomainWireSerializable =
  AssertJsonSerializable<DocumentDomainWireContext>;

export type assertDocumentDomainWireContextJsonSerializable =
  _DocumentDomainWireSerializable extends true ? true : never;
