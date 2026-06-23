export {
  cleanup,
  type RenderOptions,
  type RenderResult,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
export type { UserEvent } from "@testing-library/user-event";
export { default as userEvent } from "@testing-library/user-event";

export {
  INTERACTION_TEST_TIMEOUT_MS,
  type InteractionTestContext,
  type RenderWithUserOptions,
  type RenderWithUserResult,
  renderWithUser,
  setupInteractionTest,
  setupUser,
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
