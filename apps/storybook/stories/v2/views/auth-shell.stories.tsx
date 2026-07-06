import { AuthShell } from "@afenda/shadcn-studio-v2";
import { shadcnStudioFullscreenLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { v2SampleAuthActions } from "../v2-view-fixtures";

const meta = {
  title: "Shadcn Studio V2/Views/AuthShell",
  component: AuthShell,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    docs: {
      description: {
        component:
          "L4 authentication shell — ready and non-ready states from @afenda/shadcn-studio-v2.",
      },
    },
  },
  args: {
    title: "Sign in to Afenda",
    description: "Use your workspace credentials to access operator surfaces.",
    actions: v2SampleAuthActions,
    footer: "Need help? Contact your workspace administrator.",
  },
} satisfies Meta<typeof AuthShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Sign in to Afenda" })
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Sign in" })).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const ErrorState: Story = {
  args: { state: "error" },
};

export const Unavailable: Story = {
  args: { state: "unavailable" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};
