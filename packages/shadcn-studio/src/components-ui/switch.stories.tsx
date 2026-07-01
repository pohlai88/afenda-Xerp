import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { Label } from "./label.js";
import {
  shadcnStudioDarkThemeGlobals,
} from "../storybook/story-parameters.js";
import {
  switchOutline06DestructiveClassName,
  switchOutline06InfoClassName,
  switchOutline06PrimaryClassName,
  switchOutline06SuccessClassName,
  switchOutline06WarningClassName,
} from "./switch.contract.js";
import { Switch } from "./switch.js";

const meta = {
  component: Switch,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    shadcnStudioPreset: "default",
    docs: {
      description: {
        component:
          "Base UI switch. switch-06 passes outline classes on the **root** only (`[&_span]`); thumb keeps base-vega `switchThumbClassName`. Use `variant=\"outline\"` for the primary outline preset.",
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { "aria-label": "Enable notifications" },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: /enable notifications/i });
    await expect(toggle).toHaveAttribute("data-slot", "switch");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
  },
};

export const Checked: Story = {
  args: { "aria-label": "Dark mode", defaultChecked: true },
};

export const Small: Story = {
  args: { "aria-label": "Compact switch", size: "sm" },
};

/** Registry switch-06 — verbatim class strings on AdminCN dark (matches shadcnstudio.com). */
export const SwitchOutline06: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => (
    <div className="flex items-center gap-3 bg-black p-8">
      <Switch
        aria-label="Default outline Switch"
        className={switchOutline06PrimaryClassName}
        defaultChecked
      />
      <Switch
        aria-label="Destructive Switch"
        className={switchOutline06DestructiveClassName}
        defaultChecked
      />
      <Switch
        aria-label="Success outline Switch"
        className={switchOutline06SuccessClassName}
        defaultChecked
      />
      <Switch
        aria-label="Info outline Switch"
        className={switchOutline06InfoClassName}
        defaultChecked
      />
      <Switch
        aria-label="Warning outline Switch"
        className={switchOutline06WarningClassName}
        defaultChecked
      />
    </div>
  ),
};

export const SwitchOutline06Variant: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => (
    <div className="flex items-center gap-3 bg-black p-8">
      <Switch
        aria-label="Outline variant primary"
        defaultChecked
        variant="outline"
      />
      <Label className="text-muted-foreground text-sm">
        variant=&quot;outline&quot; (primary switch-06 preset)
      </Label>
    </div>
  ),
};

export const DarkModeValidation: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-lg border border-border bg-background p-6">
        <h3 className="mb-4 font-medium text-sm">Light · default</h3>
        <Switch aria-label="Light default" defaultChecked />
      </section>

      <section className="dark rounded-lg border border-border bg-background p-6">
        <h3 className="mb-4 font-medium text-sm">Dark · default vs outline</h3>
        <div className="flex flex-wrap items-center gap-6">
          <Switch aria-label="Dark default" defaultChecked variant="default" />
          <Switch aria-label="Dark outline" defaultChecked variant="outline" />
        </div>
      </section>
    </div>
  ),
};
