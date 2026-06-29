import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda/Lab",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "shadcn-studio presentation lab (ADR-0027). Block and primitive stories live under **Shadcn Studio/**.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: () => (
    <div className="max-w-md space-y-2 text-center">
      <h1 className="font-semibold text-foreground text-xl">
        Afenda Storybook
      </h1>
      <p className="text-muted-foreground text-sm">
        Browse promoted MCP blocks under{" "}
        <strong className="text-foreground">Shadcn Studio</strong>. Legacy
        appshell, metadata-ui, and governed-ui stories were removed.
      </p>
    </div>
  ),
};
