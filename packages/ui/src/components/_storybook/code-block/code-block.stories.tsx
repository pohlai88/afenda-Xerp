import type { Meta, StoryObj } from "@storybook/react";
import { DocsCodePanel } from "../../afenda-docs/docs-code-panel";
import { SAMPLE_CODE } from "../../afenda-docs/docs-fixtures";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "../../afenda-docs/docs-story.shared";
import { StoryFrame, StoryStack } from "../story-frame";
import { StorybookCodeBlock } from "./code-block";
import {
  CODE_BLOCK_HIGHLIGHT_DEMO,
  CODE_BLOCK_TAB_FILES,
  SAMPLE_DOCS_COPY_WORKFLOW,
} from "./code-block-fixtures";

const meta = {
  title: "Storybook / Code Block (Shiki)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * CodeBlockTabs — normalized from shadcn-studio code-block-05.
 *
 * /rui patterns applied:
 *   - tabs-11: TabsList variant="line" (underline, no pill background)
 *   - Shiki dual-theme syntax highlighting (github-light / github-dark)
 *   - Copy button in header (plain HTML button, not governed Button)
 *   - Line numbers via tabular-nums
 *
 * Phase 3 normalization: zero className on Tabs/TabsList/TabsTrigger.
 */
export const CodeBlockTabs: Story = {
  render: () => (
    <StoryFrame width="xl">
      <div className="afenda-docs-preview">
        <StorybookCodeBlock files={[...CODE_BLOCK_TAB_FILES]} width="xl" />
      </div>
    </StoryFrame>
  ),
};

/** Single file with Shiki highlighting — docs copy workflow sample. */
export const SingleFile: Story = {
  render: () => (
    <StoryFrame width="xl">
      <div className="afenda-docs-preview">
        <StorybookCodeBlock
          code={SAMPLE_DOCS_COPY_WORKFLOW}
          filename="workflow.tsx"
          language="tsx"
          showLineNumbers
          width="xl"
        />
      </div>
    </StoryFrame>
  ),
};

/** Highlighted lines — first 4 lines tinted (token workflow steps). */
export const HighlightedLines: Story = {
  render: () => (
    <StoryFrame width="xl">
      <div className="afenda-docs-preview">
        <StorybookCodeBlock
          code={CODE_BLOCK_HIGHLIGHT_DEMO.code}
          filename={CODE_BLOCK_HIGHLIGHT_DEMO.filename}
          highlightLines={[...CODE_BLOCK_HIGHLIGHT_DEMO.highlightLines]}
          language={CODE_BLOCK_HIGHLIGHT_DEMO.language}
          showLineNumbers
          width="xl"
        />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsDocsCodePanel — side-by-side comparison.
 *
 * Left: legacy DocsCodePanel (plain pre/code, no Shiki)
 * Right: StorybookCodeBlock (Shiki + tabs-11 + copy + line numbers)
 *
 * Use this story to decide which block to copy into apps/docs.
 */
export const VsDocsCodePanel: Story = {
  render: () => (
    <StoryFrame width="full">
      <div className="afenda-docs-preview">
        <StoryStack gap="lg">
          <DocsVariantSection label="Legacy — DocsCodePanel (plain pre/code)">
            <DocsPreview width="lg">
              <DocsCodePanel
                code={SAMPLE_CODE}
                title="docs-guide-card-grid.tsx"
              />
            </DocsPreview>
          </DocsVariantSection>

          <DocsVariantSection label="Upgraded — StorybookCodeBlock (Shiki + tabs-11 + copy)">
            <StorybookCodeBlock
              code={SAMPLE_CODE}
              filename="docs-guide-card-grid.tsx"
              language="tsx"
              showLineNumbers
              width="xl"
            />
          </DocsVariantSection>
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};
