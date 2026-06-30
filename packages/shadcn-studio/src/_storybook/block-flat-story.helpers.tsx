import type { StoryObj } from "@storybook/react";

import type { FlatBlockStoryEntry } from "./block-flat-story.registry.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFullscreenLayout,
  shadcnStudioPaddedLayout,
} from "./story-parameters.js";

type FlatStory = StoryObj;

function layoutParameters(layout: FlatBlockStoryEntry["layout"]) {
  if (layout === "fullscreen") {
    return shadcnStudioFullscreenLayout;
  }

  if (layout === "padded") {
    return shadcnStudioPaddedLayout;
  }

  return shadcnStudioCenteredLayout;
}

export function createFlatBlockStory(entry: FlatBlockStoryEntry): FlatStory {
  const Sample = entry.sample;

  return {
    render: () => <Sample />,
    parameters: layoutParameters(entry.layout),
  };
}

export function createFlatBlockStoryDark(
  entry: FlatBlockStoryEntry
): FlatStory {
  return {
    ...createFlatBlockStory(entry),
    globals: shadcnStudioDarkThemeGlobals,
  };
}

export function createFlatBlockStoryPairs(entry: FlatBlockStoryEntry): {
  light: FlatStory;
  dark: FlatStory;
} {
  return {
    light: createFlatBlockStory(entry),
    dark: createFlatBlockStoryDark(entry),
  };
}
