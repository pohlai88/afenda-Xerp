import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { TaskPriority } from "./task-priority.contract.js";

export interface WorkflowDomainWireContext {
  readonly companyId: string;
  readonly defaultTaskPriority: TaskPriority;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _WorkflowDomainWireSerializable =
  AssertJsonSerializable<WorkflowDomainWireContext>;

export type assertWorkflowDomainWireContextJsonSerializable =
  _WorkflowDomainWireSerializable extends true ? true : never;
