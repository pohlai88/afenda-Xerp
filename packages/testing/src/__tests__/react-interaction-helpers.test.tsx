import {
  activateMenuOption,
  openDialog,
  openMenu,
  setupUser,
} from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("@afenda/testing/react interaction helpers", () => {
  it("opens a dialog through the openDialog helper", async () => {
    const user = setupUser();

    render(
      <div>
        <button type="button">Open helper dialog</button>
        <div aria-label="Helper dialog" hidden role="dialog">
          Dialog body
        </div>
      </div>
    );

    const trigger = screen.getByRole("button", { name: "Open helper dialog" });
    const dialog = screen.getByRole("dialog", { hidden: true });

    trigger.addEventListener("click", () => {
      dialog.hidden = false;
    });

    const openedDialog = await openDialog(user, "Open helper dialog");
    expect(openedDialog).toHaveTextContent("Dialog body");
  });

  it("opens a menu and activates an item through helper utilities", async () => {
    const user = setupUser();

    render(
      <div>
        <button aria-haspopup="menu" type="button">
          Open helper menu
        </button>
        <div hidden role="menu">
          <button role="menuitem" type="button">
            First action
          </button>
        </div>
      </div>
    );

    const trigger = screen.getByRole("button", { name: "Open helper menu" });
    const menu = screen.getByRole("menu", { hidden: true });

    trigger.addEventListener("click", () => {
      menu.hidden = false;
    });

    const openedMenu = await openMenu(user, "Open helper menu");
    await activateMenuOption(user, openedMenu, "First action");
    expect(menu.hidden).toBe(false);
  });
});
