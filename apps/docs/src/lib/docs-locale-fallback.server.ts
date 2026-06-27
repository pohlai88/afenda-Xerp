import type { DocsPage } from "@/lib/docs-page";
import { type DocsLocale, docsDefaultLocale } from "@/lib/i18n";

/** True when Fumadocs served English content for a non-English locale request. */
export function isDocsLocalizedFallbackPage(
  locale: DocsLocale,
  page: DocsPage
): boolean {
  if (locale === docsDefaultLocale) {
    return false;
  }

  if ("absolutePath" in page && typeof page.absolutePath === "string") {
    const normalized = page.absolutePath.replace(/\\/g, "/");
    return !normalized.includes(`/content/docs/${locale}/`);
  }

  if ("path" in page && typeof page.path === "string") {
    const normalized = page.path.replace(/\\/g, "/");
    return !normalized.startsWith(`${locale}/`);
  }

  return false;
}

export function resolveDocsFallbackBannerId(
  locale: DocsLocale,
  pageUrl: string
): string {
  const stablePageKey = pageUrl
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-");
  return `docs-locale-fallback-${locale}-${stablePageKey}`;
}
