import type { Meta, StoryObj } from "@storybook/react";

import { DotGrid } from "../components-ui/bg-dot-grid.js";

import { MorphingText } from "./morphing-text.js";

const meta = {
  component: MorphingText,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MorphingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    texts: ["404", "Error Page", "Page Drifted"],
  },
  render: (args) => (
    <div className="flex min-h-[24rem] items-center justify-center bg-background p-8">
      <MorphingText {...args} />
    </div>
  ),
};

export const ErrorPageComposition: Story = {
  args: {
    className: "text-7xl font-bold text-white xl:text-9xl",
    texts: ["404", "Error Page", "Page Drifted"],
  },
  render: (args) => (
    <div className="relative h-[32rem] w-full overflow-hidden rounded-2xl bg-black">
      <DotGrid
        activeColor="#10B981"
        baseColor="var(--muted-foreground)"
        displacement={14}
        dotSize={1.9}
        gap={22}
        maxScale={4}
        radius={160}
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <MorphingText {...args} />
      </div>
    </div>
  ),
};
