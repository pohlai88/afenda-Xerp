import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
} from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { ThemeCatalogDemo } from "../v2-theme-compositions";

const meta = {
  title: "Shadcn Studio V2/Theme/ThemeProvider",
  component: ThemeCatalogDemo,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "ThemeProvider and ThemeToggle from the v2 clients barrel — complements global preview decorator.",
      },
    },
  },
} satisfies Meta<typeof ThemeCatalogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLight: Story = {
  tags: ["lab-smoke"],
  render: () => <ThemeCatalogDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Theme catalog")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Toggle color mode" })
    ).toBeVisible();
  },
};

export const ForcedDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => <ThemeCatalogDemo />,
};
