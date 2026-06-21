import { render, screen, within } from "@testing-library/react";
import { UserIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import {
  AppShellProfileDropdown,
  type AppShellProfileDropdownProps,
} from "../shadcn-studio/blocks/app-shell-profile-dropdown";
import {
  DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME,
  DEFAULT_APP_SHELL_PROFILE_EMAIL,
  defaultAppShellProfileLogoutAction,
} from "../shadcn-studio/data/app-shell.profile.data";

function renderProfileDropdown(
  props: Partial<AppShellProfileDropdownProps> = {}
) {
  return render(
    <AppShellProfileDropdown
      trigger={<button type="button">Open profile menu</button>}
      {...props}
    />
  );
}

describe("AppShellProfileDropdown", () => {
  it("renders the trigger without TIP-004 consumer violations", () => {
    renderProfileDropdown();

    expect(
      screen.getByRole("button", { name: "Open profile menu" })
    ).toBeInTheDocument();
  });

  it("shows profile header with default ERP identity when opened", () => {
    renderProfileDropdown({ defaultOpen: true });

    expect(screen.getByText(DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME)).toHaveAttribute(
      "id",
      "app-shell-profile-menu-label"
    );
    expect(screen.getByText(DEFAULT_APP_SHELL_PROFILE_EMAIL)).toBeInTheDocument();
    expect(screen.getByText("Online")).toHaveClass("sr-only");
  });

  it("anchors the panel inside dropdown content for icon-trigger width override", () => {
    renderProfileDropdown({ defaultOpen: true });

    const wrapper = document.querySelector(".app-shell-profile-dropdown");
    expect(wrapper?.closest("[data-slot='dropdown-menu-content']")).not.toBeNull();
    expect(screen.getByText(DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME)).toBeVisible();
    expect(screen.getByText(DEFAULT_APP_SHELL_PROFILE_EMAIL)).toBeVisible();
  });

  it("renders governed avatar with data-slot in the profile header", () => {
    renderProfileDropdown({ defaultOpen: true });

    const avatars = screen.getAllByText("AM");
    expect(avatars.length).toBeGreaterThan(0);
    expect(screen.getAllByText("AM")[0]?.closest("[data-slot='avatar']")).not.toBeNull();
  });

  it("lists default account and admin menu actions", () => {
    renderProfileDropdown({ defaultOpen: true });

    expect(screen.getByRole("menuitem", { name: "My profile" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Preferences" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Company plan" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "ERP users" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Appearance" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Add user" })).toBeInTheDocument();
  });

  it("marks the sign-out action as destructive", () => {
    renderProfileDropdown({ defaultOpen: true });

    const signOut = screen.getByRole("menuitem", { name: defaultAppShellProfileLogoutAction.label });
    expect(signOut).toHaveAttribute("data-variant", "destructive");
  });

  it("accepts custom identity and menu groups", () => {
    renderProfileDropdown({
      defaultOpen: true,
      displayName: "Jane Ops",
      email: "jane.ops@afenda.com",
      avatarFallback: "JO",
      menuGroups: [
        {
          id: "custom",
          items: [
            {
              id: "custom-profile",
              label: "Workspace settings",
              Icon: UserIcon,
            },
          ],
        },
      ],
      logoutItem: {
        id: "custom-logout",
        label: "End session",
        Icon: UserIcon,
        variant: "destructive",
      },
      showOnlineIndicator: false,
    });

    expect(screen.getByText("Jane Ops")).toBeInTheDocument();
    expect(screen.getByText("jane.ops@afenda.com")).toBeInTheDocument();
    expect(screen.queryByText("Online")).not.toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Workspace settings" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "My profile" })).not.toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "End session" })).toHaveAttribute(
      "data-variant",
      "destructive"
    );
  });

  it("scopes menu groups with aria-label", () => {
    renderProfileDropdown({ defaultOpen: true });

    const accountGroup = screen.getByRole("group", { name: "account" });
    expect(
      within(accountGroup).getByRole("menuitem", { name: "My profile" })
    ).toBeInTheDocument();
  });
});
