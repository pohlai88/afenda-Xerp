import { getGithubLastEdit } from "fumadocs-core/content/github";
import {
  DocsBody,
  DocsDescription,
  DocsTitle,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { getMDXComponents } from "@/components/mdx";
import { docsGithubRepository } from "@/lib/docs-github.constants";
import { type DocsPageParams, resolveDocsPage } from "@/lib/docs-page";
import { resolveDocsContentRelativePath } from "@/lib/docs-page-path";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { source } from "@/lib/source";

interface DocsSlugPageProps {
  readonly params: Promise<DocsPageParams>;
}

function isDocsLocale(value: string): value is DocsLocale {
  return (docsLocales as readonly string[]).includes(value);
}

async function resolveLastModified(
  contentRelativePath: string,
  lang: DocsLocale
): Promise<Date | undefined> {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  try {
    const timestamp = await getGithubLastEdit({
      owner: docsGithubRepository.owner,
      repo: docsGithubRepository.repo,
      path: `${docsGithubRepository.contentPathPrefix}/${lang}/${contentRelativePath}`,
    });
    return timestamp ? new Date(timestamp) : undefined;
  } catch {
    return;
  }
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug, lang: rawLang } = await params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;
  const page = resolveDocsPage(slug, lang);
  const MDX = page.data.body;
  const contentRelativePath = resolveDocsContentRelativePath(page, lang);
  const lastModified = await resolveLastModified(contentRelativePath, lang);
  const githubPath = `${docsGithubRepository.contentPathPrefix}/${lang}/${contentRelativePath}`;

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
        <ViewOptionsPopover
          githubUrl={`https://github.com/${docsGithubRepository.owner}/${docsGithubRepository.repo}/blob/${docsGithubRepository.defaultBranch}/${githubPath}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams(): DocsPageParams[] {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: DocsSlugPageProps): Promise<Metadata> {
  const { slug, lang: rawLang } = await params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;
  const page = resolveDocsPage(slug, lang);

  return {
    title: page.data.title,
    description: page.data.description,
    ...(page.data.noIndex ? { robots: { index: false } } : {}),
  };
}
