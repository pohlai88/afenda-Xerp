import type { Meta, StoryObj } from "@storybook/react";
import { DocsAnnouncementBar } from "./docs-announcement-bar";
import {
  DocsPreview,
  DocsVariantSection,
  DocsVariantStack,
} from "./docs-story.shared";

const meta = {
  title: "Afenda Docs / Announcement Bar",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const AccentWithAction: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsAnnouncementBar
        actionHref="/docs/getting-started"
        actionLabel="Read the guide"
        message="Afenda Docs blocks are copy-ready — preview variants here, adopt in apps/docs."
        variant="accent"
      />
    </DocsPreview>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <DocsPreview width="lg">
      <DocsVariantStack>
        <DocsVariantSection label="accent">
          <DocsAnnouncementBar
            actionHref="#"
            actionLabel="Learn more"
            message="New porcelain editorial palette for documentation surfaces."
            variant="accent"
          />
        </DocsVariantSection>
        <DocsVariantSection label="neutral">
          <DocsAnnouncementBar
            message="Storybook previews Afenda-owned blocks — live docs still use fumadocs-ui via mdx.tsx."
            variant="neutral"
          />
        </DocsVariantSection>
        <DocsVariantSection label="warn">
          <DocsAnnouncementBar
            message="Do not import @afenda/ui from apps/docs without updating the dependency registry."
            variant="warn"
          />
        </DocsVariantSection>
      </DocsVariantStack>
    </DocsPreview>
  ),
};
