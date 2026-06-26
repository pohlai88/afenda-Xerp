import type { LucideIcon } from "lucide-react";
import { BookOpen, Layers, Map as MapIcon, Rocket } from "lucide-react";
import { docsHref } from "@/lib/docs-nav.contract";
import { type DocsLocale, docsDefaultLocale } from "@/lib/i18n";
import { resolveDocsUiLocaleCopy } from "@/lib/i18n/resolve-docs-ui-locale-copy";

export interface DocsHomeSection {
  readonly description: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly title: string;
}

const homeSectionIconsByDocsPath = {
  "/docs/getting-started": Rocket,
  "/docs/monorepo-map": MapIcon,
  "/docs/apps": Layers,
  "/docs/contributing": BookOpen,
} as const;

type HomeSectionDocsPath = keyof typeof homeSectionIconsByDocsPath;

function resolveHomeSectionIcon(docsPath: string): LucideIcon {
  if (docsPath in homeSectionIconsByDocsPath) {
    return homeSectionIconsByDocsPath[docsPath as HomeSectionDocsPath];
  }

  return BookOpen;
}

/** Serializable home page navigation — mirrored on `/[lang]` HomeLayout. */
export function docsHomeSections(
  locale: DocsLocale = docsDefaultLocale
): readonly DocsHomeSection[] {
  return resolveDocsUiLocaleCopy(locale).homeSections.map((section) => ({
    title: section.title,
    description: section.description,
    href: docsHref(locale, section.docsPath),
    icon: resolveHomeSectionIcon(section.docsPath),
  }));
}
