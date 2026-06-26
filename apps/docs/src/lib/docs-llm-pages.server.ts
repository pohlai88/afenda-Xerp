import { getLLMText } from "@/lib/get-llm-text";
import {
  type DocsLocale,
  docsDefaultLocale,
  docsLocales,
} from "@/lib/i18n";
import { shouldGenerateDocsOpenApiPage } from "@/lib/openapi.server";
import { source } from "@/lib/source";
import type { InferPageType } from "fumadocs-core/source";

type DocsExportPage = InferPageType<typeof source>;

function resolvePageLocale(page: DocsExportPage): DocsLocale {
  if ("locale" in page && typeof page.locale === "string") {
    if ((docsLocales as readonly string[]).includes(page.locale)) {
      return page.locale as DocsLocale;
    }
  }

  const segment = page.url.split("/").filter(Boolean)[0];
  if (segment && (docsLocales as readonly string[]).includes(segment)) {
    return segment as DocsLocale;
  }

  return docsDefaultLocale;
}

/** Pages eligible for llms-full export and AI search indexing. */
export function getDocsLlmExportPages(): DocsExportPage[] {
  return source.getPages().filter((page) => {
    const lang = resolvePageLocale(page);
    return shouldGenerateDocsOpenApiPage({ lang, slug: page.slugs });
  });
}

export async function buildDocsLlmFullText(): Promise<string> {
  const pages = getDocsLlmExportPages();
  const chunks = await Promise.all(pages.map((page) => getLLMText(page)));
  return chunks.join("\n\n");
}
