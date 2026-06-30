import "@testing-library/jest-dom/vitest";
import {
  activateMenuOption,
  openMenu,
  setupUser,
  waitForMenuToClose,
} from "@afenda/testing/react";
import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

describe("dropdown-menu interaction", () => {
  it("opens on trigger click and activates an item", async () => {
    const user = setupUser();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Copy</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const menu = await openMenu(user, "Open menu");
    expect(within(menu).getByRole("menuitem", { name: "Copy" })).toBeVisible();

    await activateMenuOption(user, menu, "Copy");
    await waitForMenuToClose();
  });
});
