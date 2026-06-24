import type { Meta, StoryObj } from "@storybook/react";
import {
  BookOpenIcon,
  GitBranchIcon,
  LayersIcon,
  ShieldCheckIcon,
  TerminalIcon,
  WorkflowIcon,
} from "lucide-react";
import { DocsGuideCardGrid } from "./docs-guide-card-grid";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Guide Card Grid",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const FOUNDATION_ITEMS = [
  {
    title: "Getting started",
    description:
      "Install dependencies, run the docs dev server, and verify quality gates.",
    href: "/docs/getting-started",
    badge: "Essential",
    icon: BookOpenIcon,
  },
  {
    title: "Monorepo map",
    description:
      "Package boundaries, authority layers, and where documentation lives.",
    href: "/docs/monorepo-map",
    badge: "Architecture",
    icon: LayersIcon,
  },
  {
    title: "Contributing",
    description:
      "Session contract, TIP handoffs, and governance gates before merge.",
    href: "/docs/contributing",
    icon: GitBranchIcon,
  },
] as const;

const PLATFORM_ITEMS = [
  {
    title: "UI governance",
    description: "TIP-004 composition rules and ui:guard gates.",
    href: "/docs/governance/ui",
    icon: ShieldCheckIcon,
  },
  {
    title: "Delivery workflow",
    description: "TIP slices, runtime matrix, and documentation drift.",
    href: "/docs/delivery",
    icon: WorkflowIcon,
  },
] as const;

export const PorcelainCatalog: Story = {
  render: () => (
    <DocsPreview width="xl">
      <DocsGuideCardGrid
        eyebrow="Start here"
        heading="Foundation guides"
        items={[...FOUNDATION_ITEMS]}
        lead="Editorial card grid for Fumadocs home and section indexes."
      />
    </DocsPreview>
  ),
};

export const CompactTwoColumn: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsGuideCardGrid heading="Platform spine" items={[...PLATFORM_ITEMS]} />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="xl">
      <DocsVariantStack>
        <DocsVariantSection label="grid (default)">
          <DocsGuideCardGrid
            heading="Foundation guides"
            items={[...FOUNDATION_ITEMS]}
            variant="grid"
          />
        </DocsVariantSection>
        <DocsVariantSection label="compact">
          <DocsGuideCardGrid
            heading="Platform spine"
            items={[...PLATFORM_ITEMS]}
            variant="compact"
          />
        </DocsVariantSection>
        <DocsVariantSection label="featured">
          <DocsGuideCardGrid
            heading="Featured layout"
            items={[
              {
                title: "Terminal workflows",
                description: "Quality gates and monorepo commands.",
                href: "/docs/contributing",
                badge: "Ops",
                icon: TerminalIcon,
              },
              ...PLATFORM_ITEMS,
            ]}
            variant="featured"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
