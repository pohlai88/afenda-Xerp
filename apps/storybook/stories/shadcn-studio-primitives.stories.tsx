import type { Meta, StoryObj } from "@storybook/react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioPrimitivesDocs,
  shadcnStudioStoryA11y,
} from "@afenda/shadcn-studio";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-decorators";

const meta = {
  title: "Shadcn Studio/Primitives",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component: shadcnStudioPrimitivesDocs.component,
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonVariants: Story = {
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
};

export const ButtonSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" type="button">
        Small
      </Button>
      <Button size="default" type="button">
        Default
      </Button>
      <Button size="lg" type="button">
        Large
      </Button>
    </div>
  ),
};

export const CardDefault: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Studio card</CardTitle>
        <CardDescription>
          Stock shadcn card primitive from @afenda/shadcn-studio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Card content uses shadcn CSS variables.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" type="button">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const CardDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Dark surface</CardTitle>
        <CardDescription>Card on dark color mode.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button">Primary</Button>
      </CardContent>
    </Card>
  ),
};
