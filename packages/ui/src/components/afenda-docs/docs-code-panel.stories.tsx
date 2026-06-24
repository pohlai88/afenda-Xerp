import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_CODE } from "./docs-fixtures";
import { DocsCodePanel } from "./docs-code-panel";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Code Panel",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TypeScript: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsCodePanel code={SAMPLE_CODE} title="docs-guide-card-grid.tsx" />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="panel (default)">
          <DocsCodePanel
            code={SAMPLE_CODE}
            title="Panel with chrome"
            variant="panel"
          />
        </DocsVariantSection>
        <DocsVariantSection label="inline">
          <DocsCodePanel code={SAMPLE_CODE} variant="inline" />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
