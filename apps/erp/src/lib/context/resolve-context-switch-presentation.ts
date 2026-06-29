import {
  CONTEXT_SWITCH_COPY,
  type ContextSwitchCopyContract,
} from "./context-switch.copy.contract";
import type { ErpAllowedContextOptions } from "./context-switch.presentation.contract";

export interface ContextSwitchPresentation {
  readonly copy: ContextSwitchCopyContract;
  readonly shouldRender: boolean;
}

export function resolveContextSwitchPresentation(
  allowedOptions: ErpAllowedContextOptions,
  input?: { readonly isPending?: boolean }
): ContextSwitchPresentation {
  const shouldRender = allowedOptions.targets.length > 1;

  return {
    shouldRender,
    copy: {
      ...CONTEXT_SWITCH_COPY,
      triggerLabel: input?.isPending
        ? CONTEXT_SWITCH_COPY.pendingTriggerLabel
        : CONTEXT_SWITCH_COPY.triggerLabel,
    },
  };
}
