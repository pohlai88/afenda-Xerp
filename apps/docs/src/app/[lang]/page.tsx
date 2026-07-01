import { HomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { docsHomeSections } from "@/lib/docs-home.constants";
import { docsHref } from "@/lib/docs-nav.contract";
import { cn } from "@/lib/cn";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { baseOptions } from "@/lib/layout.shared";

function isDocsLocale(value: string): value is DocsLocale {
  return (docsLocales as readonly string[]).includes(value);
}

interface DocsMarketingHomePageProps {
  readonly params: Promise<{ lang: string }>;
}

export default async function DocsMarketingHomePage({
  params,
}: DocsMarketingHomePageProps) {
  const { lang: rawLang } = await params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;
  const options = baseOptions(lang);
  const sections = docsHomeSections(lang);

  return (
    <HomeLayout {...options}>
      <main
        className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16"
        id="main-content"
      >
        <header className="flex flex-col gap-4">
          <p className="docs-type-overline">
            Afenda ERP · engineer documentation
          </p>
          <h1 className="docs-type-display">
            Implementation guides for the monorepo
          </h1>
          <p className="docs-type-deck">
            Fumadocs-powered onboarding for{" "}
            <code className="docs-type-caption" translate="no">
              @afenda/erp
            </code>
            ,{" "}
            <code className="docs-type-caption" translate="no">
              @afenda/docs
            </code>
            , and{" "}
            <code className="docs-type-caption" translate="no">
              @afenda/storybook
            </code>
            . Governance artifacts stay in repo-root{" "}
            <code className="docs-type-caption" translate="no">docs/</code> —
            this site links to them.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className={cn(buttonVariants({ color: "primary" }))}
              href={docsHref(lang, "/docs")}
            >
              Open documentation
            </Link>
            <Link
              className={cn(buttonVariants({ color: "outline" }))}
              href={docsHref(lang, "/docs/getting-started")}
            >
              Getting started
            </Link>
          </div>
        </header>

        <section
          aria-label="Documentation sections"
          className="grid gap-4 sm:grid-cols-2"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                className="flex flex-col gap-2 rounded-lg border border-fd-border bg-fd-card p-5 shadow-sm transition-[background-color,box-shadow] hover:bg-fd-accent/30 hover:shadow-md"
                href={section.href}
                key={section.href}
              >
                <Icon aria-hidden className="size-5 text-fd-muted-foreground" />
                <span className="docs-type-ui-strong">{section.title}</span>
                <span className="docs-type-caption">{section.description}</span>
              </Link>
            );
          })}
        </section>
      </main>
    </HomeLayout>
  );
}

export function generateStaticParams(): Array<{ lang: DocsLocale }> {
  return docsLocales.map((lang) => ({ lang }));
}
