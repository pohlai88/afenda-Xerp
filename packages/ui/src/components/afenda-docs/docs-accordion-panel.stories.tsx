import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_FAQ_ITEMS } from "./docs-fixtures";
import { DocsAccordionPanel } from "./docs-accordion-panel";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Accordion Panel",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Faq: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsAccordionPanel items={[...SAMPLE_FAQ_ITEMS]} />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="contained (default)">
          <DocsAccordionPanel items={[...SAMPLE_FAQ_ITEMS]} variant="contained" />
        </DocsVariantSection>
        <DocsVariantSection label="separated">
          <DocsAccordionPanel items={[...SAMPLE_FAQ_ITEMS]} variant="separated" />
        </DocsVariantSection>
        <DocsVariantSection label="flush">
          <DocsAccordionPanel items={[...SAMPLE_FAQ_ITEMS]} variant="flush" />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
