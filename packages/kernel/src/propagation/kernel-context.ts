import { AsyncLocalStorage } from "node:async_hooks";

import type { ExecutionContext } from "../contracts/execution-context.contract.js";
import type { KernelContextFrame } from "./kernel-context-frame.contract.js";

const storage = new AsyncLocalStorage<KernelContextFrame>();

type KernelContextFrameForkOverrides = Omit<
  Partial<KernelContextFrame>,
  "executionContext"
> & {
  readonly executionContext?: Partial<ExecutionContext>;
};

function omitUndefinedKeys<T extends object>(value: Partial<T>): Partial<T> {
  const result: Partial<T> = {};

  for (const key of Object.keys(value) as (keyof T)[]) {
    const entry = value[key];
    if (entry !== undefined) {
      result[key] = entry;
    }
  }

  return result;
}

function cloneFrame(frame: KernelContextFrame): KernelContextFrame {
  return {
    correlationId: frame.correlationId,
    executionContext: { ...frame.executionContext },
    tenantId: frame.tenantId,
  };
}

function mergeExecutionContextPartial(
  base: ExecutionContext,
  partial: Partial<ExecutionContext> | undefined
): ExecutionContext {
  if (partial === undefined) {
    return { ...base };
  }

  return {
    ...base,
    ...omitUndefinedKeys(partial),
  };
}

export const kernelContext = {
  run<T>(frame: KernelContextFrame, fn: () => T): T {
    return storage.run(cloneFrame(frame), fn);
  },

  get(): KernelContextFrame | null {
    return storage.getStore() ?? null;
  },

  fork<T>(overrides: KernelContextFrameForkOverrides, fn: () => T): T {
    const current = storage.getStore();
    if (current === undefined) {
      throw new Error(
        "kernelContext.fork requires an active frame — call run() first."
      );
    }

    const frameOverrides = omitUndefinedKeys(overrides);
    const next: KernelContextFrame = {
      ...cloneFrame(current),
      ...frameOverrides,
      executionContext: mergeExecutionContextPartial(
        current.executionContext,
        overrides.executionContext
      ),
    };

    return storage.run(next, fn);
  },
} as const;
