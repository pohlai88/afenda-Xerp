import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet.js";

const meta = {
  component: Sheet,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("sheet"),
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Sheet>
      <SheetTrigger>Open shipment panel</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inbound shipment WH-12</SheetTitle>
          <SheetDescription>
            Track receiving status and dock appointments for PO-1042.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", {
      name: /open shipment panel/i,
    });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("data-slot", "sheet-trigger");

    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByRole("heading", { name: /inbound shipment WH-12/i })
    ).toBeInTheDocument();
  },
};
