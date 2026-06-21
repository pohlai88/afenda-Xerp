import { screen, waitFor, within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";

type MenuItemRole = "menuitem" | "menuitemradio";
type AccessibleName = string | RegExp;

/** Opens a dropdown menu via its trigger button and returns the menu element. */
export async function openMenu(
  user: UserEvent,
  triggerName: AccessibleName
): Promise<HTMLElement> {
  await user.click(screen.getByRole("button", { name: triggerName }));
  return await screen.findByRole("menu");
}

/** Activates a menu option inside an open menu surface. */
export async function activateMenuOption(
  user: UserEvent,
  menu: HTMLElement,
  optionName: AccessibleName,
  itemRole: MenuItemRole = "menuitem"
): Promise<void> {
  await user.click(within(menu).getByRole(itemRole, { name: optionName }));
}

/** Opens a dialog via its trigger button and returns the dialog element. */
export async function openDialog(
  user: UserEvent,
  triggerName: AccessibleName
): Promise<HTMLElement> {
  await user.click(screen.getByRole("button", { name: triggerName }));
  return await screen.findByRole("dialog");
}

/** Waits until no dialog is present in the document. */
export async function waitForDialogToClose(): Promise<void> {
  await waitFor(() => {
    if (screen.queryByRole("dialog") !== null) {
      throw new Error("Expected dialog to close.");
    }
  });
}

/** Closes the open dialog with Escape and waits for it to unmount. */
export async function closeDialogWithEscape(user: UserEvent): Promise<void> {
  await user.keyboard("{Escape}");
  await waitForDialogToClose();
}

/** Opens a combobox/listbox via its trigger and returns the listbox element. */
export async function openListbox(
  user: UserEvent,
  comboboxLabel: AccessibleName
): Promise<HTMLElement> {
  await user.click(screen.getByRole("combobox", { name: comboboxLabel }));
  return await screen.findByRole("listbox");
}

/** Selects an option inside an open listbox. */
export async function selectListboxOption(
  user: UserEvent,
  listbox: HTMLElement,
  optionName: AccessibleName
): Promise<void> {
  await user.click(within(listbox).getByRole("option", { name: optionName }));
}

/** Waits until no menu is present in the document. */
export async function waitForMenuToClose(): Promise<void> {
  await waitFor(() => {
    if (screen.queryByRole("menu") !== null) {
      throw new Error("Expected menu to close.");
    }
  });
}
