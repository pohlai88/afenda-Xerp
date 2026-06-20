import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DENSITIES,
  GOVERNED_PANEL_RADII,
  GOVERNED_PANEL_SHADOWS,
  GOVERNED_STATES,
} from "@afenda/ui/governance";
import { GOVERNED_CARD_LAYOUT_SIZES } from "../governance/component-props";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { StoryFrame } from "./_storybook/story-frame";

const meta = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: [...DENSITIES],
    },
    radius: {
      control: "select",
      options: [...GOVERNED_PANEL_RADII],
    },
    shadow: {
      control: "select",
      options: [...GOVERNED_PANEL_SHADOWS],
    },
    size: {
      control: "select",
      options: [...GOVERNED_CARD_LAYOUT_SIZES],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
  },
  args: {
    density: "standard",
    radius: "md",
    shadow: "raised",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
          <CardAction>
            <Button size="sm" emphasis="outline">
              Action
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>Card content goes here.</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>
    </StoryFrame>
  ),
};

export const Compact: Story = {
  args: {
    density: "compact",
    size: "sm",
  },
  render: (args) => (
    <StoryFrame width="sm">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Compact card</CardTitle>
          <CardDescription>Reduced density and layout size.</CardDescription>
        </CardHeader>
        <CardContent>Compact content area.</CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const OverlayShadow: Story = {
  args: {
    shadow: "overlay",
    radius: "lg",
  },
  render: (args) => (
    <StoryFrame width="md">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Overlay shadow</CardTitle>
          <CardDescription>Elevated surface presentation.</CardDescription>
        </CardHeader>
        <CardContent>Overlay shadow variant.</CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const AllShadows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {GOVERNED_PANEL_SHADOWS.map((shadow) => (
        <StoryFrame key={shadow} width="sm">
          <Card shadow={shadow}>
            <CardHeader>
              <CardTitle>{shadow}</CardTitle>
            </CardHeader>
            <CardContent>Shadow variant</CardContent>
          </Card>
        </StoryFrame>
      ))}
    </div>
  ),
};
