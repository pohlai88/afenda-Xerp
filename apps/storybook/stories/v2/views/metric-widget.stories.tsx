import { MetricWidget } from "@afenda/shadcn-studio-v2";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

const meta = {
  title: "Shadcn Studio V2/Views/MetricWidget",
  component: MetricWidget,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "L4 metric widget adapter with tone variants and non-ready states.",
      },
    },
  },
  args: {
    label: "Open approvals",
    description: "Items awaiting operator action in this workspace.",
    value: "24",
    tone: "default",
  },
} satisfies Meta<typeof MetricWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready", value: "24" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Open approvals")).toBeVisible();
    await expect(canvas.getByText("24")).toBeVisible();
  },
};

export const ReadySuccess: Story = {
  args: { state: "ready", value: "98%", tone: "success" },
};

export const ReadyWarning: Story = {
  args: { state: "ready", value: "3", tone: "warning" },
};

export const Loading: Story = {
  args: { state: "loading", value: undefined },
};

export const Empty: Story = {
  args: { state: "empty", value: undefined },
};

export const ErrorState: Story = {
  args: { state: "error", value: undefined },
};

export const Unavailable: Story = {
  args: { state: "unavailable", value: undefined },
};
