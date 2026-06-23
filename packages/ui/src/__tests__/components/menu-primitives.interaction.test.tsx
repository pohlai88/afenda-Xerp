import {
  activateMenuOption,
  INTERACTION_TEST_TIMEOUT_MS,
  openListbox,
  openMenu,
  selectListboxOption,
  setupUser,
  waitForMenuToClose,
} from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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

  it("opens popover on trigger click and closes on Escape", async () => {
    const user = setupUser();

    render(
      <Popover>
        <PopoverTrigger>Filter rows</PopoverTrigger>
        <PopoverContent>
          <p>Filter panel</p>
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole("button", { name: "Filter rows" }));
    expect(await screen.findByText("Filter panel")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Filter panel")).not.toBeInTheDocument();
    });
  });

  it("supports controlled Popover open passthrough", async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();

    function ControlledPopover() {
      const [open, setOpen] = useState(false);

      return (
        <Popover
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
          open={open}
        >
          <PopoverTrigger>Controlled popover</PopoverTrigger>
          <PopoverContent>
            <p>Controlled panel</p>
          </PopoverContent>
        </Popover>
      );
    }

    render(<ControlledPopover />);

    await user.click(
      screen.getByRole("button", { name: "Controlled popover" })
    );
    expect(await screen.findByText("Controlled panel")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Controlled panel")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("opens tooltip on trigger focus and closes on Escape", async () => {
    const user = setupUser();

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Help</TooltipTrigger>
          <TooltipContent>Tooltip help text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Tooltip help text"
    );

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("renders HoverCard content when controlled open", async () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Vendor preview</HoverCardTrigger>
        <HoverCardContent>
          <p>Acme Supplies Ltd.</p>
        </HoverCardContent>
      </HoverCard>
    );

    expect(await screen.findByText("Acme Supplies Ltd.")).toBeInTheDocument();
  });

  it("opens context menu on right click and closes after item selection", async () => {
    const user = setupUser();

    render(
      <ContextMenu>
        <ContextMenuTrigger>Row actions</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Edit</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByText("Row actions");
    await user.pointer({ keys: "[MouseRight>]", target: trigger });

    const menu = await screen.findByRole("menu");
    await activateMenuOption(user, menu, "Edit");
    await waitForMenuToClose();
  });
});
