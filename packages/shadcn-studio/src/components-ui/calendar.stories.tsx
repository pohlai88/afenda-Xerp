import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { expect, userEvent } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { Calendar } from "./calendar.js";

const JUNE_2026 = new Date(2026, 5, 1);

function PurchaseOrderDueDateCalendar() {
  const [selected, setSelected] = React.useState<Date>();

  return (
    <Calendar
      className="rounded-md border"
      defaultMonth={JUNE_2026}
      mode="single"
      onSelect={setSelected}
      selected={selected}
    />
  );
}

const meta = {
  component: Calendar,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("calendar"),
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => <PurchaseOrderDueDateCalendar />,
  play: async ({ canvas, canvasElement }) => {
    const calendarRoot = canvasElement.querySelector('[data-slot="calendar"]');
    await expect(calendarRoot).toHaveAttribute("data-slot", "calendar");

    await userEvent.click(
      canvas.getByRole("button", { name: /go to the next month/i })
    );
    await expect(canvas.getByText("July 2026")).toBeVisible();
  },
};

export const MonthNavigation: Story = {
  render: () => (
    <Calendar
      className="rounded-md border"
      defaultMonth={JUNE_2026}
      mode="single"
    />
  ),
};
