import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { shadcnStudioFullscreenLayout } from "@afenda/shadcn-studio/lab";
import { PresentationLabLanding } from "../../../packages/shadcn-studio/src/storybook/presentation-lab/presentation-lab-landing.js";

const meta = {
  title: "Presentation Lab/Verdant Milk Noir",
  component: PresentationLabLanding,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    docs: {
      description: {
        component:
          "Composition reference — ghost hero, milk Lab title, gold-hairline float box as the jewel. Verdant green-black atmosphere (L4 lab only). Compare with Swiss Noir Control Room for palette craft.",
      },
    },
  },
} satisfies Meta<typeof PresentationLabLanding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerdantMilkNoir: Story = {
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
