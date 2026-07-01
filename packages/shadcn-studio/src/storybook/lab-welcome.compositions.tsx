import { Badge } from "../components-ui/badge.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components-ui/card.js";
import { Separator } from "../components-ui/separator.js";

const labSections = [
  {
    title: "Shadcn Studio / Blocks",
    description:
      "Curated MCP blocks with dark variants, fixture data, and metadata hydration labs.",
  },
  {
    title: "Shadcn Studio / Blocks Auto",
    description:
      "Codegen smoke — one story per self-contained page block after `pnpm storybook generate`.",
  },
  {
    title: "Shadcn Studio / Blocks Flat",
    description:
      "Flat block registry stories — fixture-backed compositions for page shells.",
  },
  {
    title: "Shadcn Studio / App Shell",
    description:
      "Operator app shell — sidebar, header, and nav before route promotion.",
  },
  {
    title: "Shadcn Studio / Theme Lab",
    description:
      "ThemeCustomizer and THEME_PRESET_SLUGS matrix — light and dark verification.",
  },
  {
    title: "Shadcn Studio / Primitives",
    description:
      "Governed `@/components-ui` primitives — contract slots and Base UI adapters.",
  },
] as const;

const acceptanceGates = [
  "pnpm storybook generate",
  "pnpm --filter @afenda/storybook typecheck",
  "pnpm test:storybook:run",
  "pnpm check:studio-block-slot-markers",
  "pnpm --filter @afenda/erp typecheck && build",
] as const;

export function LabWelcomeSurface() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-2">
      <header className="space-y-3 text-center">
        <Badge className="rounded-full" variant="secondary">
          PAS-006 · ADR-0027
        </Badge>
        <h1 className="font-heading font-semibold text-3xl tracking-tight">
          Afenda Presentation Lab
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-muted-foreground text-sm leading-relaxed">
          Editorial verification surface for shadcn/studio blocks, theme presets,
          and governed primitives before ERP promotion. CSS chain mirrors{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground text-xs">
            apps/erp/globals.css
          </code>
          .
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {labSections.map((section) => (
          <Card key={section.title} size="sm">
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acceptance gates</CardTitle>
          <CardDescription>
            Run before promoting a block or primitive to ERP operator surfaces.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {acceptanceGates.map((gate, index) => (
            <div key={gate}>
              <code className="block rounded-md bg-muted px-3 py-2 font-mono text-xs">
                {gate}
              </code>
              {index < acceptanceGates.length - 1 ? (
                <Separator className="my-2" />
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
