import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MetadataActionBar } from "./client/metadata-action-renderer.client";
import { InteractiveActionBarDemo } from "./_storybook/metadata-action-bar-story.compositions";
import {
  disabledActionFixtures,
  hiddenActionFixtures,
  hierarchyActionFixtures,
  multiplePrimaryActionFixtures,
} from "./_storybook/metadata-action-bar-story.fixtures";
import {
  metadataActionsDocs,
  metadataDarkThemeGlobals,
  metadataPaddedLayout,
  metadataStoryA11y,
} from "./_storybook/metadata-story.parameters";
import { sampleDiagnosticsRenderContext } from "./fixtures/sample-runtime-context.fixture";

const meta = {
  title: "Metadata/Actions",
  component: MetadataActionBar,
  tags: ["autodocs"],
  parameters: {
    ...metadataPaddedLayout,
    docs: { description: { component: metadataActionsDocs.component } },
    a11y: metadataStoryA11y,
  },
  argTypes: {
    actions: { control: false },
    context: { control: false },
    onAction: { control: false },
    onActionResult: { control: false },
    label: {
      control: "text",
      description: "Accessible name for the action group region.",
      table: { defaultValue: { summary: "Actions" } },
    },
  },
} satisfies Meta<typeof MetadataActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HierarchyHooks: Story = {
  args: {
    actions: hierarchyActionFixtures,
    label: "Fulfillment actions",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary export, primary release, and tertiary help link — inspect `data-action-group` on each control.",
      },
    },
  },
};

export const DisabledWithReason: Story = {
  args: {
    actions: disabledActionFixtures,
    label: "Period close actions",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled primary action keeps `aria-disabled` and exposes reason via `aria-describedby`.",
      },
    },
  },
};

export const HiddenPrimary: Story = {
  args: {
    actions: hiddenActionFixtures,
    label: "Filtered actions",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hidden actions are removed from the DOM — only visible controls render in the bar.",
      },
    },
  },
};

export const MultiplePrimaryDiagnostic: Story = {
  args: {
    actions: multiplePrimaryActionFixtures,
    context: sampleDiagnosticsRenderContext,
    label: "Conflicting primaries",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Diagnostics enabled: more than one visible primary action surfaces a boundary warning.",
      },
    },
  },
};

export const InteractiveHandler: Story = {
  render: () => <InteractiveActionBarDemo />,
  args: {
    actions: hierarchyActionFixtures,
    label: "Interactive demo",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Client action bar with async handler and `onActionResult` callback — last handled action shown below.",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    actions: hierarchyActionFixtures,
    label: "Fulfillment actions",
  },
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story: "Action hooks under dark Afenda tokens — shell owns accent styling.",
      },
    },
  },
};
