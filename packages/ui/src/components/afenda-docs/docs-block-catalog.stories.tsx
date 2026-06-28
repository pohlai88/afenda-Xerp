import type { Meta, StoryObj } from "@storybook/react";
import {
  BookOpenIcon,
  FileCode2Icon,
  LayersIcon,
  PaletteIcon,
  ScanSearchIcon,
  SparklesIcon,
} from "lucide-react";
import { DocsAccordionPanel } from "./docs-accordion-panel";
import { DocsAnnouncementBar } from "./docs-announcement-bar";
import { DocsCallout } from "./docs-callout";
import { DocsCodePanel } from "./docs-code-panel";
import {
  SAMPLE_CODE,
  SAMPLE_COPY_WORKFLOW_STEPS,
  SAMPLE_FAQ_ITEMS,
  SAMPLE_FILE_TREE,
  SAMPLE_INLINE_TOC,
  SAMPLE_PROP_TABLE,
} from "./docs-fixtures";
import { DocsFeatureStrip } from "./docs-feature-strip";
import { DocsFileTree } from "./docs-file-tree";
import { DocsGuideCardGrid } from "./docs-guide-card-grid";
import { DocsInlineToc } from "./docs-inline-toc";
import { DocsPropTable } from "./docs-prop-table";
import { DocsStepsPanel } from "./docs-steps-panel";
import { DocsPreview, DocsVariantSection } from "./docs-story.shared";
import { DocsTabbedPanel } from "./docs-tabbed-panel";

const meta = {
  title: "Afenda Docs / Block Catalog",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Selection overview — compare all Afenda docs blocks and pick variants to copy into apps/docs.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const SelectionBoard: Story = {
  render: () => (
    <DocsPreview width="xl">
      <div className="afenda-docs-block-catalog">
        <header className="afenda-docs-block-catalog__hero">
          <p className="afenda-docs-block-catalog__eyebrow">Afenda Docs</p>
          <h1 className="afenda-docs-block-catalog__title">
            Editorial block catalog
          </h1>
          <p className="afenda-docs-block-catalog__lead">
            Inspired by shadcn/studio /iui and /rui patterns — normalized for
            porcelain docs surfaces. Pick variants, copy TSX + CSS into
            apps/docs, swap preview tokens to --docs-editorial-*.
          </p>
        </header>

        <DocsVariantSection label="announcement bar · accent">
          <DocsAnnouncementBar
            actionHref="#selection"
            actionLabel="Jump to blocks"
            message="Use VariantMatrix stories on each block for side-by-side comparison."
            variant="accent"
          />
        </DocsVariantSection>

        <DocsVariantSection label="guide card grid · featured">
          <DocsGuideCardGrid
            heading="Foundation guides"
            items={[
              {
                title: "Getting started",
                description: "Install, dev server, quality gates.",
                href: "/docs/getting-started",
                badge: "Essential",
                icon: BookOpenIcon,
              },
              {
                title: "Monorepo map",
                description: "Package boundaries and authority layers.",
                href: "/docs/monorepo-map",
                icon: LayersIcon,
              },
              {
                title: "Contributing",
                description: "Session contract and PAS slice handoffs.",
                href: "/docs/contributing",
                icon: FileCode2Icon,
              },
            ]}
            variant="featured"
          />
        </DocsVariantSection>

        <DocsVariantSection label="feature strip · bordered">
          <DocsFeatureStrip
            items={[
              {
                title: "Porcelain material",
                description: "Canvas, rail, and paper layering.",
                icon: PaletteIcon,
                tone: "info",
              },
              {
                title: "Copy-ready",
                description: "Zero @afenda/* runtime in docs.",
                icon: FileCode2Icon,
                tone: "success",
              },
              {
                title: "Governed primitives",
                description: "No className on @afenda/ui.",
                icon: ScanSearchIcon,
              },
              {
                title: "Studio lineage",
                description: "/iui inspiration without raw MCP install.",
                icon: SparklesIcon,
              },
            ]}
            title="Catalog highlights"
            variant="bordered"
          />
        </DocsVariantSection>

        <DocsVariantSection label="steps panel · timeline">
          <DocsStepsPanel
            steps={[...SAMPLE_COPY_WORKFLOW_STEPS]}
            title="Adopt a reference block"
            variant="timeline"
          />
        </DocsVariantSection>

        <DocsVariantSection label="callout · soft">
          <DocsCallout title="Selection tip" variant="soft">
            Open each block story for VariantMatrix — primitive-style galleries
            for every data-variant.
          </DocsCallout>
        </DocsVariantSection>

        <DocsVariantSection label="accordion · separated">
          <DocsAccordionPanel
            items={[...SAMPLE_FAQ_ITEMS]}
            variant="separated"
          />
        </DocsVariantSection>

        <DocsVariantSection label="tabbed panel · line tabs">
          <DocsTabbedPanel
            items={[
              {
                value: "pnpm",
                label: "pnpm",
                content: (
                  <DocsCodePanel
                    code="pnpm --filter @afenda/docs dev"
                    variant="inline"
                  />
                ),
              },
              {
                value: "code",
                label: "types",
                content: <DocsCodePanel code={SAMPLE_CODE} variant="inline" />,
              },
            ]}
            tabsVariant="line"
          />
        </DocsVariantSection>

        <DocsVariantSection label="code panel · panel">
          <DocsCodePanel code={SAMPLE_CODE} title="Sample interface" />
        </DocsVariantSection>

        <DocsVariantSection label="file tree · default">
          <DocsFileTree nodes={SAMPLE_FILE_TREE} />
        </DocsVariantSection>

        <DocsVariantSection label="inline toc · rail">
          <DocsInlineToc items={SAMPLE_INLINE_TOC} variant="rail" />
        </DocsVariantSection>

        <DocsVariantSection label="prop table · compact">
          <DocsPropTable
            caption="DocsGuideCardGrid props"
            rows={SAMPLE_PROP_TABLE}
            variant="compact"
          />
        </DocsVariantSection>
      </div>
    </DocsPreview>
  ),
};
