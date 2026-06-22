import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MetadataState } from "./states/metadata-state";
import {
  metadataStateLatticeArgs,
  metadataStateWithShellSlotsArgs,
  metadataStateWithoutShellSlotsArgs,
} from "./_storybook/metadata-state-story.fixtures";
import {
  metadataCenteredLayout,
  metadataDarkThemeGlobals,
  metadataMobileViewport,
  metadataStatesDocs,
  metadataStoryA11y,
} from "./_storybook/metadata-story.parameters";

const meta = {
  title: "Metadata/States",
  component: MetadataState,
  tags: ["autodocs"],
  parameters: {
    ...metadataCenteredLayout,
    docs: { description: { component: metadataStatesDocs.component } },
    a11y: metadataStoryA11y,
  },
  argTypes: {
    title: { control: "text" },
    message: { control: "text" },
    state: { control: false },
    slots: { control: false },
  },
} satisfies Meta<typeof MetadataState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: metadataStateWithoutShellSlotsArgs,
};

export const WithShellSlots: Story = {
  args: metadataStateWithShellSlotsArgs,
  parameters: {
    docs: {
      description: {
        story:
          "Shell supplies icon, action, and detail slots — metadata-ui renders `data-slot` locations only.",
      },
    },
  },
};

export const Loading: Story = {
  args: metadataStateLatticeArgs.loading,
};

export const Empty: Story = {
  args: metadataStateLatticeArgs.empty,
};

export const Error: Story = {
  args: metadataStateLatticeArgs.error,
};

export const Forbidden: Story = {
  args: metadataStateLatticeArgs.forbidden,
};

export const Degraded: Story = {
  args: metadataStateLatticeArgs.degraded,
};

export const Partial: Story = {
  args: metadataStateLatticeArgs.partial,
};

export const Readonly: Story = {
  args: metadataStateLatticeArgs.readonly,
};

export const Maintenance: Story = {
  args: metadataStateLatticeArgs.maintenance,
};

export const MobileWithSlots: Story = {
  args: metadataStateWithShellSlotsArgs,
  parameters: {
    ...metadataMobileViewport,
    docs: {
      description: {
        story: "Slot layout at mobile width — detail uses `metadata-wrap-anywhere`.",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: metadataStateWithShellSlotsArgs,
  globals: metadataDarkThemeGlobals,
  parameters: {
    docs: {
      description: {
        story: "State chrome under dark Afenda tokens.",
      },
    },
  },
};
