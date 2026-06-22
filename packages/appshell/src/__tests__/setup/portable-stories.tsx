import type { ComponentType } from "react";
import { composeStories } from "@storybook/react";

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

/** Storybook CSF modules vary under `exactOptionalPropertyTypes`; use for portable Vitest smoke tests. */
export function composePortableStories(
  module: Record<string, unknown>
): { Default: ComponentType; [storyName: string]: ComponentType } {
  return composeStories(module as never) as unknown as {
    Default: ComponentType;
    [storyName: string]: ComponentType;
  };
}

export function composePortableStory(
  module: Record<string, unknown>,
  storyName: string
): ComponentType {
  const story = composePortableStories(module)[storyName];
  if (story === undefined) {
    throw new Error(`Missing portable story "${storyName}"`);
  }
  return story;
}
