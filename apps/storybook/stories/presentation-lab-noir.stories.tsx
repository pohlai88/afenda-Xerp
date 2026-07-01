import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { shadcnStudioFullscreenLayout } from "@afenda/shadcn-studio/lab";
import { PresentationLabNoirLanding } from "../../../packages/shadcn-studio/src/storybook/presentation-lab/presentation-lab-noir-landing.js";

const meta = {
  title: "Presentation Lab/Swiss Noir Control Room",
  component: PresentationLabNoirLanding,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    docs: {
      description: {
        component:
          "Palette reference — blue-black canvas, amber gold primary, blueprint whisper. Editorial Swiss Noir material (L4 lab only). Compare with Verdant Milk Noir for composition hierarchy.",
      },
    },
  },
} satisfies Meta<typeof PresentationLabNoirLanding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SwissNoirControlRoom: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: /Presentation Lab/i, level: 1 })
    ).toBeVisible();
    await expect(
      canvas.getByRole("heading", {
        name: /Interface becomes infrastructure only after proof/i,
        level: 2,
      })
    ).toBeVisible();
    await expect(
      canvas.getByText(/quiet proving ground for governed enterprise interfaces/i)
    ).toBeVisible();
    await expect(canvas.getByText("pnpm storybook:ui")).toBeVisible();
    await expect(
      canvas.getByText(/not a demo · not decoration · verification before import/i)
    ).toBeVisible();
  },
};
