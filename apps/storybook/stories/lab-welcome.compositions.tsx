import type { ReactNode } from "react";

import { Badge } from "@/components-ui/badge";
import { Button } from "@/components-ui/button";
import { Card, CardContent } from "@/components-ui/card";
import { Separator } from "@/components-ui/separator";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components-ui/timeline";
import {
  ArrowRight,
  Building2,
  Component,
  Layers,
  LayoutGrid,
  Palette,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { afendaExpensiveCalmPreset } from "./afenda-expensive-calm.preset";
import { vercelLabPreset } from "./lab-welcome-vercel.preset";
import * as lab from "./presentation-lab.recipe";

export type LabWelcomeVariant = "calm" | "compact";

export interface LabWelcomeSurfaceProps {
  variant?: LabWelcomeVariant;
}

const PRIMARY_LANE = {
  label: "Blocks",
  path: "Shadcn Studio / Blocks",
  storyId: "shadcn-studio-blocks",
} as const;

const labSections = [
  {
    title: "Blocks",
    path: "Shadcn Studio / Blocks",
    storyId: "shadcn-studio-blocks",
    description:
      "Curated MCP blocks with dark variants, fixture data, and metadata hydration labs.",
    icon: Layers,
    featured: true,
  },
  {
    title: "Theme Lab",
    path: "Shadcn Studio / Theme Lab",
    storyId: "shadcn-studio-theme-lab",
    description:
      "ThemeCustomizer and preset matrix — live token verification in light and dark.",
    icon: Palette,
    featured: false,
  },
  {
    title: "App Shell",
    path: "Shadcn Studio / App Shell",
    storyId: "shadcn-studio-app-shell",
    description: "Operator chrome and shell surfaces before ERP route promotion.",
    icon: Building2,
    featured: false,
  },
  {
    title: "Primitives",
    path: "Shadcn Studio / Primitives",
    storyId: "shadcn-studio-primitives",
    description:
      "Governed UI primitives — contract slots and Base UI adapters.",
    icon: Component,
    featured: false,
  },
  {
    title: "Blocks Auto",
    path: "Shadcn Studio / Blocks Auto",
    storyId: "shadcn-studio-blocks-auto",
    description:
      "Codegen smoke — one story per self-contained page block after generate.",
    icon: Sparkles,
    featured: false,
  },
  {
    title: "Blocks Flat",
    path: "Shadcn Studio / Blocks Flat",
    storyId: "shadcn-studio-blocks-flat",
    description:
      "Flat block registry — fixture-backed compositions for page shells.",
    icon: LayoutGrid,
    featured: false,
  },
  {
    title: "Assets",
    path: "Shadcn Studio / Assets",
    storyId: "shadcn-studio-assets",
    description:
      "SVG icons and card illustrations with theme CSS variables (light/dark).",
    icon: Sparkles,
    featured: false,
  },
  {
    title: "Primitives Catalog",
    path: "Shadcn Studio / Primitives Catalog",
    storyId: "shadcn-studio-primitives-catalog",
    description:
      "Colocated primitive autodocs inventory — codegen scaffolds under components-ui.",
    icon: Component,
    featured: false,
  },
] as const;

const acceptanceGates = [
  { command: "pnpm storybook generate", label: "Codegen" },
  { command: "pnpm check:storybook-block-coverage", label: "Block coverage" },
  { command: "pnpm check:storybook-primitive-coverage", label: "Primitive coverage" },
  { command: "pnpm --filter @afenda/storybook typecheck", label: "Lab types" },
  { command: "pnpm test:storybook:run", label: "Smoke" },
  { command: "pnpm check:studio-block-slot-markers", label: "Slot markers" },
  { command: "pnpm --filter @afenda/erp typecheck && build", label: "ERP build" },
] as const;

const airlockTitle: Record<LabWelcomeVariant, string> = {
  calm: lab.presentationLabAirlockTitleClassName,
  compact:
    "mt-3 max-w-3xl text-balance font-semibold text-4xl text-foreground tracking-tight md:text-5xl",
};

function LabThemeShell({
  children,
  shell = "airlock",
}: {
  children: ReactNode;
  shell?: "airlock" | "editorial";
}) {
  const shellClass =
    shell === "airlock"
      ? lab.presentationLabAirlockShellClassName
      : lab.presentationLabShellClassName;

  return (
    <div className={`${afendaExpensiveCalmPreset.className} ${shellClass}`}>
      {children}
    </div>
  );
}

/** The front door — one message, one path. Sidebar holds the rest. */
export function LabWelcomeSurface({ variant = "calm" }: LabWelcomeSurfaceProps) {
  return (
    <LabThemeShell shell="airlock">
      <main className={lab.presentationLabAirlockMainClassName}>
        <p className={lab.presentationLabAirlockKickerClassName}>Afenda</p>

        <h1 className={airlockTitle[variant]}>
          <span className="sr-only">Afenda </span>
          Presentation Lab
        </h1>

        <p className={lab.presentationLabAirlockSubtitleClassName}>
          Verify before ERP.
        </p>

        <p
          className={`${lab.presentationLabAirlockActionClassName} cursor-default`}
          role="note"
        >
          {PRIMARY_LANE.label}
          <ArrowRight aria-hidden className="size-5" />
        </p>
        <p className="mt-3 font-mono text-[0.65rem] text-muted-foreground/80">
          Sidebar → {PRIMARY_LANE.path}
        </p>
      </main>

      <footer className={lab.presentationLabAirlockFooterClassName}>
        <p>pnpm storybook:ui</p>
        <p className="mt-1 opacity-60">PAS-006 · ADR-0027</p>
      </footer>
    </LabThemeShell>
  );
}

/* ── Appendix slices (not the front door) ── */

function CatalogIndex() {
  const items = labSections.filter((s) => !s.featured);

  return (
    <ul className="divide-y divide-border/50" role="list">
      {items.map((section) => {
        const Icon = section.icon;
        return (
          <li key={section.title}>
            <article className={lab.presentationLabCatalogRowClassName}>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon aria-hidden className="size-4 shrink-0 text-primary" />
                  <span className={lab.presentationLabMetricLabelClassName}>
                    {section.title}
                  </span>
                </div>
                <h3 className="font-medium text-base text-foreground tracking-tight">
                  {section.path}
                </h3>
                <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
                  {section.description}
                </p>
              </div>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              />
            </article>
          </li>
        );
      })}
    </ul>
  );
}

function AcceptancePipeline() {
  return (
    <section aria-labelledby="acceptance-gates-heading">
      <h2
        className={lab.presentationLabSectionTitleClassName}
        id="acceptance-gates-heading"
      >
        Acceptance gates
      </h2>
      <Timeline className="mt-8 max-w-2xl">
        {acceptanceGates.map((gate, index) => {
          const isLast = index === acceptanceGates.length - 1;
          return (
            <TimelineItem className="gap-x-3" key={gate.command} status="done">
              <TimelineDot
                className="size-5 border-none bg-primary"
                status="custom"
              >
                <span className="font-mono text-[9px] text-primary-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </TimelineDot>
              {!isLast ? (
                <TimelineLine className="min-h-8 bg-border/80" done />
              ) : null}
              <TimelineHeading className="pt-0.5 font-medium text-foreground text-sm">
                {gate.label}
              </TimelineHeading>
              <TimelineContent className="pb-6 pl-0">
                <code className="font-mono text-[11px] text-muted-foreground">
                  {gate.command}
                </code>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </section>
  );
}

export function LabSectionCatalog(_props: LabWelcomeSurfaceProps) {
  return (
    <LabThemeShell shell="editorial">
      <div className={`${lab.presentationLabContainerClassName} gap-8 py-12`}>
        <CatalogIndex />
      </div>
    </LabThemeShell>
  );
}

export function LabAcceptanceGatesPanel(_props: LabWelcomeSurfaceProps) {
  return (
    <LabThemeShell shell="editorial">
      <div className={`${lab.presentationLabContainerClassName} py-12`}>
        <AcceptancePipeline />
      </div>
    </LabThemeShell>
  );
}

export function LabWelcomeBriefing() {
  return <LabWelcomeSurface variant="calm" />;
}

/** Figma MCP source: get_design_context on node 2:2 (loginauth file). */
export const labWelcomeFigmaDesignUrl =
  "https://www.figma.com/design/2ZNqNOxyNb5TwCTBIaMVPD/loginauth?node-id=2-2" as const;

/**
 * Landing surface adapted from Figma MCP output — semantic tokens, not raw hex.
 * Traceability: data-node-id matches the Figma frame layers.
 */
export function LabWelcomeFigmaSurface() {
  return (
    <LabThemeShell shell="airlock">
      <main
        className={lab.presentationLabAirlockMainClassName}
        data-name="Afenda Presentation Lab Landing"
        data-node-id="2:2"
      >
        <p className={lab.presentationLabAirlockKickerClassName} data-node-id="2:3">
          Afenda
        </p>

        <h1 className={airlockTitle.calm} data-node-id="2:4">
          <span className="sr-only">Afenda </span>
          Presentation Lab
        </h1>

        <p className={lab.presentationLabAirlockSubtitleClassName} data-node-id="2:5">
          Verify before ERP.
        </p>

        <p
          className={`${lab.presentationLabAirlockActionClassName} cursor-default`}
          data-node-id="2:6"
          role="note"
        >
          Blocks
          <ArrowRight aria-hidden className="size-5" />
        </p>

        <p
          className="mt-3 font-mono text-[0.65rem] text-muted-foreground/80"
          data-node-id="2:7"
        >
          Sidebar → {PRIMARY_LANE.path}
        </p>
      </main>

      <footer className={lab.presentationLabAirlockFooterClassName} data-node-id="2:8">
        <p>pnpm storybook:ui</p>
        <p className="mt-1 opacity-60">PAS-006 · ADR-0027</p>
      </footer>
    </LabThemeShell>
  );
}

/** shadcn MCP registry items used to compose this surface (not shadcn-studio /cui). */
export const labWelcomeShadcnMcpRegistryItems = [
  "@shadcn/button",
  "@shadcn/badge",
] as const;

/**
 * Landing from shadcn MCP (`shadcn@latest mcp -c packages/shadcn-studio`):
 * search_items → get_item_examples (button-demo, badge-demo) → compose locally.
 * Stock @shadcn has no lab landing block; @ss-blocks needs studio license in MCP env.
 */
export function LabWelcomeShadcnMcpSurface() {
  return (
    <LabThemeShell shell="airlock">
      <main className={lab.presentationLabAirlockMainClassName}>
        <Badge className="tracking-[0.2em]" variant="outline">
          Afenda
        </Badge>

        <h1 className={airlockTitle.calm}>
          <span className="sr-only">Afenda </span>
          Presentation Lab
        </h1>

        <p className={lab.presentationLabAirlockSubtitleClassName}>
          Verify before ERP.
        </p>

        <Button className="mt-12" size="lg">
          {PRIMARY_LANE.label}
          <ArrowRight aria-hidden className="size-5" />
        </Button>

        <p className="mt-3 font-mono text-[0.65rem] text-muted-foreground/80">
          Sidebar → {PRIMARY_LANE.path}
        </p>
      </main>

      <footer className={lab.presentationLabAirlockFooterClassName}>
        <p>pnpm storybook:ui</p>
        <p className="mt-1 opacity-60">PAS-006 · ADR-0027 · shadcn MCP</p>
      </footer>
    </LabThemeShell>
  );
}

function VercelMark() {
  return (
    <svg
      aria-hidden
      className="size-4 shrink-0 text-foreground"
      fill="currentColor"
      viewBox="0 0 76 65"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

/**
 * Vercel plugin design system round — vercel.md UI defaults:
 * shadcn + Geist, dark zinc, borders over gradients, mono for commands.
 */
export function LabWelcomeVercelSurface() {
  return (
    <div className={`${vercelLabPreset.className} vercel-lab-shell relative flex min-h-dvh flex-col`}>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
        <div className="mb-6 flex items-center gap-2">
          <VercelMark />
          <p className="vercel-lab-kicker">Afenda · {vercelLabPreset.label}</p>
        </div>

        <h1 className="vercel-lab-title max-w-4xl text-balance">
          <span className="sr-only">Afenda </span>
          Presentation Lab
        </h1>

        <p className="vercel-lab-subtitle mt-5 text-pretty">
          Verify before ERP.
        </p>

        <Card className="vercel-lab-panel mt-10 w-full max-w-md rounded-lg shadow-none">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-8">
            <Button className="rounded-full px-6" size="lg" variant="outline">
              {PRIMARY_LANE.label}
              <ArrowRight aria-hidden className="size-4" />
            </Button>
            <Separator className="w-full bg-border" />
            <p className="font-mono text-[0.65rem] text-muted-foreground">
              Sidebar → {PRIMARY_LANE.path}
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="relative z-10 border-border border-t px-6 py-5 text-center font-mono text-[0.65rem] text-muted-foreground">
        <p>pnpm storybook:ui</p>
        <p className="mt-1 opacity-70">PAS-006 · ADR-0027 · Vercel plugin</p>
      </footer>
    </div>
  );
}

export type LabSection = (typeof labSections)[number];
export type LabSectionIcon = LucideIcon;
