import type { DocsFeedbackLocaleCopy } from "@/lib/i18n/docs-ui-locale-copy.contract";
import type { DocsLocale } from "@/lib/i18n";
import { resolveDocsUiLocaleCopy } from "@/lib/i18n/resolve-docs-ui-locale-copy";

export type DocsFeedbackCopy = DocsFeedbackLocaleCopy;

export function resolveDocsFeedbackCopy(locale: DocsLocale): DocsFeedbackCopy {
  return resolveDocsUiLocaleCopy(locale).feedback;
}
