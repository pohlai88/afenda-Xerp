import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import "../../docs/swiss-noir.css";

import { EnterpriseTokenDashboardSideBySide } from "../storybook/enterprise-token-dashboard.compositions.js";
import {
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Token Verification",
  tags: ["autodocs", "lab-smoke"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    shadcnStudioPreset: "default",
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Enterprise token + component verification dashboard. Three palette series side by side: AdminCN Light, AdminCN Dark, and Brand Dark (Figma Color Brand / Swiss Noir DNA). Catches palette drift, missing semantic tokens, and broken primitives before ERP. Code SSOT; optional Figma capture via generate_figma_design.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  globals: {
    theme: "light",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnterpriseDashboard: Story = {
  render: () => <EnterpriseTokenDashboardSideBySide />,
  globals: {
    theme: "light",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full semantic palette swatches plus live primitives — AdminCN :root, AdminCN .dark, and Brand Dark (.dark + .theme-afenda-brand). Keep Storybook toolbar theme on **light** for side-by-side; toggling global dark breaks the light column (CSS var inheritance). Brand column uses Swiss Noir canvas + gold primary.",
      },
    },
    // Token verification surfaces intentional palette/contrast samples; axe is manual in Storybook UI.
    a11y: { test: "off" as const },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByTestId("enterprise-token-dashboard")
    ).toBeVisible();
    await expect(canvas.getByText("Light mode")).toBeVisible();
    await expect(canvas.getByText("Dark mode")).toBeVisible();
    await expect(canvas.getByText("Brand dark")).toBeVisible();
    await expect(canvas.getByText("Swiss Noir anchors")).toBeVisible();
    await expect(canvas.getAllByText("Color palette").length).toBeGreaterThan(
      0
    );
    await expect(
      canvas.getAllByRole("button", { name: "Primary" }).length
    ).toBeGreaterThan(0);
  },
};
