import type { InferPageType } from "fumadocs-core/source";
import { notFound } from "next/navigation";
import type { DocsLocale } from "@/lib/i18n";
import { source } from "./source";

export interface DocsPageParams {
  readonly lang: string;
  readonly slug?: readonly string[];
}

export type DocsPage = InferPageType<typeof source>;

export function resolveDocsPage(
  slug: readonly string[] | undefined,
  lang: DocsLocale
): DocsPage {
  const page = source.getPage([...(slug ?? [])], lang);
  if (!page) {
    notFound();
  }
  return page;
}
