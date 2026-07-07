import "@afenda/shadcn-studio-v2/themes/swiss-noir.css";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

const meta = {
  title: "Shadcn Studio V2/Theme/Swiss Noir",
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Editorial swiss-noir preset — story-level CSS import paired with APCA gate.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PresetProof: Story = {
  tags: ["lab-smoke"],
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Swiss noir</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button type="button">Primary</Button>
        <Button type="button" variant="outline">
          Secondary
        </Button>
      </CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Swiss noir" })
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Primary" })).toBeVisible();
  },
};
