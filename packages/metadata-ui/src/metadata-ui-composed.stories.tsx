import type { Meta, StoryObj } from "@storybook/react";

import "@afenda/ui/afenda-ui-full.css";
import "./styles.css";
import "./fixtures/metadata-ui-fixtures.css";

import { sampleDashboardLayoutFixture } from "./fixtures/sample-dashboard-layout.fixture";
import { samplePageSurfaceFixture } from "./fixtures/sample-page-surface.fixture";
import { renderMetadataFixtureStory } from "./_storybook/metadata-layout-story.compositions";
import { withFixtureStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataComposedDocs,
  metadataDarkThemeGlobals,
  metadataFullscreenLayout,
  metadataMobileViewport,
  metadataStoryA11y,
  metadataTabletViewport,
} from "./_storybook/metadata-story.parameters";

const meta = {
  title: "Metadata/Composed",
  tags: ["autodocs"],
  parameters: {
    ...metadataFullscreenLayout,
    docs: { description: { component: metadataComposedDocs.component } },
    a11y: metadataStoryA11y,
  },
  decorators: [withFixtureStoryCanvas],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FulfillmentDashboard: Story = {
  render: () =>
    renderMetadataFixtureStory(sampleDashboardLayoutFixture.element),
  parameters: {
    docs: {
      description: {
        story:
          "Asymmetric shift dashboard: dominant fulfillment rate, metric rail, attention queue, trend evidence, and compact activity table.",
      },
    },
  },
};

export const OrderFulfillmentQueue: Story = {
  render: () => renderMetadataFixtureStory(samplePageSurfaceFixture.element),
  parameters: {
    docs: {
      description: {
        story:
          "Master-detail order workspace with aside summary, queue table, contextual actions, and audit evidence.",
      },
    },
  },
};

export const DashboardTablet: Story = {
  ...FulfillmentDashboard,
  parameters: {
    ...FulfillmentDashboard.parameters,
    ...metadataTabletViewport,
    docs: {
      description: {
        story: "Dashboard composition at tablet width — rail and queue stack before activity table.",
      },
    },
  },
};

export const DashboardMobile: Story = {
  ...FulfillmentDashboard,
  parameters: {
    ...FulfillmentDashboard.parameters,
    ...metadataMobileViewport,
    docs: {
      description: {
        story: "Dashboard composition at mobile width — dominant metric leads, attention queue follows.",
      },
    },
  },
};

export const PageMobile: Story = {
  ...OrderFulfillmentQueue,
  parameters: {
    ...OrderFulfillmentQueue.parameters,
    ...metadataMobileViewport,
    docs: {
      description: {
        story: "Master-detail page stacks detail panel above the fulfillment queue on narrow viewports.",
      },
    },
  },
};

export const DarkTheme: Story = {
  ...FulfillmentDashboard,
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story:
          "Composed dashboard under dark Afenda tokens. Shell applies accent and surface styling — metadata-ui supplies structure only.",
      },
    },
  },
};
