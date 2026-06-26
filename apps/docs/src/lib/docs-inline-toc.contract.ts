import { docsLongFormMdxPaths } from "@/lib/docs-nav.contract";
import type { DocsLocale } from "@/lib/i18n";

/** Collapsible inline TOC trigger label per locale. */
export const docsInlineTocLabels = {
  en: "On this page",
  zh: "本页目录",
} as const satisfies Record<DocsLocale, string>;

export function resolveDocsInlineTocLabel(locale: DocsLocale): string {
  return docsInlineTocLabels[locale];
}

const longFormContentPathSet = new Set<string>(docsLongFormMdxPaths);

/** Whether `content/docs/{locale}/` relative path receives page-level InlineTOC. */
export function isDocsLongFormContentPath(relativePath: string): boolean {
  return longFormContentPathSet.has(relativePath);
}
