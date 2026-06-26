import type { DocsUiLocaleCopy } from "@/lib/i18n/docs-ui-locale-copy.contract";
import { type DocsLocale, docsLocales } from "@/lib/i18n";
import en from "@/lib/i18n/locales/en.json";
import fil from "@/lib/i18n/locales/fil.json";
import id from "@/lib/i18n/locales/id.json";
import ms from "@/lib/i18n/locales/ms.json";
import th from "@/lib/i18n/locales/th.json";
import vi from "@/lib/i18n/locales/vi.json";
import zh from "@/lib/i18n/locales/zh.json";

const docsUiLocaleCopyByLocale = {
  en,
  zh,
  vi,
  ms,
  id,
  th,
  fil,
} satisfies Record<DocsLocale, DocsUiLocaleCopy>;

/** Manual UI translations live in `src/lib/i18n/locales/{locale}.json`. */
export function resolveDocsUiLocaleCopy(locale: DocsLocale): DocsUiLocaleCopy {
  return docsUiLocaleCopyByLocale[locale];
}

export const docsUiLocaleCopyLocales = docsLocales;

export function resolveDocsPageActionsReadPrompt(
  locale: DocsLocale,
  url: string
): string {
  return resolveDocsUiLocaleCopy(locale).pageActions.readPromptTemplate.replace(
    "{url}",
    url
  );
}
