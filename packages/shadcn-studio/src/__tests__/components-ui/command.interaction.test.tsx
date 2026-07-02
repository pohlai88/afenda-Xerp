import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components-ui/command";

describe("command interaction", () => {
  it("filters items when typing in the search input", async () => {
    const user = setupUser();
    const onSelect = vi.fn();

    render(
      <Command>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={onSelect}>Calendar</CommandItem>
            <CommandItem onSelect={onSelect}>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    const search = screen.getByPlaceholderText("Search commands...");
    await user.type(search, "Cal");

    await waitFor(() => {
      expect(screen.getByText("Calendar")).toBeVisible();
    });

    await user.click(screen.getByText("Calendar"));
    expect(onSelect).toHaveBeenCalled();
  });
});
