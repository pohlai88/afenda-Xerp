import { SettingsSurface } from "@afenda/shadcn-studio-v2";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { v2SampleSettingsSections } from "../v2-view-fixtures";

const meta = {
  title: "Shadcn Studio V2/Views/SettingsSurface",
  component: SettingsSurface,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "L4 settings view with grouped items and non-ready state messaging.",
      },
    },
  },
  args: {
    title: "Workspace preferences",
    description: "Configure appearance and notification defaults.",
    sections: v2SampleSettingsSections,
  },
} satisfies Meta<typeof SettingsSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Workspace preferences" })
    ).toBeVisible();
    await expect(canvas.getByText("Dark mode")).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Empty: Story = {
  args: { state: "empty", sections: [] },
};

export const ErrorState: Story = {
  args: { state: "error" },
};

export const Unavailable: Story = {
  args: { state: "unavailable" },
};
