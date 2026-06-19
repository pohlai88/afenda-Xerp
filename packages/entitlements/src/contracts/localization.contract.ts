import type { EntitlementKey, LocalizationKey } from "./shared.contract";

export interface LocalizationContract {
  readonly countryCode: string;
  readonly enabled: boolean;
  readonly jurisdictionName: string;
  readonly key: LocalizationKey;
  readonly requiredEntitlement: EntitlementKey;
}
