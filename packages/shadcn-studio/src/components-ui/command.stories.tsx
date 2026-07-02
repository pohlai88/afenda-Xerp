import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command.js";

const meta = {
  component: Command,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("command"),
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Command className="w-full max-w-sm rounded-lg border shadow-xs">
      <CommandInput
        aria-label="Search ERP modules"
        placeholder="Search ERP modules…"
      />
      <CommandList>
        <CommandEmpty>No modules match your search.</CommandEmpty>
        <CommandGroup heading="Workspace">
          <CommandItem>Purchase orders</CommandItem>
          <CommandItem>Inventory transfers</CommandItem>
          <CommandItem>Vendor approvals</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvas, canvasElement }) => {
    const commandRoot = canvasElement.querySelector('[data-slot="command"]');
    await expect(commandRoot).toHaveAttribute("data-slot", "command");

    const search = canvas.getByLabelText(/search erp modules/i);
    await expect(search).toBeVisible();
    await userEvent.type(search, "Vendor");

    await expect(canvas.getByText("Vendor approvals")).toBeVisible();
    await expect(canvas.queryByText("Purchase orders")).not.toBeInTheDocument();
  },
};

export const EmptyState: Story = {
  render: () => (
    <Command className="w-full max-w-sm rounded-lg border shadow-xs">
      <CommandInput placeholder="Search ledger accounts…" />
      <CommandList>
        <CommandEmpty>No accounts found.</CommandEmpty>
        <CommandGroup heading="Accounts">
          <CommandItem>Cash — MYR</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
