import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_PROP_TABLE } from "./docs-fixtures";
import { DocsPropTable } from "./docs-prop-table";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Prop Table",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GuideCardProps: Story = {
  render: () => (
    <DocsPreview width="xl">
      <DocsPropTable
        caption="DocsGuideCardItem — static prop reference for MDX pages."
        rows={SAMPLE_PROP_TABLE}
      />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="xl">
      <DocsVariantStack>
        <DocsVariantSection label="default">
          <DocsPropTable
            caption="Default spacing"
            rows={SAMPLE_PROP_TABLE}
            variant="default"
          />
        </DocsVariantSection>
        <DocsVariantSection label="compact">
          <DocsPropTable
            caption="Compact spacing"
            rows={SAMPLE_PROP_TABLE}
            variant="compact"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
