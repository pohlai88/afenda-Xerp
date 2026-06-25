import { defineI18nUI } from "fumadocs-ui/i18n";
import { i18n } from "@/lib/i18n";

/** Afenda editorial overrides for Fumadocs UI labels per locale. */
export const docsUiTranslationOverrides = {
  en: {
    displayName: "English",
    "Search(search trigger)": "Search documentation",
    "Search(search dialog)": "Search documentation",
  },
  zh: {
    displayName: "中文",
    "Search(search trigger)": "搜索文档",
    "Search(search dialog)": "搜索文档",
  },
} as const;

export const docsUiTranslationOverrideKeys = Object.keys(
  docsUiTranslationOverrides.en
).filter((key) => key !== "displayName") as (keyof Omit<
  (typeof docsUiTranslationOverrides)["en"],
  "displayName"
>)[];

const { provider } = defineI18nUI(i18n, docsUiTranslationOverrides);

export const docsI18nProvider = provider;
