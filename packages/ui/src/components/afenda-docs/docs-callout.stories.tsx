import type { Meta, StoryObj } from "@storybook/react";
import { DocsCallout } from "./docs-callout";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Callout",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const CALLOUT_BODY =
  "Copy editorial blocks from Storybook into apps/docs — do not import fumadocs-ui in @afenda/ui stories.";

export const Note: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsCallout title="Tip">{CALLOUT_BODY}</DocsCallout>
    </DocsPreview>
  ),
};

export const Warn: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsCallout title="Boundary" tone="warn">
        apps/docs must keep zero @afenda/* runtime dependencies unless the
        dependency registry is updated first.
      </DocsCallout>
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="rail (default)">
          <DocsCallout title="Rail callout" variant="rail">
            {CALLOUT_BODY}
          </DocsCallout>
        </DocsVariantSection>
        <DocsVariantSection label="soft">
          <DocsCallout title="Soft callout" tone="info" variant="soft">
            {CALLOUT_BODY}
          </DocsCallout>
        </DocsVariantSection>
        <DocsVariantSection label="banner">
          <DocsCallout title="Banner callout" variant="banner">
            {CALLOUT_BODY}
          </DocsCallout>
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
