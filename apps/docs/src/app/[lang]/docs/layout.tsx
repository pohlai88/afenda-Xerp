import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { DocsAiSearchChrome } from "@/components/docs-ai-search-chrome.client";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

function isDocsLocale(value: string): value is DocsLocale {
  return (docsLocales as readonly string[]).includes(value);
}

interface DocsRootLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ lang: string }>;
}

export default async function DocsRootLayout({
  params,
  children,
}: DocsRootLayoutProps) {
  const { lang: rawLang } = await params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;

  const pageTree = source.pageTree[lang];
  if (!pageTree) {
    throw new Error(`Missing page tree for locale: ${lang}`);
  }

  const { nav, ...options } = baseOptions(lang);

  return (
    <DocsLayout
      tree={pageTree}
      {...options}
      nav={{ ...nav, mode: "top" }}
    >
      <DocsAiSearchChrome />
      {children}
    </DocsLayout>
  );
}
