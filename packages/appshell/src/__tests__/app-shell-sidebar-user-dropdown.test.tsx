import { render, screen, within } from "@testing-library/react";
import { UserIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { SidebarProvider } from "@afenda/ui";

import {
  DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME,
  DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL,
  defaultAppShellSidebarUserLogoutAction,
} from "../shadcn-studio/data/app-shell.sidebar-user.data";
import {
  AppShellSidebarUserDropdown,
  type AppShellSidebarUserDropdownProps,
} from "../shadcn-studio/blocks/app-shell-sidebar-user-dropdown";

function renderSidebarUserDropdown(
  props: Partial<AppShellSidebarUserDropdownProps> = {}
) {
  return render(
    <SidebarProvider>
      <AppShellSidebarUserDropdown {...props} />
    </SidebarProvider>
  );
}

describe("AppShellSidebarUserDropdown", () => {
  it("renders without TIP-004 consumer violations", () => {
    renderSidebarUserDropdown();

    expect(screen.getByText(DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL)).toBeInTheDocument();
  });

  it("exposes an accessible trigger label for the sidebar account menu", () => {
    renderSidebarUserDropdown();

    expect(
      screen.getByRole("button", {
        name: `Account menu: ${DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME}, ${DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL}`,
      })
    ).toBeInTheDocument();
  });

  it("renders governed avatar with data-slot on the trigger", () => {
    renderSidebarUserDropdown();

    const trigger = screen.getByRole("button", {
      name: `Account menu: ${DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME}, ${DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL}`,
    });
    expect(trigger.querySelector("[data-slot='avatar']")).not.toBeNull();
  });

  it("lists default ERP account menu actions when open", () => {
    renderSidebarUserDropdown({ defaultOpen: true });

    expect(screen.getByRole("menuitem", { name: "My account" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Workspace settings" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Billing & plans" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Manage team" })).toBeInTheDocument();
  });

  it("marks the sign-out action as destructive", () => {
    renderSidebarUserDropdown({ defaultOpen: true });

    const signOut = screen.getByRole("menuitem", {
      name: defaultAppShellSidebarUserLogoutAction.label,
    });
    expect(signOut).toHaveAttribute("data-variant", "destructive");
  });

  it("associates open menu content with the header label", () => {
    renderSidebarUserDropdown({ defaultOpen: true });

    expect(screen.getByRole("menu")).toHaveAttribute(
      "aria-labelledby",
      "app-shell-sidebar-user-menu-label"
    );
    expect(document.getElementById("app-shell-sidebar-user-menu-label")).toHaveTextContent(
      DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME
    );
  });

  it("accepts custom identity and menu items", () => {
    renderSidebarUserDropdown({
      defaultOpen: true,
      displayName: "Jane Ops",
      roleLabel: "Finance lead",
      avatarFallback: "JO",
      menuItems: [
        {
          id: "custom-settings",
          label: "Org settings",
          Icon: UserIcon,
        },
      ],
      logoutItem: {
        id: "custom-logout",
        label: "End session",
        Icon: UserIcon,
        variant: "destructive",
      },
    });

    expect(document.getElementById("app-shell-sidebar-user-menu-label")).toHaveTextContent(
      "Jane Ops"
    );
    expect(screen.getByRole("menuitem", { name: "Org settings" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "My account" })).not.toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "End session" })).toHaveAttribute(
      "data-variant",
      "destructive"
    );
  });

  it("scopes account actions inside a labeled menu group", () => {
    renderSidebarUserDropdown({ defaultOpen: true });

    const accountGroup = screen.getByRole("group", { name: "Account menu" });
    expect(
      within(accountGroup).getByRole("menuitem", { name: "My account" })
    ).toBeInTheDocument();
  });
});
