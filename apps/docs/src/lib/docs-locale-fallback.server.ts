import { join } from "node:path";
import type { DocsPage } from "@/lib/docs-page";
import { hasLocaleOverlaySummaryForCasualPage } from "@/lib/docs-feature-copy";
import { type DocsLocale, docsDefaultLocale } from "@/lib/i18n";

const docsDataDir = join(process.cwd(), "data");

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

export function shouldShowDocsLocaleFallbackNotice(input: {
  readonly locale: DocsLocale;
  readonly page: DocsPage;
  readonly contentRelativePath: string;
}): boolean {
  if (!isDocsLocalizedFallbackPage(input.locale, input.page)) {
    return false;
  }

  if (
    hasLocaleOverlaySummaryForCasualPage({
      locale: input.locale,
      dataDir: docsDataDir,
      contentRelativePath: input.contentRelativePath,
    })
  ) {
    return false;
  }

  return true;
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
