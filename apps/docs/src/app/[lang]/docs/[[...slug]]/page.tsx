import { Feedback, FeedbackText } from "@/components/feedback/client";
import { Banner } from "fumadocs-ui/components/banner";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/notebook/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
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
import { resolveDocsLastModified } from "@/lib/docs-last-modified.server";
import {
  isDocsLocalizedFallbackPage,
  resolveDocsFallbackBannerId,
} from "@/lib/docs-locale-fallback.server";
import {
  isDocsLongFormContentPath,
  resolveDocsInlineTocLabel,
} from "@/lib/docs-inline-toc.contract";
import { resolveDocsUiLocaleCopy } from "@/lib/i18n/resolve-docs-ui-locale-copy";
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
  const lastModified = await resolveDocsLastModified(
    page,
    contentRelativePath,
    lang
  );
  const githubPath = `${docsGithubRepository.contentPathPrefix}/${lang}/${contentRelativePath}`;
  const githubUrl = `https://github.com/${docsGithubRepository.owner}/${docsGithubRepository.repo}/blob/${docsGithubRepository.defaultBranch}/${githubPath}`;
  const markdownUrl = resolveDocsLlmMarkdownUrl(page.url);
  const showInlineToc =
    isDocsLongFormContentPath(contentRelativePath) && page.data.toc.length > 0;

  const openApiPreload = pageHasOpenApiFrontmatter(page.data)
    ? await openapi.preloadOpenAPIPage(page)
    : undefined;
  const showFallbackNotice = isDocsLocalizedFallbackPage(lang, page);
  const fallbackNotice = showFallbackNotice
    ? resolveDocsUiLocaleCopy(lang).fallbackNotice
    : null;

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <DocsTitle className="docs-type-display">{page.data.title}</DocsTitle>
      <DocsDescription className="docs-type-summary">
        {page.data.description}
      </DocsDescription>
      <div className="docs-page-actions not-prose flex flex-row flex-wrap items-center">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover githubUrl={githubUrl} markdownUrl={markdownUrl} />
      </div>
      <DocsBody>
        <FeedbackText onSendAction={onBlockFeedbackAction}>
          {fallbackNotice ? (
            <Banner
              id={resolveDocsFallbackBannerId(lang, page.url)}
              changeLayout={false}
            >
              {fallbackNotice}
            </Banner>
          ) : null}
          {showInlineToc ? (
            <InlineTOC defaultOpen items={page.data.toc}>
              {resolveDocsInlineTocLabel(lang)}
            </InlineTOC>
          ) : null}
          {openApiPreload ? (
            <OpenAPIPreloadProvider preloaded={openApiPreload.preloaded}>
              <MDX
                components={getMDXComponents(
                  {
                    a: createRelativeLink(source, page),
                    OpenAPIPage: OpenAPIPageWithPreload,
                    APIPage: OpenAPIPageWithPreload,
                  },
                  { pageTitle: page.data.title }
                )}
              />
            </OpenAPIPreloadProvider>
          ) : (
            <MDX
              components={getMDXComponents(
                {
                  a: createRelativeLink(source, page),
                },
                { pageTitle: page.data.title }
              )}
            />
          )}
        </FeedbackText>
      </DocsBody>
      <div className="docs-page-footer not-prose flex flex-row flex-wrap items-center justify-between empty:hidden">
        <EditOnGitHub href={githubUrl} />
        {lastModified ? <PageLastUpdate date={lastModified} /> : null}
      </div>
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
