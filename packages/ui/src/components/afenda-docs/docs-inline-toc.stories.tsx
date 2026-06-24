import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_INLINE_TOC } from "./docs-fixtures";
import { DocsInlineToc } from "./docs-inline-toc";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Inline TOC",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const SectionAnchors: Story = {
  render: () => (
    <DocsPreview width="sm">
      <DocsInlineToc items={SAMPLE_INLINE_TOC} />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="sm">
      <DocsVariantStack>
        <DocsVariantSection label="card (default)">
          <DocsInlineToc items={SAMPLE_INLINE_TOC} variant="card" />
        </DocsVariantSection>
        <DocsVariantSection label="rail">
          <DocsInlineToc items={SAMPLE_INLINE_TOC} variant="rail" />
        </DocsVariantSection>
        <DocsVariantSection label="minimal">
          <DocsInlineToc items={SAMPLE_INLINE_TOC} variant="minimal" />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
