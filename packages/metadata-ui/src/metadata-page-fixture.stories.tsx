import type { Meta, StoryObj } from "@storybook/react";

import "@afenda/ui/afenda-ui.css";
import "./styles.css";
import "./fixtures/metadata-ui-fixtures.css";

import { samplePageSurfaceFixture } from "./fixtures/sample-page-surface.fixture";
import {
  renderMetadataFixtureStory,
  renderMetadataFixtureWithAnatomy,
} from "./_storybook/metadata-layout-story.compositions";
import { withFixtureStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataDarkThemeGlobals,
  metadataFixturePageDocs,
  metadataFullscreenLayout,
  metadataMobileViewport,
  metadataStoryA11y,
  metadataTabletViewport,
} from "./_storybook/metadata-story.parameters";

const pageCompositionRegions = [
  { key: "master-detail", label: "Master-detail shell" },
  { key: "detail-summary", label: "Aside detail summary" },
  { key: "master-list", label: "Fulfillment queue table" },
  { key: "audit-evidence", label: "Audit evidence section" },
] as const;

const meta = {
  title: "Metadata/Fixtures/Page",
  tags: ["autodocs"],
  parameters: {
    ...metadataFullscreenLayout,
    docs: { description: { component: metadataFixturePageDocs.component } },
    a11y: metadataStoryA11y,
  },
  decorators: [withFixtureStoryCanvas],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MasterDetailOrderQueue: Story = {
  render: () => renderMetadataFixtureStory(samplePageSurfaceFixture.element),
  parameters: {
    docs: {
      description: {
        story:
          "Order fulfillment queue with contextual actions, selected-order aside, and immutable audit trail.",
      },
    },
  },
};

export const CompositionAnatomy: Story = {
  render: () =>
    renderMetadataFixtureWithAnatomy(
      samplePageSurfaceFixture.element,
      pageCompositionRegions
    ),
  parameters: {
    docs: {
      description: {
        story:
          "Highlights master-detail regions — structurally different from the dashboard fixture rhythm.",
      },
    },
  },
};

export const NarrowViewport: Story = {
  ...MasterDetailOrderQueue,
  parameters: {
    ...MasterDetailOrderQueue.parameters,
    ...metadataMobileViewport,
    docs: {
      description: {
        story:
          "Detail summary stacks above the master queue table on narrow viewports.",
      },
    },
  },
};

export const Tablet: Story = {
  ...MasterDetailOrderQueue,
  parameters: {
    ...MasterDetailOrderQueue.parameters,
    ...metadataTabletViewport,
    docs: {
      description: {
        story:
          "Tablet breakpoint — master-detail regions begin side-by-side where space allows.",
      },
    },
  },
};

export const DarkTheme: Story = {
  ...MasterDetailOrderQueue,
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story: "Master-detail fixture under dark Afenda tokens.",
      },
    },
  },
};
