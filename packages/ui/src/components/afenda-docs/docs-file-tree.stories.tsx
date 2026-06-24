import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_FILE_TREE } from "./docs-fixtures";
import { DocsFileTree } from "./docs-file-tree";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / File Tree",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ContentLayout: Story = {
  render: () => (
    <DocsPreview width="md">
      <DocsFileTree nodes={SAMPLE_FILE_TREE} />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="md">
      <DocsVariantStack>
        <DocsVariantSection label="default">
          <DocsFileTree nodes={SAMPLE_FILE_TREE} variant="default" />
        </DocsVariantSection>
        <DocsVariantSection label="compact">
          <DocsFileTree nodes={SAMPLE_FILE_TREE} variant="compact" />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
