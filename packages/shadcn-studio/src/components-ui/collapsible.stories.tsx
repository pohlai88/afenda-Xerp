/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible.js";

const meta = {
  component: Collapsible,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-full max-w-sm" defaultOpen>
      <CollapsibleTrigger className="font-medium text-sm">
        Shipping details
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-muted-foreground text-sm">
        Deliver to warehouse WH-12 by Friday.
      </CollapsibleContent>
    </Collapsible>
  ),
};
