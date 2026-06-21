export {
  cleanup,
  render,
  screen,
  waitFor,
  within,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";

export { default as userEvent } from "@testing-library/user-event";
export type { UserEvent } from "@testing-library/user-event";

export {
  INTERACTION_TEST_TIMEOUT_MS,
  renderWithUser,
  setupInteractionTest,
  setupUser,
  type InteractionTestContext,
  type RenderWithUserOptions,
  type RenderWithUserResult,
} from "./interaction.js";

export {
  activateMenuOption,
  closeDialogWithEscape,
  openDialog,
  openListbox,
  openMenu,
  selectListboxOption,
  waitForDialogToClose,
  waitForMenuToClose,
} from "./interaction-helpers.js";
