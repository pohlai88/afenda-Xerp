import { setProjectAnnotations } from "@storybook/react";
import type { Preview } from "@storybook/react";
import { TooltipProvider } from "@afenda/ui";

const preview = {
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <div className="min-h-svh bg-background text-foreground">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Preview;

setProjectAnnotations(preview);
