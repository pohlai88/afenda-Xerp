import { defineI18n } from "fumadocs-core/i18n";

export const docsDefaultLocale = "en" as const;
export const docsLocales = ["en", "zh"] as const;
export type DocsLocale = (typeof docsLocales)[number];

export const i18n = defineI18n({
  defaultLanguage: docsDefaultLocale,
  languages: [...docsLocales],
  parser: "dir",
});
