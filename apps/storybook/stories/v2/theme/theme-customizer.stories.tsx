import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeCustomizer,
} from "@afenda/shadcn-studio-v2";
import { ThemeProvider } from "@afenda/shadcn-studio-v2/clients";
import { shadcnStudioCenteredLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

function ThemeCustomizerPanel() {
  return (
    <ThemeProvider storageKey="afenda-storybook-v2-theme-customizer">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Theme customizer</CardTitle>
          <CardDescription>
            Interactive editorial preset picker from @afenda/shadcn-studio-v2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeCustomizer />
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

const meta = {
  title: "Shadcn Studio V2/Theme/ThemeCustomizer",
  component: ThemeCustomizerPanel,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component: "ThemeCustomizer control surface for editorial presets.",
      },
    },
  },
} satisfies Meta<typeof ThemeCustomizerPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ThemeCustomizerPanel />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Theme customizer" })
    ).toBeVisible();
  },
};
