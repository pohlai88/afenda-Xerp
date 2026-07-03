import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components-ui/card.js";
import {
  agenticCenteredMetaParameters,
} from "./agentic-story-parameters.js";

const CardDemo = () => (
  <Card className="w-96">
    <CardHeader>
      <CardTitle>Operator summary</CardTitle>
      <CardDescription>Stock theme card for agentic smoke coverage.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">3 pending approvals</p>
    </CardContent>
  </Card>
);

const meta = {
  title: "Agentic/Card",
  component: CardDemo,
  tags: ["autodocs", "ai-generated"],
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof CardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Operator summary")).toBeVisible();
    await expect(canvas.getByText(/3 pending approvals/i)).toBeVisible();
  },
};
