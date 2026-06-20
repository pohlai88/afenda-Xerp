import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DENSITIES,
  GOVERNED_STATES,
  SIZES,
  STATUS_TONES,
  VARIANT_EMPHASES,
} from "@afenda/ui/governance";

import { Badge } from "./badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: [...STATUS_TONES],
    },
    emphasis: {
      control: "select",
      options: [...VARIANT_EMPHASES],
    },
    size: {
      control: "select",
      options: [...SIZES],
    },
    density: {
      control: "select",
      options: [...DENSITIES],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
    tone: "neutral",
    emphasis: "solid",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
  },
};

export const Outline: Story = {
  args: {
    emphasis: "outline",
  },
};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUS_TONES.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};
