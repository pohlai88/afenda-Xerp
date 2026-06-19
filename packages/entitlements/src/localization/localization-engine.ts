import type { EntitlementContract } from "../contracts/entitlement.contract";
import type { LocalizationContract } from "../contracts/localization.contract";
import type { LocalizationKey } from "../contracts/shared.contract";
import type { EntitlementLookupContext } from "../evaluation/entitlement-engine";
import { entitlement } from "../evaluation/entitlement-engine";

export interface LocalizationResolution {
  readonly enabled: boolean;
  readonly key: LocalizationKey;
  readonly localization: LocalizationContract | null;
}

export function localization(
  key: LocalizationKey,
  localizations: readonly LocalizationContract[],
  entitlements: readonly EntitlementContract[],
  context: EntitlementLookupContext
): LocalizationResolution {
  return resolveLocalizationAccess(key, localizations, entitlements, context);
}

export function resolveLocalizationAccess(
  key: LocalizationKey,
  localizations: readonly LocalizationContract[],
  entitlements: readonly EntitlementContract[],
  context: EntitlementLookupContext
): LocalizationResolution {
  const matchingLocalization =
    localizations.find((item) => item.key === key) ?? null;

  if (!matchingLocalization) {
    return { key, enabled: false, localization: null };
  }

  return {
    key,
    enabled:
      matchingLocalization.enabled &&
      entitlement(
        matchingLocalization.requiredEntitlement,
        entitlements,
        context
      ),
    localization: matchingLocalization,
  };
}
