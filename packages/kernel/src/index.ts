/** Platform kernel and shared contracts — placeholder export for TIP-001 foundation. */

export const PACKAGE_NAME = "@afenda/kernel" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  assertExecutionContext,
  createExecutionContext,
  createExecutionId,
  EXECUTION_CONTEXT_SOURCES,
  type ExecutionContext,
  type ExecutionContextInput,
  type ExecutionContextSource,
} from "./contracts/execution-context.contract.js";
