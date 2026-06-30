import {
  type LocalizationContext,
  serializeLocalizationContext,
  type WireLocalizationContext,
} from "@afenda/kernel";

import { parseCompanyLocalizationSettingsAtIngress } from "./parse-localization-context.server";

export { parseCompanyLocalizationSettingsAtIngress };

export interface PersistedCompanyLocalizationSettings {
  readonly companyDefaults: WireLocalizationContext;
}

/**
 * Parse company/workspace localization defaults at ingress.
 * Formatting execution remains outside kernel — this returns wire-safe codes only.
 */
export function persistCompanyLocalizationSettings(
  value: unknown
): PersistedCompanyLocalizationSettings {
  const context: LocalizationContext =
    parseCompanyLocalizationSettingsAtIngress(value);

  return {
    companyDefaults: serializeLocalizationContext(context),
  };
}
