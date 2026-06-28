import {
  INTERACTION_TEST_TIMEOUT_MS,
  openDialog,
  openMenu,
  setupUser,
} from "@afenda/testing/react";
import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShellActivityDialog } from "../presentation/blocks/app-shell-activity-dialog";
import { AppShellContextSwitcher } from "../presentation/blocks/app-shell-context-switcher";
import { AppShellLanguageDropdown } from "../presentation/blocks/app-shell-language-dropdown";
import { AppShellNotificationDropdown } from "../presentation/blocks/app-shell-notification-dropdown";
import { AppShellProfileDropdown } from "../presentation/blocks/app-shell-profile-dropdown";
import { DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME } from "../presentation/data/app-shell.profile.data";

describe("AppShell block interactions", () => {
  vi.setConfig({ testTimeout: INTERACTION_TEST_TIMEOUT_MS });

  it("opens the profile dropdown from its trigger", async () => {
    const user = setupUser();

    render(
      <AppShellProfileDropdown
        trigger={<button type="button">Open profile menu</button>}
      />
    );

    const menu = await openMenu(user, "Open profile menu");

    expect(
      within(menu).getByText(DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME)
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: "My profile" })
    ).toBeInTheDocument();
  });

  it("opens the notification dropdown from its trigger", async () => {
    const user = setupUser();

    render(
      <AppShellNotificationDropdown
        trigger={<button type="button">Open notifications</button>}
      />
    );

    const menu = await openMenu(user, "Open notifications");

    expect(within(menu).getByText("Notifications")).toBeInTheDocument();
    expect(
      within(menu).getByRole("list", { name: "Inbox notifications" })
    ).toBeInTheDocument();
  });

  it("opens the language menu from its trigger", async () => {
    const user = setupUser();

    render(
      <AppShellLanguageDropdown
        trigger={<button type="button">Open language menu</button>}
      />
    );

    const menu = await openMenu(user, "Open language menu");

    expect(within(menu).getByText("Language")).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitemradio", { name: "English" })
    ).toBeInTheDocument();
  });

  it("opens the activity sheet from its trigger", async () => {
    const user = setupUser();

    render(
      <AppShellActivityDialog
        trigger={<button type="button">Open activity</button>}
      />
    );

    const dialog = await openDialog(user, "Open activity");

    expect(
      within(dialog).getByRole("feed", { name: "Team activity feed" })
    ).toBeInTheDocument();
  });

  it("opens the context switcher menu from its trigger", async () => {
    const user = setupUser();

    render(
      <AppShellContextSwitcher
        allowedOptions={{
          targets: [
            {
              companySlug: "alpha-co",
              label: "Alpha Co",
              isSelected: true,
            },
            {
              companySlug: "beta-co",
              label: "Beta Co",
              isSelected: false,
            },
          ],
        }}
        onSelect={vi.fn()}
      />
    );

    const menu = await openMenu(user, "Switch workspace context");

    expect(within(menu).getByText("Switch workspace")).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitemradio", { name: "Beta Co" })
    ).toBeInTheDocument();
  });
});
