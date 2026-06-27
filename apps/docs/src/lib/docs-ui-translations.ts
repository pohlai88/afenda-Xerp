import { zhCN } from "@fumadocs/language/zh-cn";
import { openapiTranslations } from "fumadocs-openapi/i18n";
import { i18nProvider, uiTranslations } from "fumadocs-ui/i18n";
import {
  afendaFeedbackTranslations,
  resolveAfendaFeedbackTranslationsByLocale,
} from "@/lib/i18n/afenda-feedback-i18n.extension";
import {
  afendaFumadocsRegionalLocales,
  afendaFumadocsRegionalPack,
} from "@/lib/i18n/afenda-fumadocs-packs";
import { type DocsLocale, docsLocales, i18n } from "@/lib/i18n";

const docsFumadocsTranslationBuilder = i18n
  .translations()
  .extend(uiTranslations())
  .extend(openapiTranslations())
  .extend(afendaFeedbackTranslations())
  .preset("zh", zhCN());

const docsFumadocsTranslationsWithRegional =
  afendaFumadocsRegionalLocales.reduce(
    (builder, locale) => builder.preset(locale, afendaFumadocsRegionalPack(locale)),
    docsFumadocsTranslationBuilder
  );

/** Fumadocs UI, OpenAPI, Afenda feedback — official + full regional presets. */
export const docsFumadocsTranslations = docsFumadocsTranslationsWithRegional.add(
  resolveAfendaFeedbackTranslationsByLocale()
);

export function docsI18nProvider(locale: DocsLocale) {
  return i18nProvider(docsFumadocsTranslations, locale);
}

export const docsFumadocsInlineTocLabelKey =
  "On this page(table of contents)" as const;

export const docsFumadocsSpotCheckLabelKeys = [
  "Search(search trigger)",
  docsFumadocsInlineTocLabelKey,
  "Copy Markdown(page actions)",
  "Authorize(playground)",
  "How is this guide?(feedback page prompt)",
] as const;

export function resolveFumadocsUiTranslation(
  locale: DocsLocale,
  label: (typeof docsFumadocsSpotCheckLabelKeys)[number]
): string {
  const translations = docsI18nProvider(locale).translations;
  const value = translations?.[label];
  return typeof value === "string" && value.length > 0 ? value : label;
}
