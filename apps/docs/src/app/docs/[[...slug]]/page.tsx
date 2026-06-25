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
import { source } from "@/lib/source";

interface DocsSlugPageProps {
  readonly params: Promise<DocsPageParams>;
}

async function resolveLastModified(
  contentRelativePath: string
): Promise<Date | undefined> {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  try {
    const timestamp = await getGithubLastEdit({
      owner: docsGithubRepository.owner,
      repo: docsGithubRepository.repo,
      path: `${docsGithubRepository.contentPathPrefix}/${contentRelativePath}`,
    });
    return timestamp ? new Date(timestamp) : undefined;
  } catch {
    return;
  }
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug } = await params;
  const page = resolveDocsPage(slug);
  const MDX = page.data.body;
  const contentRelativePath = resolveDocsContentRelativePath(page);
  const lastModified = await resolveLastModified(contentRelativePath);
  const githubPath = `${docsGithubRepository.contentPathPrefix}/${contentRelativePath}`;

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
  const { slug } = await params;
  const page = resolveDocsPage(slug);

  return {
    title: page.data.title,
    description: page.data.description,
    ...(page.data.noIndex ? { robots: { index: false } } : {}),
  };
}
