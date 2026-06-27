import { docsLongFormMdxPaths } from "@/lib/docs-nav.contract";
import {
  docsFumadocsInlineTocLabelKey,
  docsI18nProvider,
} from "@/lib/docs-ui-translations";
import type { DocsLocale } from "@/lib/i18n";
import { docsLocales } from "@/lib/i18n";

/** Collapsible inline TOC trigger label per locale (Fumadocs translation key). */
export const docsInlineTocLabels = Object.fromEntries(
  docsLocales.map((locale) => {
    const translations = docsI18nProvider(locale).translations;
    const label = translations?.[docsFumadocsInlineTocLabelKey];
    return [
      locale,
      typeof label === "string" && label.length > 0
        ? label
        : docsFumadocsInlineTocLabelKey,
    ];
  })
) as Record<DocsLocale, string>;

export function resolveDocsInlineTocLabel(locale: DocsLocale): string {
  return docsInlineTocLabels[locale];
}

const longFormContentPathSet = new Set<string>(docsLongFormMdxPaths);

/** Whether `content/docs/{locale}/` relative path receives page-level InlineTOC. */
export function isDocsLongFormContentPath(relativePath: string): boolean {
  return longFormContentPathSet.has(relativePath);
}
