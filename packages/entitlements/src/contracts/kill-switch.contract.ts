import type { KillSwitchKey } from "./shared.contract";

export type KillSwitchSeverity = "standard" | "urgent" | "critical";

export interface KillSwitchContract {
  readonly activatedAt: string | null;
  readonly activatedBy: string | null;
  readonly active: boolean;
  readonly key: KillSwitchKey;
  readonly reason: string;
  readonly severity: KillSwitchSeverity;
}
