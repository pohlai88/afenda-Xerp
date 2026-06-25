import { HomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import { docsHomeSections } from "@/lib/docs-home.constants";
import { docsHref } from "@/lib/docs-nav.contract";
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
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-4">
          <p className="font-medium text-fd-muted-foreground text-sm">
            Afenda ERP · engineer documentation
          </p>
          <h1 className="font-semibold text-4xl text-fd-foreground tracking-tight">
            Implementation guides for the monorepo
          </h1>
          <p className="max-w-2xl text-fd-muted-foreground text-lg">
            Fumadocs-powered onboarding for `@afenda/erp`, `@afenda/docs`, and
            `@afenda/storybook`. Governance artifacts stay in repo-root{" "}
            <code className="text-sm">docs/</code> — this site links to them.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex h-10 items-center rounded-md bg-fd-primary px-4 font-medium text-fd-primary-foreground text-sm transition-opacity hover:opacity-90"
              href={docsHref(lang, "/docs")}
            >
              Open documentation
            </Link>
            <Link
              className="inline-flex h-10 items-center rounded-md border border-fd-border px-4 font-medium text-fd-foreground text-sm transition-colors hover:bg-fd-accent"
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
                className="flex flex-col gap-2 rounded-lg border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/40"
                href={section.href}
                key={section.href}
              >
                <Icon aria-hidden className="size-5 text-fd-muted-foreground" />
                <span className="font-medium text-fd-foreground">
                  {section.title}
                </span>
                <span className="text-fd-muted-foreground text-sm">
                  {section.description}
                </span>
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
