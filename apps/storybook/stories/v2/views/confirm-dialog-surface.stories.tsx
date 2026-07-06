import { ConfirmDialogSurface } from "@afenda/shadcn-studio-v2";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

const meta = {
  title: "Shadcn Studio V2/Views/ConfirmDialogSurface",
  component: ConfirmDialogSurface,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "L4 confirmation dialog surface with default and destructive intents.",
      },
    },
  },
  args: {
    title: "Archive workspace?",
    description:
      "Archived workspaces remain read-only. Operators lose edit access until restored.",
    confirmLabel: "Archive",
    cancelLabel: "Keep workspace",
  },
} satisfies Meta<typeof ConfirmDialogSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadyDefault: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready", intent: "default" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("dialog", { name: "Archive workspace?" })
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Archive" })).toBeVisible();
  },
};

export const ReadyDestructive: Story = {
  args: { state: "ready", intent: "destructive", confirmLabel: "Delete" },
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
