import type { LucideIcon } from "lucide-react";
import { BookOpen, Layers, Map as MapIcon, Rocket } from "lucide-react";
import { docsHref } from "@/lib/docs-nav.contract";
import { type DocsLocale, docsDefaultLocale } from "@/lib/i18n";

export interface DocsHomeSection {
  readonly description: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly title: string;
}

/** Serializable home page navigation — mirrored on `/[lang]` HomeLayout. */
export function docsHomeSections(
  locale: DocsLocale = docsDefaultLocale
): readonly DocsHomeSection[] {
  return [
    {
      title: "Getting Started",
      description: "Clone, install, and run ERP or docs locally.",
      href: docsHref(locale, "/docs/getting-started"),
      icon: Rocket,
    },
    {
      title: "Monorepo Map",
      description: "Package layers, ports, and where to edit.",
      href: docsHref(locale, "/docs/monorepo-map"),
      icon: MapIcon,
    },
    {
      title: "Applications",
      description: "ERP, Docs, and Storybook — ports and boundaries.",
      href: docsHref(locale, "/docs/apps"),
      icon: Layers,
    },
    {
      title: "Contributing",
      description: "Coding session contract and drift guards.",
      href: docsHref(locale, "/docs/contributing"),
      icon: BookOpen,
    },
  ];
}
