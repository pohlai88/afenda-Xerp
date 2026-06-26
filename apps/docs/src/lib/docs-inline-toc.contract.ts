import { docsLongFormMdxPaths } from "@/lib/docs-nav.contract";
import type { DocsLocale } from "@/lib/i18n";
import { docsLocales } from "@/lib/i18n";
import { resolveDocsUiLocaleCopy } from "@/lib/i18n/resolve-docs-ui-locale-copy";

/** Collapsible inline TOC trigger label per locale. */
export const docsInlineTocLabels = Object.fromEntries(
  docsLocales.map((locale) => [
    locale,
    resolveDocsUiLocaleCopy(locale).inlineTocLabel,
  ])
) as Record<DocsLocale, string>;

export function resolveDocsInlineTocLabel(locale: DocsLocale): string {
  return docsInlineTocLabels[locale];
}

const longFormContentPathSet = new Set<string>(docsLongFormMdxPaths);

/** Whether `content/docs/{locale}/` relative path receives page-level InlineTOC. */
export function isDocsLongFormContentPath(relativePath: string): boolean {
  return longFormContentPathSet.has(relativePath);
}
