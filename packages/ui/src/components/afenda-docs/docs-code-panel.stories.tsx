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

/**
 * For Shiki syntax highlighting, multi-file tabs, and copy — see:
 * Storybook / Code Block (Shiki) → VsDocsCodePanel
 *
 * http://localhost:6006/?path=/story/storybook-code-block-shiki--vs-docs-code-panel
 */
export const SeeShikiUpgrade: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsCodePanel
        code={`// Legacy DocsCodePanel — plain pre/code, no Shiki.\n// Upgrade path: Storybook / Code Block (Shiki) → VsDocsCodePanel\n\n${SAMPLE_CODE}`}
        title="See Storybook / Code Block (Shiki)"
      />
    </DocsPreview>
  ),
};
