import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { Button } from "../../components-ui/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components-ui/card.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const CardDemo = () => (
  <Card className="w-96">
    <CardHeader>
      <CardTitle>Operator summary</CardTitle>
      <CardDescription>
        Stock theme card for agentic smoke coverage.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">3 pending approvals</p>
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

/**
 * Summary card for operator workload snapshot and quick decision framing.
 *
 * @summary for compact workload summary display
 */
export const Summary: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Operator summary")).toBeVisible();
    await expect(canvas.getByText(/3 pending approvals/i)).toBeVisible();
  },
};

/**
 * Card with explicit actions for quick operator follow-up tasks.
 *
 * @summary for summary cards with immediate follow-up actions
 */
export const WithActions: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Operator summary</CardTitle>
        <CardDescription>Review and resolve pending approvals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">3 pending approvals</p>
        <div className="flex gap-2">
          <Button size="sm">Review</Button>
          <Button size="sm" variant="outline">
            Snooze
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Dense card layout for constrained dashboard slots.
 *
 * @summary for compact high-density information cards
 */
export const Dense: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Approvals</CardTitle>
        <CardDescription>Today</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">3 pending approvals</p>
      </CardContent>
    </Card>
  ),
};
