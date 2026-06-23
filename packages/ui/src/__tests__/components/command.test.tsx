import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../../components/command";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Command governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Command
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-testid="command-root"
        state="ready"
      >
        <CommandList />
      </Command>
    );

    const root = screen.getByTestId("command-root");

    expectGovernedDataAuthority(root, {
      "data-component": "Command",
      "data-recipe": "surface",
      "data-slot": "command",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "Command",
      recipe: "surface",
      slot: "command",
      state: "ready",
    });
  });

  it("keeps governed data attributes authoritative on CommandItem", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem
            data-component="Override"
            data-slot="override"
            value="dashboard"
          >
            Dashboard
          </CommandItem>
        </CommandList>
      </Command>
    );

    expectGovernedDataAuthority(screen.getByText("Dashboard"), {
      "data-component": "Command",
      "data-recipe": "surface",
      "data-slot": "command-item",
      "data-state": "ready",
    });
  });

  it("marks decorative search and check icons as aria-hidden", () => {
    render(
      <Command>
        <CommandInput aria-label="Search commands" placeholder="Search" />
        <CommandList>
          <CommandItem value="dashboard">Dashboard</CommandItem>
        </CommandList>
      </Command>
    );

    const input = screen.getByLabelText("Search commands");
    const wrapper = input.closest("[data-slot='command-input-wrapper']");

    expect(
      wrapper?.querySelector("[data-slot='command-search-icon']")
    ).toHaveAttribute("aria-hidden", "true");

    const item = screen.getByRole("option", { name: "Dashboard" });
    const check = item.querySelector("svg");

    expect(check).toHaveAttribute("aria-hidden", "true");
  });

  it("preserves keyboard-navigable option semantics on CommandItem", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem value="dashboard">Dashboard</CommandItem>
        </CommandList>
      </Command>
    );

    expect(screen.getByRole("option", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("exposes displayName on command parts", () => {
    expect(Command.displayName).toBe("Command");
    expect(CommandInput.displayName).toBe("CommandInput");
    expect(CommandList.displayName).toBe("CommandList");
    expect(CommandEmpty.displayName).toBe("CommandEmpty");
    expect(CommandGroup.displayName).toBe("CommandGroup");
    expect(CommandSeparator.displayName).toBe("CommandSeparator");
    expect(CommandItem.displayName).toBe("CommandItem");
    expect(CommandShortcut.displayName).toBe("CommandShortcut");
  });
});

describe("CommandDialog governance", () => {
  it("renders without passing semantic classes into governed primitive className props", () => {
    render(
      <CommandDialog defaultOpen title="ERP command palette">
        <CommandInput aria-label="Search commands" />
        <CommandList>
          <CommandEmpty>No matches</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>New invoice</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );

    expect(
      screen.getByRole("dialog", { name: "ERP command palette" })
    ).toBeInTheDocument();
    expect(screen.getByText("New invoice")).toBeInTheDocument();
    expect(screen.getByLabelText("Search commands")).toBeInTheDocument();
  });
});
