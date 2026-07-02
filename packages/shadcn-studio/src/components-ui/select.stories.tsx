import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select.js";

const meta = {
  component: Select,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("select"),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Select defaultValue="operations">
      <SelectTrigger aria-label="Cost center" className="w-56">
        <SelectValue placeholder="Select cost center" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="operations">Operations</SelectItem>
        <SelectItem value="finance">Finance</SelectItem>
        <SelectItem value="procurement">Procurement</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("combobox", { name: /cost center/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("data-slot", "select-trigger");
    await expect(trigger).toHaveTextContent(/operations/i);

    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const option = await body.findByRole("option", { name: /procurement/i });
    await expect(option).toBeVisible();
    await userEvent.click(option);
    await expect(trigger).toHaveTextContent(/procurement/i);
  },
};

export const Placeholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger aria-label="Warehouse" className="w-56">
        <SelectValue placeholder="Choose warehouse" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="wh-12">Warehouse WH-12</SelectItem>
        <SelectItem value="wh-18">Warehouse WH-18</SelectItem>
      </SelectContent>
    </Select>
  ),
};
