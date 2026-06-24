import type { Meta, StoryObj } from "@storybook/react";
import { DocsCallout } from "./docs-callout";
import { DocsCodePanel } from "./docs-code-panel";
import { SAMPLE_CODE } from "./docs-fixtures";
import { DocsTabbedPanel } from "./docs-tabbed-panel";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Tabbed Panel",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const INSTALL_TABS = [
  {
    value: "pnpm",
    label: "pnpm",
    content: (
      <DocsCodePanel code="pnpm --filter @afenda/docs dev" variant="inline" />
    ),
  },
  {
    value: "npm",
    label: "npm",
    content: (
      <DocsCodePanel
        code="npm run dev --workspace @afenda/docs"
        variant="inline"
      />
    ),
  },
  {
    value: "types",
    label: "types",
    content: <DocsCodePanel code={SAMPLE_CODE} variant="inline" />,
  },
] as const;

const CONTENT_TABS = [
  {
    value: "overview",
    label: "Overview",
    content: (
      <DocsCallout title="What is this?" tone="info">
        The line variant from tabs-11 is the enterprise docs standard — bottom
        border only, no background pill, flush underline on the active tab.
      </DocsCallout>
    ),
  },
  {
    value: "usage",
    label: "Usage",
    content: (
      <DocsCallout title="Copy workflow" tone="note">
        Pick a variant in Storybook, copy the TSX to apps/docs/src/components,
        swap --docs-preview-* to --docs-editorial-*.
      </DocsCallout>
    ),
  },
  {
    value: "governance",
    label: "Governance",
    content: (
      <DocsCallout title="Boundary" tone="warn">
        Never import @afenda/ui governed primitives inside apps/docs at runtime.
        Use the copy-and-swap workflow.
      </DocsCallout>
    ),
  },
] as const;

/**
 * LineDefault — primary showcase for the /rui tabs-11 improvement.
 *
 * tabs-11 pattern applied:
 *   - TabsList variant="line" — bottom border only, no background pill
 *   - Active tab: flush underline indicator at bottom (-bottom-px)
 *   - No rounded background on the trigger — clean docs navigation standard
 *
 * This is now the DocsTabbedPanel DEFAULT (tabsVariant="line").
 */
export const LineDefault: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="line (new default) — from tabs-11 · enterprise docs navigation">
          <DocsTabbedPanel items={[...INSTALL_TABS]} />
        </DocsVariantSection>

        <DocsVariantSection label="line — rich content tabs (overview / usage / governance)">
          <DocsTabbedPanel items={[...CONTENT_TABS]} />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};

/** InstallTabs — the canonical code-snippet tabbed panel. Uses line by default. */
export const InstallTabs: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsTabbedPanel items={[...INSTALL_TABS]} />
    </DocsPreview>
  ),
};

/**
 * VariantMatrix — line vs pill comparison.
 *
 * line = enterprise docs standard (tabs-11 pattern)
 * default = pill/ghost — retained for compatibility, not recommended for docs
 */
export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="line — recommended for docs (tabs-11 pattern, now default)">
          <DocsTabbedPanel items={[...INSTALL_TABS]} tabsVariant="line" />
        </DocsVariantSection>

        <DocsVariantSection label="default — pill/ghost (retained for compatibility)">
          <DocsTabbedPanel items={[...INSTALL_TABS]} tabsVariant="default" />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
