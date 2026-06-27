import type { TranslationExtension } from "fumadocs-core/i18n";
import type { DocsFeedbackLocaleCopy } from "@/lib/i18n/docs-locale-messages.contract";
import { type DocsLocale, docsLocales } from "@/lib/i18n";
import { resolveDocsAfendaLocaleCopy } from "@/lib/i18n/resolve-docs-locale-messages";

export const AFENDA_FEEDBACK_I18N_KEYS = [
  "Feedback(feedback block label)",
  "Close(feedback dialog)",
  "Good(feedback rating)",
  "Bad(feedback rating)",
  "How is this guide?(feedback page prompt)",
  "Leave your feedback…(feedback placeholder)",
  "Submit(feedback form)",
  "Submit Again(feedback form)",
  "Thank you for your feedback!(feedback confirmation)",
  "View on GitHub(feedback link)",
] as const;

export type AfendaFeedbackI18nKey = (typeof AFENDA_FEEDBACK_I18N_KEYS)[number];

export function afendaFeedbackTranslations(): TranslationExtension<AfendaFeedbackI18nKey> {
  return { keys: AFENDA_FEEDBACK_I18N_KEYS };
}

export function mapAfendaFeedbackCopyToFumadocsLabels(
  copy: DocsFeedbackLocaleCopy
): Record<AfendaFeedbackI18nKey, string> {
  return {
    "Feedback(feedback block label)": copy.blockFeedbackLabel,
    "Close(feedback dialog)": copy.close,
    "Good(feedback rating)": copy.good,
    "Bad(feedback rating)": copy.bad,
    "How is this guide?(feedback page prompt)": copy.pagePrompt,
    "Leave your feedback…(feedback placeholder)": copy.placeholder,
    "Submit(feedback form)": copy.submit,
    "Submit Again(feedback form)": copy.submitAgain,
    "Thank you for your feedback!(feedback confirmation)": copy.thankYou,
    "View on GitHub(feedback link)": copy.viewOnGitHub,
  };
}

export function resolveAfendaFeedbackTranslationsForLocale(
  locale: DocsLocale
): Record<AfendaFeedbackI18nKey, string> {
  return mapAfendaFeedbackCopyToFumadocsLabels(
    resolveDocsAfendaLocaleCopy(locale).feedback
  );
}

export function resolveAfendaFeedbackTranslationsByLocale(): Record<
  DocsLocale,
  Record<AfendaFeedbackI18nKey, string>
> {
  return Object.fromEntries(
    docsLocales.map((locale) => [
      locale,
      resolveAfendaFeedbackTranslationsForLocale(locale),
    ])
  ) as Record<DocsLocale, Record<AfendaFeedbackI18nKey, string>>;
}
