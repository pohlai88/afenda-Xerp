import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_COPY_WORKFLOW_STEPS } from "./docs-fixtures";
import { DocsStepsPanel } from "./docs-steps-panel";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Steps Panel",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const CopyWorkflow: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsStepsPanel
        lead="Static numbered panel for onboarding MDX — adapted from shadcn/studio multi-step visual rhythm."
        steps={[...SAMPLE_COPY_WORKFLOW_STEPS]}
        title="Adopt a reference block"
      />
    </DocsPreview>
  ),
};

export const DevSetup: Story = {
  render: () => (
    <DocsPreview width="md">
      <DocsStepsPanel
        steps={[
          {
            title: "Install workspace deps",
            description: "Run pnpm install at the monorepo root.",
          },
          {
            title: "Start @afenda/docs",
            description: "pnpm --filter @afenda/docs dev on port 3001.",
          },
          {
            title: "Run quality gates",
            description:
              "pnpm --filter @afenda/docs test:run && pnpm quality:boundaries.",
          },
        ]}
        title="Local docs setup"
        variant="compact"
      />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="numbered (default)">
          <DocsStepsPanel
            steps={[...SAMPLE_COPY_WORKFLOW_STEPS]}
            title="Numbered steps"
            variant="numbered"
          />
        </DocsVariantSection>
        <DocsVariantSection label="timeline">
          <DocsStepsPanel
            steps={[...SAMPLE_COPY_WORKFLOW_STEPS]}
            title="Timeline steps"
            variant="timeline"
          />
        </DocsVariantSection>
        <DocsVariantSection label="compact">
          <DocsStepsPanel
            steps={[...SAMPLE_COPY_WORKFLOW_STEPS]}
            title="Compact steps"
            variant="compact"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
