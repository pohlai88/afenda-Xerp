import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  metadataDashboardStructuralArgs,
  metadataLayoutShellArgs,
  metadataPageSurfaceStructuralArgs,
  metadataReadonlyPageSurfaceArgs,
} from "./_storybook/metadata-layout-story.fixtures";
import {
  renderMetadataDashboardStructuralStory,
  renderMetadataLayoutShellStory,
  renderMetadataPageSurfaceStructuralStory,
  renderMetadataProductionUtilitiesStory,
} from "./_storybook/metadata-layout-story.compositions";
import { withRawStoryCanvas } from "./_storybook/metadata-story.decorators";
import {
  metadataDarkThemeGlobals,
  metadataFullscreenLayout,
  metadataMobileViewport,
  metadataRawDocs,
  metadataStoryA11y,
  metadataTabletViewport,
} from "./_storybook/metadata-story.parameters";

const meta = {
  title: "Metadata/Raw",
  tags: ["autodocs"],
  parameters: {
    ...metadataFullscreenLayout,
    docs: { description: { component: metadataRawDocs.component } },
    a11y: metadataStoryA11y,
  },
  decorators: [withRawStoryCanvas],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutShell: Story = {
  render: () => renderMetadataLayoutShellStory(metadataLayoutShellArgs),
  parameters: {
    docs: {
      description: {
        story:
          "Dashboard layout regions with container queries and production slot hooks. No `metadata-fixture-*` classes.",
      },
    },
  },
};

export const PageSurfaceStructural: Story = {
  render: () =>
    renderMetadataPageSurfaceStructuralStory(metadataPageSurfaceStructuralArgs),
  parameters: {
    docs: {
      description: {
        story:
          "Fulfillment queue surface with secondary, primary, and help action groups exposed as `data-action-group` only.",
      },
    },
  },
};

export const ReadonlyPageSurface: Story = {
  render: () =>
    renderMetadataPageSurfaceStructuralStory(metadataReadonlyPageSurfaceArgs),
  parameters: {
    docs: {
      description: {
        story:
          "Read-only runtime exposes `data-metadata-readonly` and reason without line-through treatment on actions.",
      },
    },
  },
};

export const DashboardStructural: Story = {
  render: () =>
    renderMetadataDashboardStructuralStory(metadataDashboardStructuralArgs),
  parameters: {
    docs: {
      description: {
        story:
          "Single production summary region — deliberately avoids fixture KPI grids and demo composition classes.",
      },
    },
  },
};

export const ProductionUtilities: Story = {
  render: () => renderMetadataProductionUtilitiesStory(),
  parameters: {
    docs: {
      description: {
        story:
          "Structural utilities: `metadata-numeric`, `metadata-truncate`, and `metadata-wrap-anywhere`.",
      },
    },
  },
};

export const Tablet: Story = {
  ...LayoutShell,
  parameters: {
    ...LayoutShell.parameters,
    ...metadataTabletViewport,
    docs: {
      description: {
        story:
          "Layout shell at tablet width — validates container-query region stacking.",
      },
    },
  },
};

export const Mobile: Story = {
  ...PageSurfaceStructural,
  parameters: {
    ...PageSurfaceStructural.parameters,
    ...metadataMobileViewport,
    docs: {
      description: {
        story:
          "Page surface at mobile width — action bar and table remain structurally governed.",
      },
    },
  },
};

export const DarkTheme: Story = {
  ...LayoutShell,
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story:
          "Structural chrome under dark Afenda tokens. Toggle Theme in the Storybook toolbar to compare.",
      },
    },
  },
};
