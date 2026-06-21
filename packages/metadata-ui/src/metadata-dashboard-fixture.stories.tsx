import type { Meta, StoryObj } from "@storybook/react";

import "@afenda/ui/afenda-ui-full.css";
import "./styles.css";
import "./fixtures/metadata-ui-fixtures.css";

import { sampleDashboardLayoutFixture } from "./fixtures/sample-dashboard-layout.fixture";
import {
  renderMetadataFixtureStory,
  renderMetadataFixtureWithAnatomy,
} from "./_storybook/metadata-layout-story.compositions";
import { withFixtureStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataDarkThemeGlobals,
  metadataFixtureDashboardDocs,
  metadataFullscreenLayout,
  metadataMobileViewport,
  metadataStoryA11y,
  metadataTabletViewport,
} from "./_storybook/metadata-story.parameters";

const dashboardCompositionRegions = [
  { key: "dominant-metric", label: "Dominant fulfillment metric" },
  { key: "metric-rail", label: "Secondary metric rail" },
  { key: "attention-queue", label: "Exception / attention queue" },
  { key: "trend-evidence", label: "Trend evidence slot" },
  { key: "recent-activity", label: "Compact activity table" },
] as const;

const meta = {
  title: "Metadata/Fixtures/Dashboard",
  tags: ["autodocs"],
  parameters: {
    ...metadataFullscreenLayout,
    docs: { description: { component: metadataFixtureDashboardDocs.component } },
    a11y: metadataStoryA11y,
  },
  decorators: [withFixtureStoryCanvas],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AsymmetricOperationsDashboard: Story = {
  render: () =>
    renderMetadataFixtureStory(sampleDashboardLayoutFixture.element),
  parameters: {
    docs: {
      description: {
        story:
          "Reference asymmetric composition for fulfillment operations — not a uniform KPI card grid.",
      },
    },
  },
};

export const CompositionAnatomy: Story = {
  render: () =>
    renderMetadataFixtureWithAnatomy(
      sampleDashboardLayoutFixture.element,
      dashboardCompositionRegions
    ),
  parameters: {
    docs: {
      description: {
        story:
          "Maps each `data-fixture-composition` region to its ERP purpose before reviewing the full fixture.",
      },
    },
  },
};

export const NarrowViewport: Story = {
  ...AsymmetricOperationsDashboard,
  parameters: {
    ...AsymmetricOperationsDashboard.parameters,
    ...metadataMobileViewport,
    docs: {
      description: {
        story: "Validates asymmetric regions collapse cleanly on mobile warehouse tablets.",
      },
    },
  },
};

export const Tablet: Story = {
  ...AsymmetricOperationsDashboard,
  parameters: {
    ...AsymmetricOperationsDashboard.parameters,
    ...metadataTabletViewport,
    docs: {
      description: {
        story: "Tablet breakpoint — rail and queue share a row before activity evidence.",
      },
    },
  },
};

export const DarkTheme: Story = {
  ...AsymmetricOperationsDashboard,
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story: "Fixture composition under dark Afenda tokens.",
      },
    },
  },
};
