import { DataTableSurface } from "@afenda/shadcn-studio-v2";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { v2SampleTableColumns, v2SampleTableRows } from "../v2-view-fixtures";

const meta = {
  title: "Shadcn Studio V2/Views/DataTableSurface",
  component: DataTableSurface,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "L4 data table view with column metadata and non-ready state messaging.",
      },
    },
  },
  args: {
    title: "Team members",
    description: "Active operators assigned to this workspace.",
    columns: v2SampleTableColumns,
    rows: v2SampleTableRows,
    caption: "Sample roster for Storybook catalog verification.",
  },
} satisfies Meta<typeof DataTableSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  tags: ["lab-smoke"],
  args: { state: "ready" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Team members" })
    ).toBeVisible();
    await expect(canvas.getByRole("cell", { name: "Alex Chen" })).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Empty: Story = {
  args: { state: "empty", rows: [] },
};

export const ErrorState: Story = {
  args: { state: "error" },
};

export const Unavailable: Story = {
  args: { state: "unavailable" },
};
