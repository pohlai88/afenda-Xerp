import { PageSurface } from "@afenda/shadcn-studio-v2";
import { shadcnStudioFullscreenLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { v2SamplePageContent, v2SamplePageToolbar } from "../v2-view-fixtures";

const meta = {
  title: "Shadcn Studio V2/Views/PageSurface",
  component: PageSurface,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    docs: {
      description: {
        component:
          "L4 page shell with topbar, optional sidebar, and view-state messaging.",
      },
    },
  },
  args: {
    title: "Workspace dashboard",
    description: "Operator overview for the active workspace.",
    toolbar: v2SamplePageToolbar,
    children: v2SamplePageContent,
  },
} satisfies Meta<typeof PageSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Workspace dashboard" })
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Export" })).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Empty: Story = {
  args: { state: "empty" },
};

export const ErrorState: Story = {
  args: { state: "error" },
};

export const Unavailable: Story = {
  args: { state: "unavailable" },
};
