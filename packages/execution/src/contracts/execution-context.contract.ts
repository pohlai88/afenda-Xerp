// biome-ignore-all lint/performance/noBarrelFile: re-exports kernel execution context for execution spine consumers.

export {
  assertExecutionContext,
  createExecutionContext,
  createExecutionId,
  EXECUTION_CONTEXT_SOURCES,
  type ExecutionContext,
  type ExecutionContextInput,
  type ExecutionContextSource,
} from "@afenda/kernel";
