import { FormSurface } from "@afenda/shadcn-studio-v2";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { v2SampleFormActions, v2SampleFormFields } from "../v2-view-fixtures";

const meta = {
  title: "Shadcn Studio V2/Views/FormSurface",
  component: FormSurface,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "L4 form view composing Field primitives with loading/empty/error states.",
      },
    },
  },
  args: {
    title: "Profile settings",
    description: "Update operator identity fields for this workspace.",
    fields: v2SampleFormFields,
    actions: v2SampleFormActions,
  },
} satisfies Meta<typeof FormSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Profile settings")).toBeVisible();
    await expect(canvas.getByLabelText("Display name")).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Empty: Story = {
  args: { state: "empty", fields: [] },
};

export const ErrorState: Story = {
  args: { state: "error" },
};

export const Unavailable: Story = {
  args: { state: "unavailable" },
};
