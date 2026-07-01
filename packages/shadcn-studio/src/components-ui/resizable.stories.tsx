/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "./resizable.js";

const meta = {
  component: ResizablePanelGroup,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-32 w-full max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">Panel A</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">Panel B</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
