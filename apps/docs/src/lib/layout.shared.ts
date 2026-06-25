import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { docsHref } from "@/lib/docs-nav.contract";
import { type DocsLocale, docsDefaultLocale, i18n } from "@/lib/i18n";

export function baseOptions(
  locale: DocsLocale = docsDefaultLocale
): BaseLayoutProps {
  return {
    nav: {
      title: "Afenda Docs",
    },
    i18n,
    links: [
      {
        text: "Applications",
        url: docsHref(locale, "/docs/apps"),
        active: "nested-url",
      },
      {
        text: "Contributing",
        url: docsHref(locale, "/docs/contributing"),
        active: "nested-url",
      },
    ],
  };
}
