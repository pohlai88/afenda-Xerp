import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { docsFontClassNames } from "@/lib/docs-fonts";
import { docsSearchEmptyLinks } from "@/lib/docs-search.contract";
import { docsI18nProvider } from "@/lib/docs-ui-translations";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Afenda Docs",
    template: "%s | Afenda Docs",
  },
  description: "Afenda ERP implementation documentation",
};

function isDocsLocale(value: string): value is DocsLocale {
  return (docsLocales as readonly string[]).includes(value);
}

export default async function LangLayout({
  params,
  children,
}: {
  readonly params: Promise<{ lang: string }>;
  readonly children: ReactNode;
}) {
  const { lang: rawLang } = await params;
  const lang = isDocsLocale(rawLang) ? rawLang : docsDefaultLocale;

  return (
    <html className={docsFontClassNames} lang={lang} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={docsI18nProvider(lang)}
          search={{ links: docsSearchEmptyLinks(lang) }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
