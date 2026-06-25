import { defineTranslations } from "fumadocs-core/i18n";
import { uiTranslations } from "fumadocs-ui/i18n";

/** Afenda editorial overrides for Fumadocs UI labels (English singular mode). */
export const docsUiTranslationOverrides = {
  "Search(search trigger)": "Search documentation",
  "Search(search dialog)": "Search documentation",
} as const satisfies Record<string, string>;

export const docsUiTranslationOverrideKeys = Object.keys(
  docsUiTranslationOverrides
) as (keyof typeof docsUiTranslationOverrides)[];

export const docsUiTranslations = defineTranslations()
  .extend(uiTranslations())
  .add(docsUiTranslationOverrides);
