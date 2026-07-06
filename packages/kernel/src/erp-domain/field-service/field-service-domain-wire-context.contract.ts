import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { DispatchPriority } from "./dispatch-priority.contract.js";

export interface FieldServiceDomainWireContext {
  readonly companyId: string;
  readonly defaultDispatchPriority: DispatchPriority;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _FieldServiceDomainWireSerializable =
  AssertJsonSerializable<FieldServiceDomainWireContext>;

export type assertFieldServiceDomainWireContextJsonSerializable =
  _FieldServiceDomainWireSerializable extends true ? true : never;
