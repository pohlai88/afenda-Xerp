import {
  type LocalizationContext,
  parseUnknownLocalizationContext,
  type WireLocalizationContext,
} from "@afenda/kernel";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

/** User settings form wire — short field names mapped to kernel wire at ingress. */
export interface UserLocalizationPreferencesWire {
  readonly dateFormat: string;
  readonly locale: string;
  readonly numberFormat: string;
  readonly timezone: string;
}

/** Company / workspace settings wire — kernel-aligned field names. */
export type CompanyLocalizationSettingsWire = WireLocalizationContext;

export function toLocalizationContextWire(
  wire: UserLocalizationPreferencesWire
): WireLocalizationContext {
  return {
    localeCode: wire.locale,
    timezoneId: wire.timezone,
    dateFormat: wire.dateFormat,
    numberFormat: wire.numberFormat,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function readRequiredStringField(
  record: Record<string, unknown>,
  field: string
): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new ApiRouteError("validation_failed", `Invalid ${field}.`, {
      field,
    });
  }
  return value;
}

export function assertUserLocalizationPreferencesWire(
  value: unknown
): asserts value is UserLocalizationPreferencesWire {
  if (!isRecord(value)) {
    throw new ApiRouteError(
      "validation_failed",
      "Invalid localization preferences.",
      { field: "preferences" }
    );
  }

  readRequiredStringField(value, "locale");
  readRequiredStringField(value, "timezone");
  readRequiredStringField(value, "dateFormat");
  readRequiredStringField(value, "numberFormat");
}

export function parseLocalizationContextAtIngress(
  wire: WireLocalizationContext
): LocalizationContext {
  try {
    return parseUnknownLocalizationContext(wire);
  } catch {
    throw new ApiRouteError(
      "validation_failed",
      "Invalid localization context.",
      { field: "localizationContext" }
    );
  }
}

export function parseUserLocalizationPreferencesAtIngress(
  value: unknown
): LocalizationContext {
  assertUserLocalizationPreferencesWire(value);
  return parseLocalizationContextAtIngress(toLocalizationContextWire(value));
}

export function parseCompanyLocalizationSettingsAtIngress(
  value: unknown
): LocalizationContext {
  if (!isRecord(value)) {
    throw new ApiRouteError(
      "validation_failed",
      "Invalid company localization settings.",
      { field: "companyLocalizationSettings" }
    );
  }

  const wire: WireLocalizationContext = {
    localeCode: readRequiredStringField(value, "localeCode"),
    timezoneId: readRequiredStringField(value, "timezoneId"),
    dateFormat: readRequiredStringField(value, "dateFormat"),
    numberFormat: readRequiredStringField(value, "numberFormat"),
  };

  return parseLocalizationContextAtIngress(wire);
}
