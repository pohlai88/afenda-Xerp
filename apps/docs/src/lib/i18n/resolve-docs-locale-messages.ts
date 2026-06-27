import type { FeatureCopyOverlay } from "@/lib/docs-feature-manifest.contract";
import type {
  DocsAfendaLocaleCopy,
  DocsLocaleMessages,
} from "@/lib/i18n/docs-locale-messages.contract";
import { docsLocaleMessagesSchema } from "@/lib/i18n/docs-locale-messages.schema";
import { type DocsLocale, docsLocales } from "@/lib/i18n";
import en from "@/lib/i18n/locales/en.json";
import fil from "@/lib/i18n/locales/fil.json";
import id from "@/lib/i18n/locales/id.json";
import ms from "@/lib/i18n/locales/ms.json";
import th from "@/lib/i18n/locales/th.json";
import vi from "@/lib/i18n/locales/vi.json";
import zh from "@/lib/i18n/locales/zh.json";

function parseDocsLocaleMessages(
  payload: unknown,
  locale: DocsLocale
): DocsLocaleMessages {
  const result = docsLocaleMessagesSchema.safeParse(payload);
  if (!result.success) {
    throw new Error(
      `Invalid docs locale messages for "${locale}": ${result.error.message}`
    );
  }

  return result.data;
}

const rawLocaleMessages = {
  en,
  zh,
  vi,
  ms,
  id,
  th,
  fil,
} as const satisfies Record<DocsLocale, unknown>;

const docsLocaleMessagesByLocale = Object.fromEntries(
  docsLocales.map((locale) => [
    locale,
    parseDocsLocaleMessages(rawLocaleMessages[locale], locale),
  ])
) as Record<DocsLocale, DocsLocaleMessages>;

/** Typed Afenda message catalog for one locale. */
export function resolveDocsLocaleMessages(locale: DocsLocale): DocsLocaleMessages {
  return docsLocaleMessagesByLocale[locale];
}

/** Afenda chrome copy — not Fumadocs UI labels. */
export function resolveDocsAfendaLocaleCopy(
  locale: DocsLocale
): DocsAfendaLocaleCopy {
  const { featureCopy: _featureCopy, ...afendaCopy } =
    resolveDocsLocaleMessages(locale);
  return afendaCopy;
}

/** @deprecated Use `resolveDocsAfendaLocaleCopy`. */
export function resolveDocsUiLocaleCopy(locale: DocsLocale): DocsAfendaLocaleCopy {
  return resolveDocsAfendaLocaleCopy(locale);
}

/** Generated casual feature pages copy keyed by manifest id. */
export function resolveDocsFeatureCopy(locale: DocsLocale): FeatureCopyOverlay {
  return resolveDocsLocaleMessages(locale).featureCopy;
}

export const docsLocaleMessageLocales = docsLocales;
