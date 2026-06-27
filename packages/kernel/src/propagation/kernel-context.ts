import { AsyncLocalStorage } from "node:async_hooks";

import type { KernelContextFrame } from "./kernel-context-frame.contract.js";

const storage = new AsyncLocalStorage<KernelContextFrame>();

function cloneFrame(frame: KernelContextFrame): KernelContextFrame {
  return {
    correlationId: frame.correlationId,
    executionContext: { ...frame.executionContext },
    tenantId: frame.tenantId,
  };
}

export const kernelContext = {
  run<T>(frame: KernelContextFrame, fn: () => T): T {
    return storage.run(frame, fn);
  },

  get(): KernelContextFrame | null {
    return storage.getStore() ?? null;
  },

  fork<T>(overrides: Partial<KernelContextFrame>, fn: () => T): T {
    const current = storage.getStore();
    if (current === undefined) {
      throw new Error(
        "kernelContext.fork requires an active frame — call run() first."
      );
    }

    const next: KernelContextFrame = {
      ...cloneFrame(current),
      ...overrides,
      executionContext: overrides.executionContext ?? {
        ...current.executionContext,
      },
    };

    return storage.run(next, fn);
  },
} as const;
