import type { WireLocalizationContext } from "./localization-context.contract.js";

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _LocalizationWireSerializable =
  AssertJsonSerializable<WireLocalizationContext>;

/** Compile-time guard — localization wire context must remain JSON-serializable. */
export type assertLocalizationContextWireSerializable =
  _LocalizationWireSerializable extends true ? true : never;

const WIRE_LOCALIZATION_KEYS = [
  "dateFormat",
  "localeCode",
  "numberFormat",
  "timezoneId",
] as const satisfies readonly (keyof WireLocalizationContext)[];

/** Non-empty trimmed wire text — semantic validation defers to identity parse*. */
export function assertLocalizationText(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

/**
 * Reject malformed wire payloads before identity parse* branding runs.
 * Fail closed — no partial branded context.
 */
export function assertWireLocalizationContext(
  value: unknown
): asserts value is WireLocalizationContext {
  if (value === null || typeof value !== "object") {
    throw new Error("WireLocalizationContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  for (const key of WIRE_LOCALIZATION_KEYS) {
    if (typeof record[key] !== "string") {
      throw new Error(`${key} must be a string.`);
    }

    assertLocalizationText(record[key], key);
  }
}
