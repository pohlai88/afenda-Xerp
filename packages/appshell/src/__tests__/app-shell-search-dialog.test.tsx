import { setupUser } from "@afenda/testing/react";
import { render, screen, within } from "@testing-library/react";
import { UserIcon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
  AppShellSearchCommand,
  AppShellSearchDialog,
  type AppShellSearchDialogProps,
} from "../presentation/blocks/app-shell-search-dialog";
import { defaultAppShellSearchSuggestions } from "../presentation/data/app-shell.search.data";

function renderSearchDialog(props: Partial<AppShellSearchDialogProps> = {}) {
  return render(
    <AppShellSearchDialog
      trigger={<button type="button">Open search</button>}
      {...props}
    />
  );
}

describe("AppShellSearchDialog", () => {
  it("renders the trigger without Governed UI consumer violations", () => {
    renderSearchDialog();

    expect(
      screen.getByRole("button", { name: "Open search" })
    ).toBeInTheDocument();
  });

  it("opens the dialog with search region and ERP suggestions", async () => {
    const user = setupUser();
    renderSearchDialog();

    await user.click(screen.getByRole("button", { name: "Open search" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Search results" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Finance module" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Human resources" })
    ).toBeInTheDocument();
  });

  it("filters suggestions when typing in the plain search field", async () => {
    const user = setupUser();
    renderSearchDialog({ defaultOpen: true });

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "finance");

    expect(
      screen.getByRole("button", { name: "Finance module" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Human resources" })
    ).not.toBeInTheDocument();
  });

  it("renders user rows with governed badge data-slot", () => {
    renderSearchDialog({ defaultOpen: true });

    const inOffice = screen.getByText("In office");
    expect(inOffice.closest("[data-slot='badge']")).not.toBeNull();
  });

  it("shows empty state when no results match", async () => {
    const user = setupUser();
    renderSearchDialog({ defaultOpen: true });

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "zzzz-no-match");

    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("notifies listeners when a result is selected", async () => {
    const user = setupUser();
    const onResultSelect = vi.fn();
    renderSearchDialog({ defaultOpen: true, onResultSelect });

    await user.click(screen.getByRole("button", { name: "Finance module" }));

    expect(onResultSelect).toHaveBeenCalledWith("finance");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("announces filtered result count via aria-live", async () => {
    const user = setupUser();
    renderSearchDialog({ defaultOpen: true });

    const liveRegion = screen.getByText(/search results available/i);
    expect(liveRegion).toHaveAttribute("aria-live", "polite");

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "finance");

    expect(screen.getByText(/results for "finance"/)).toBeInTheDocument();
  });

  it("allows custom suggestions override", () => {
    renderSearchDialog({
      defaultOpen: true,
      suggestions: [
        {
          id: "custom",
          label: "Workspace settings",
          Icon: UserIcon,
        },
      ],
      suggestionsLabel: "Modules",
    });

    const region = screen.getByRole("region", { name: "Search results" });
    expect(
      within(region).getByRole("button", { name: "Workspace settings" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Finance module" })
    ).not.toBeInTheDocument();
  });
});

describe("AppShellSearchCommand", () => {
  it("renders keyboard hints with governed Kbd on larger breakpoints", () => {
    render(<AppShellSearchCommand />);

    expect(screen.getByText("To close")).toBeInTheDocument();
    expect(screen.getByText("esc")).toHaveAttribute("data-slot", "kbd");
  });

  it("filters using exported default suggestion data", async () => {
    const user = setupUser();
    render(<AppShellSearchCommand />);

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "inventory");

    expect(
      screen.getByRole("button", { name: "Inventory & procurement" })
    ).toBeInTheDocument();
    expect(
      defaultAppShellSearchSuggestions.some((item) => item.id === "inventory")
    ).toBe(true);
  });
});
