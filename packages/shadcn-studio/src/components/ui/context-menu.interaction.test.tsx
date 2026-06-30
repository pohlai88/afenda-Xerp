import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";

describe("context-menu interaction", () => {
  it("opens on right-click and shows menu items", async () => {
    const user = setupUser();

    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Cut</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.pointer({
      keys: "[MouseRight>]",
      target: screen.getByText("Right click area"),
    });

    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "Cut" })).toBeVisible();
  });
});
