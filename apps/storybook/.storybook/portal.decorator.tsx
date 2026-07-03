import type { Decorator } from "@storybook/react";

/** SB 10.4 global decorator — portal mount for Dialog, Menu, Tooltip overlays. */
/** @see https://storybook.js.org/docs/writing-stories/decorators */
export const STORYBOOK_PORTAL_ROOT_ID = "storybook-portal-root";

export const storybookPortalDecorator: Decorator = (Story) => (
  <>
    <Story />
    <div id={STORYBOOK_PORTAL_ROOT_ID} />
  </>
);
