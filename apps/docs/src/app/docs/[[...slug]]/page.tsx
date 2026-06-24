import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { getMDXComponents } from "@/components/mdx";
import { type DocsPageParams, resolveDocsPage } from "@/lib/docs-page";
import { source } from "@/lib/source";

interface DocsSlugPageProps {
  readonly params: Promise<DocsPageParams>;
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug } = await params;
  const page = resolveDocsPage(slug);
  const MDX = page.data.body;

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
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
  };
}
