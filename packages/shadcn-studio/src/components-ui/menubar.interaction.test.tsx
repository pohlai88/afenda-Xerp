import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./menubar";

describe("menubar interaction", () => {
  it("opens a menu from the menubar trigger", async () => {
    const user = setupUser();

    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New file</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    await user.click(screen.getByRole("menuitem", { name: "File" }));
    const menu = await screen.findByRole("menu");
    expect(
      within(menu).getByRole("menuitem", { name: "New file" })
    ).toBeVisible();
  });
});
