import type { InferPageType } from "fumadocs-core/source";
import { notFound } from "next/navigation";
import { source } from "./source";

export interface DocsPageParams {
  readonly slug?: string[];
}

export type DocsPage = InferPageType<typeof source>;

export function resolveDocsPage(slug: string[] | undefined): DocsPage {
  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }
  return page;
}
