import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShellLanguageDropdown } from "../presentation/blocks/app-shell-language-dropdown";
import { defaultAppShellLanguages } from "../presentation/data/app-shell.language.data";

describe("AppShellLanguageDropdown", () => {
  it("renders the trigger without TIP-004 consumer violations", () => {
    render(
      <AppShellLanguageDropdown
        trigger={<button type="button">Open language menu</button>}
      />
    );

    expect(
      screen.getByRole("button", { name: "Open language menu" })
    ).toBeInTheDocument();
  });

  it("renders ERP language options when open", () => {
    render(
      <AppShellLanguageDropdown
        defaultOpen
        trigger={<button type="button">Open language menu</button>}
      />
    );

    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "English" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "German (Deutsch)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "Spanish (Español)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "Korean (한국어)" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(
      defaultAppShellLanguages.length
    );
  });

  it("notifies listeners when a language is selected", async () => {
    const user = setupUser();
    const onLanguageChange = vi.fn();

    render(
      <AppShellLanguageDropdown
        defaultOpen
        onLanguageChange={onLanguageChange}
        trigger={<button type="button">Open language menu</button>}
      />
    );

    await user.click(
      screen.getByRole("menuitemradio", { name: "German (Deutsch)" })
    );

    expect(onLanguageChange).toHaveBeenCalledWith("de");
  });

  it("reflects the default language selection when open", () => {
    render(
      <AppShellLanguageDropdown
        defaultLanguage="de"
        defaultOpen
        trigger={<button type="button">Open language menu</button>}
      />
    );

    expect(
      screen.getByRole("menuitemradio", { name: "German (Deutsch)" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("accepts a custom language list", () => {
    render(
      <AppShellLanguageDropdown
        defaultLanguage="fr"
        defaultOpen
        languages={[{ id: "fr", label: "French", nativeLabel: "Français" }]}
        menuLabel="Locale"
        trigger={<button type="button">Open language menu</button>}
      />
    );

    expect(screen.getByText("Locale")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "French (Français)" })
    ).toHaveAttribute("aria-checked", "true");
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });
});
