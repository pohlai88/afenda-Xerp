import type { Meta, StoryObj } from "@storybook/react";
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

const TAB_ITEMS = [
  {
    value: "pnpm",
    label: "pnpm",
    content: <DocsCodePanel code="pnpm --filter @afenda/docs dev" variant="inline" />,
  },
  {
    value: "npm",
    label: "npm",
    content: (
      <DocsCodePanel code="npm run dev --workspace @afenda/docs" variant="inline" />
    ),
  },
  {
    value: "types",
    label: "types",
    content: <DocsCodePanel code={SAMPLE_CODE} variant="inline" />,
  },
] as const;

export const InstallTabs: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsTabbedPanel items={[...TAB_ITEMS]} />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="default tabs">
          <DocsTabbedPanel items={[...TAB_ITEMS]} tabsVariant="default" />
        </DocsVariantSection>
        <DocsVariantSection label="line tabs">
          <DocsTabbedPanel items={[...TAB_ITEMS]} tabsVariant="line" />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
