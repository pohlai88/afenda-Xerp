import { Badge, Button, Input } from "@afenda/shadcn-studio-v2";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
} from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

const meta = {
  title: "Shadcn Studio V2/Primitives/Form Controls",
  component: Button,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "High-value form primitives exported from @afenda/shadcn-studio-v2 — Button, Input, Badge.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonVariants: Story = {
  tags: ["lab-smoke"],
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button">Default</Button>
      <Button type="button" variant="secondary">
        Secondary
      </Button>
      <Button type="button" variant="outline">
        Outline
      </Button>
      <Button type="button" variant="ghost">
        Ghost
      </Button>
      <Button type="button" variant="destructive">
        Destructive
      </Button>
      <Button type="button" variant="link">
        Link
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Default" })).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Destructive" })
    ).toBeVisible();
  },
};

export const ButtonDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button">Default</Button>
      <Button type="button" variant="outline">
        Outline
      </Button>
    </div>
  ),
};

export const InputDefault: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <label className="font-medium text-sm" htmlFor="v2-input-default">
        Operator email
      </label>
      <Input
        defaultValue="operator@afenda.test"
        id="v2-input-default"
        placeholder="name@company.com"
        type="email"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Operator email")).toHaveValue(
      "operator@afenda.test"
    );
  },
};

export const BadgeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Default")).toBeVisible();
    await expect(canvas.getByText("Destructive")).toBeVisible();
  },
};
