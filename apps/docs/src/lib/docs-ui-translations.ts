import { defineI18nUI } from "fumadocs-ui/i18n";
import type { DocsLocale } from "@/lib/i18n";
import { docsLocales, i18n } from "@/lib/i18n";
import { resolveDocsUiLocaleCopy } from "@/lib/i18n/resolve-docs-ui-locale-copy";

function toFumadocsUiOverrides(locale: DocsLocale) {
  const copy = resolveDocsUiLocaleCopy(locale);

  return {
    displayName: copy.displayName,
    "Search(search trigger)": copy.searchTrigger,
    "Search(search dialog)": copy.searchDialog,
  };
}

/** Afenda editorial overrides for Fumadocs UI labels per locale. */
export const docsUiTranslationOverrides = Object.fromEntries(
  docsLocales.map((locale) => [locale, toFumadocsUiOverrides(locale)])
) as Record<
  DocsLocale,
  {
    readonly displayName: string;
    readonly "Search(search trigger)": string;
    readonly "Search(search dialog)": string;
  }
>;

export const docsUiTranslationOverrideKeys = Object.keys(
  docsUiTranslationOverrides.en
).filter((key) => key !== "displayName") as (keyof Omit<
  (typeof docsUiTranslationOverrides)["en"],
  "displayName"
>)[];

const { provider } = defineI18nUI(i18n, docsUiTranslationOverrides);

export const docsI18nProvider = provider;
