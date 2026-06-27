import type { DocsFeedbackLocaleCopy } from "@/lib/i18n/docs-locale-messages.contract";
import {
  mapAfendaFeedbackCopyToFumadocsLabels,
  resolveAfendaFeedbackTranslationsForLocale,
} from "@/lib/i18n/afenda-feedback-i18n.extension";
import type { DocsLocale } from "@/lib/i18n";
import { resolveDocsAfendaLocaleCopy } from "@/lib/i18n/resolve-docs-locale-messages";

export type DocsFeedbackCopy = DocsFeedbackLocaleCopy;

/** Server-safe resolver — mirrors `@fuma-translate/react` keys in feedback UI. */
export function resolveDocsFeedbackCopy(locale: DocsLocale): DocsFeedbackCopy {
  return resolveDocsAfendaLocaleCopy(locale).feedback;
}

export function resolveDocsFeedbackFumadocsLabels(locale: DocsLocale) {
  return resolveAfendaFeedbackTranslationsForLocale(locale);
}

export { mapAfendaFeedbackCopyToFumadocsLabels };
