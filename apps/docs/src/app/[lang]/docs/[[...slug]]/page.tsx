import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "@/components/ai/page-actions";
import { Feedback, FeedbackText } from "@/components/feedback/client";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import {
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { getMDXComponents } from "@/components/mdx";
import {
  OpenAPIPageWithPreload,
  OpenAPIPreloadProvider,
} from "@/components/api-page.client";
import { docsGithubRepository } from "@/lib/docs-github.constants";
import {
  onBlockFeedbackAction,
  onPageFeedbackAction,
} from "@/lib/docs-github-feedback.server";
import { resolveDocsGithubLastModified } from "@/lib/docs-github.server";
import {
  isDocsLongFormContentPath,
  resolveDocsInlineTocLabel,
} from "@/lib/docs-inline-toc.contract";
import { resolveDocsLlmMarkdownUrl } from "@/lib/get-llm-text";
import { type DocsPageParams, resolveDocsPage } from "@/lib/docs-page";
import { resolveDocsContentRelativePath } from "@/lib/docs-page-path";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { openapi, assertDocsOpenApiPageAvailable, shouldGenerateDocsOpenApiPage } from "@/lib/openapi.server";
import { source } from "@/lib/source";
import type { InternalOpenAPIMeta } from "fumadocs-openapi/server";

function pageHasOpenApiFrontmatter(
  data: unknown
): data is { _openapi: InternalOpenAPIMeta } {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const record = data as Record<string, unknown>;
  return record["_openapi"] !== undefined;
}

interface DocsSlugPageProps {
  readonly params: Promise<DocsPageParams>;
}

function isDocsLocale(value: string): value is DocsLocale {
  return (docsLocales as readonly string[]).includes(value);
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug, lang: rawLang } = await params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;
  assertDocsOpenApiPageAvailable(slug, lang);
  const page = resolveDocsPage(slug, lang);
  const MDX = page.data.body;
  const contentRelativePath = resolveDocsContentRelativePath(page, lang);
  const lastModified = await resolveDocsGithubLastModified(
    contentRelativePath,
    lang
  );
  const githubPath = `${docsGithubRepository.contentPathPrefix}/${lang}/${contentRelativePath}`;
  const showInlineToc =
    isDocsLongFormContentPath(contentRelativePath) && page.data.toc.length > 0;

  const openApiPreload = pageHasOpenApiFrontmatter(page.data)
    ? await openapi.preloadOpenAPIPage(page)
    : undefined;

  const docsPageProps = {
    editOnGithub: {
      owner: docsGithubRepository.owner,
      path: githubPath,
      repo: docsGithubRepository.repo,
      sha: docsGithubRepository.defaultBranch,
    },
    full: page.data.full,
    toc: page.data.toc,
    ...(lastModified ? { lastUpdate: lastModified } : {}),
  } as const;

  return (
    <DocsPage {...docsPageProps}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="not-prose mb-4 flex flex-row flex-wrap items-center gap-2 border-fd-border border-b pb-4">
        <MarkdownCopyButton markdownUrl={resolveDocsLlmMarkdownUrl(page.url)} />
        <ViewOptionsPopover
          githubUrl={`https://github.com/${docsGithubRepository.owner}/${docsGithubRepository.repo}/blob/${docsGithubRepository.defaultBranch}/${githubPath}`}
          markdownUrl={resolveDocsLlmMarkdownUrl(page.url)}
        />
      </div>
      <DocsBody>
        <FeedbackText onSendAction={onBlockFeedbackAction}>
          {showInlineToc ? (
            <InlineTOC defaultOpen items={page.data.toc}>
              {resolveDocsInlineTocLabel(lang)}
            </InlineTOC>
          ) : null}
          {openApiPreload ? (
            <OpenAPIPreloadProvider preloaded={openApiPreload.preloaded}>
              <MDX
                components={getMDXComponents({
                  a: createRelativeLink(source, page),
                  OpenAPIPage: OpenAPIPageWithPreload,
                  APIPage: OpenAPIPageWithPreload,
                })}
              />
            </OpenAPIPreloadProvider>
          ) : (
            <MDX
              components={getMDXComponents({
                a: createRelativeLink(source, page),
              })}
            />
          )}
        </FeedbackText>
      </DocsBody>
      <Feedback onSendAction={onPageFeedbackAction} />
    </DocsPage>
  );
}

export function generateStaticParams(): DocsPageParams[] {
  return source.generateParams().filter(shouldGenerateDocsOpenApiPage);
}

export async function generateMetadata({
  params,
}: DocsSlugPageProps): Promise<Metadata> {
  const { slug, lang: rawLang } = await params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;
  assertDocsOpenApiPageAvailable(slug, lang);
  const page = resolveDocsPage(slug, lang);

  return {
    title: page.data.title,
    description: page.data.description,
    ...(page.data.noIndex ? { robots: { index: false } } : {}),
  };
}
