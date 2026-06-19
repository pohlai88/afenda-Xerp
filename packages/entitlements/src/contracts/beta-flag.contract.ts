import type { BetaFlagKey, JsonValue } from "./shared.contract";

export interface BetaFlagContract {
  readonly companyAllowlist: readonly string[];
  readonly enabled: boolean;
  readonly endsAt: string | null;
  readonly key: BetaFlagKey;
  readonly metadata: Readonly<Record<string, JsonValue>>;
  readonly startsAt: string | null;
  readonly tenantAllowlist: readonly string[];
}
