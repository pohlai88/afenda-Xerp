import {
  type RenderOptions,
  type RenderResult,
  render,
} from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type { ReactElement } from "react";

export const INTERACTION_TEST_TIMEOUT_MS = 15_000 as const;

type UserEventSetupOptions = NonNullable<Parameters<typeof userEvent.setup>[0]>;

export interface InteractionTestContext {
  readonly user: UserEvent;
}

/** Configures user-event for jsdom + Radix (pointer checks enabled). */
export function setupUser(options?: UserEventSetupOptions): UserEvent {
  return userEvent.setup({
    pointerEventsCheck: 0,
    ...options,
  });
}

export function setupInteractionTest(
  options?: UserEventSetupOptions
): InteractionTestContext {
  return { user: setupUser(options) };
}

export interface RenderWithUserOptions extends Omit<RenderOptions, "wrapper"> {
  readonly userOptions?: UserEventSetupOptions;
}

export interface RenderWithUserResult extends RenderResult {
  readonly user: UserEvent;
}

/** Renders UI and returns a configured user-event instance for the same session. */
export function renderWithUser(
  ui: ReactElement,
  options: RenderWithUserOptions = {}
): RenderWithUserResult {
  const user = setupUser(options.userOptions);
  const renderResult = render(ui, options);

  return {
    ...renderResult,
    user,
  };
}
