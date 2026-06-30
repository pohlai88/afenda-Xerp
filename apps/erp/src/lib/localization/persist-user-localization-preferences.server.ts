import {
  type LocalizationContext,
  serializeLocalizationContext,
  type WireLocalizationContext,
} from "@afenda/kernel";

import {
  parseUserLocalizationPreferencesAtIngress,
  type UserLocalizationPreferencesWire,
} from "./parse-localization-context.server";

export type { UserLocalizationPreferencesWire };

export { parseUserLocalizationPreferencesAtIngress };

export interface PersistedUserLocalizationPreferences {
  readonly localization: WireLocalizationContext;
}

/**
 * Parse user preferences at ingress and return wire-safe persistence payload.
 * Callers persist `localization` — kernel owns vocabulary validation only.
 */
export function persistUserLocalizationPreferences(
  value: unknown
): PersistedUserLocalizationPreferences {
  const context: LocalizationContext =
    parseUserLocalizationPreferencesAtIngress(value);

  return {
    localization: serializeLocalizationContext(context),
  };
}
