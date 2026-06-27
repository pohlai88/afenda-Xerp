import type { ApplicationShellAllowedContextOptions } from "@afenda/appshell";

import {
  CONTEXT_SWITCH_COPY,
  type ContextSwitchCopyContract,
} from "./context-switch.copy.contract";

export interface ContextSwitchPresentation {
  readonly copy: ContextSwitchCopyContract;
  readonly shouldRender: boolean;
}

export function resolveContextSwitchPresentation(
  allowedOptions: ApplicationShellAllowedContextOptions,
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
