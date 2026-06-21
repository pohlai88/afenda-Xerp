import { render, screen, waitFor, within } from "@testing-library/react";
import {
  activateMenuOption,
  INTERACTION_TEST_TIMEOUT_MS,
  openListbox,
  openMenu,
  selectListboxOption,
  setupUser,
  waitForMenuToClose,
} from "@afenda/testing/react";
import { describe, expect, it, vi } from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../index";

describe("menu primitive interactions", () => {
  vi.setConfig({ testTimeout: INTERACTION_TEST_TIMEOUT_MS });

  it("opens dropdown on trigger click and closes after item selection", async () => {
    const user = setupUser();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const menu = await openMenu(user, "Actions");
    await activateMenuOption(user, menu, "Edit");
    await waitForMenuToClose();
  });

  it("opens select on trigger click and updates the value", async () => {
    const user = setupUser();

    render(
      <Select>
        <SelectTrigger aria-label="Color">
          <SelectValue placeholder="Pick color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
        </SelectContent>
      </Select>
    );

    const listbox = await openListbox(user, "Color");
    await selectListboxOption(user, listbox, "Blue");

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: "Color" })).toHaveTextContent(
        "Blue"
      );
    });
  });
});
