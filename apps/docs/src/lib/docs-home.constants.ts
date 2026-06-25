import type { LucideIcon } from "lucide-react";
import { BookOpen, Layers, Map as MapIcon, Rocket } from "lucide-react";

export interface DocsHomeSection {
  readonly description: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly title: string;
}

/** Serializable home page navigation — mirrored on `/` HomeLayout. */
export const docsHomeSections = [
  {
    title: "Getting Started",
    description: "Clone, install, and run ERP or docs locally.",
    href: "/docs/getting-started",
    icon: Rocket,
  },
  {
    title: "Monorepo Map",
    description: "Package layers, ports, and where to edit.",
    href: "/docs/monorepo-map",
    icon: MapIcon,
  },
  {
    title: "Applications",
    description: "ERP, Docs, and Storybook — ports and boundaries.",
    href: "/docs/apps",
    icon: Layers,
  },
  {
    title: "Contributing",
    description: "Coding session contract and drift guards.",
    href: "/docs/contributing",
    icon: BookOpen,
  },
] satisfies readonly DocsHomeSection[];
