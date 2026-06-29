export interface ContextSwitchCopyContract {
  readonly menuLabel: string;
  readonly pendingTriggerLabel: string;
  readonly triggerLabel: string;
}

export const CONTEXT_SWITCH_COPY = {
  menuLabel: "Switch workspace",
  triggerLabel: "Switch workspace context",
  pendingTriggerLabel: "Switching workspace context…",
} as const satisfies ContextSwitchCopyContract;
