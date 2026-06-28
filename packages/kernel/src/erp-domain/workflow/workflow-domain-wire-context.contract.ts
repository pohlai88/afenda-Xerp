import type { TaskPriority } from "./task-priority.contract.js";

export interface WorkflowDomainWireContext {
  readonly companyId: string;
  readonly defaultTaskPriority: TaskPriority;
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

type _WorkflowDomainWireSerializable =
  AssertJsonSerializable<WorkflowDomainWireContext>;

export type assertWorkflowDomainWireContextJsonSerializable =
  _WorkflowDomainWireSerializable extends true ? true : never;
