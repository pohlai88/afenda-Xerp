import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { RetentionPolicy } from "./retention-policy.contract.js";

export interface DocumentDomainWireContext {
  readonly companyId: string;
  readonly defaultRetentionPolicy: RetentionPolicy;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _DocumentDomainWireSerializable =
  AssertJsonSerializable<DocumentDomainWireContext>;

export type assertDocumentDomainWireContextJsonSerializable =
  _DocumentDomainWireSerializable extends true ? true : never;
