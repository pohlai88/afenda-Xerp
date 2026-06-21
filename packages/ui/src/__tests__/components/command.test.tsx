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
} from "../../components/command";

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
