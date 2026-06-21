import type { Decorator } from "@storybook/react";
import type { ReactNode } from "react";

export function MetadataRawStoryCanvas({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div
      className="metadata-container metadata-layout metadata-layout-contained metadata-layout-padded"
      style={{ minHeight: "100svh", width: "100%" }}
    >
      {children}
    </div>
  );
}

export function MetadataFixtureStoryCanvas({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div
      className="metadata-container min-h-svh"
      data-story-canvas="metadata-fixture"
    >
      {children}
    </div>
  );
}

export const withRawStoryCanvas: Decorator = (Story) => (
  <MetadataRawStoryCanvas>
    <Story />
  </MetadataRawStoryCanvas>
);

export const withFixtureStoryCanvas: Decorator = (Story) => (
  <MetadataFixtureStoryCanvas>
    <Story />
  </MetadataFixtureStoryCanvas>
);
