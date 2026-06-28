import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShellNotificationDropdown } from "../presentation/blocks/app-shell-notification-dropdown";
import {
  countDefaultAppShellUnreadNotifications,
  defaultAppShellInboxNotifications,
} from "../presentation/data/app-shell.notification.data";

describe("AppShellNotificationDropdown", () => {
  it("renders the trigger without Governed UI consumer violations", () => {
    render(
      <AppShellNotificationDropdown
        trigger={<button type="button">Open notifications</button>}
      />
    );

    expect(
      screen.getByRole("button", { name: "Open notifications" })
    ).toBeInTheDocument();
  });

  it("renders ERP inbox notifications when open", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        trigger={<button type="button">Open notifications</button>}
      />
    );

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(
      screen.getByText("AP invoice batch requires your approval")
    ).toBeInTheDocument();
    expect(screen.getByText("q2-close-workbook.xlsx")).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Inbox notifications" })
    ).toBeInTheDocument();
  });

  it("renders the unread badge with governed data-slot semantics", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        trigger={<button type="button">Open notifications</button>}
      />
    );

    const unreadBadge = screen.getByText(
      `${countDefaultAppShellUnreadNotifications()} new`
    );
    expect(unreadBadge).toHaveAttribute("data-slot", "badge");
  });

  it("renders approval actions with governed buttons", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        trigger={<button type="button">Open notifications</button>}
      />
    );

    const inboxList = screen.getByRole("list", { name: "Inbox notifications" });
    const acceptButton = within(inboxList).getAllByRole("button", {
      name: "Accept",
    })[0];
    const declineButton = within(inboxList).getAllByRole("button", {
      name: "Decline",
    })[0];

    expect(acceptButton).toHaveAttribute("data-slot", "button");
    expect(declineButton).toHaveAttribute("data-slot", "button");
  });

  it("exposes notification settings with an accessible link label", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        trigger={<button type="button">Open notifications</button>}
      />
    );

    expect(
      screen.getByRole("link", { name: "Notification settings" })
    ).toHaveAttribute("href", "#");
  });

  it("anchors the panel inside dropdown content for icon-trigger width override", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        trigger={<button type="button">Open notifications</button>}
      />
    );

    const content = document
      .querySelector(".app-shell-notification-dropdown")
      ?.closest("[data-slot='dropdown-menu-content']");
    expect(content).not.toBeNull();
    expect(screen.getByRole("tab", { name: "General" })).toBeInTheDocument();
  });

  it("accepts custom notification data", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        generalItems={[]}
        inboxItems={[
          {
            id: "custom-notification",
            kind: "simple",
            actor: {
              name: "Test Operator",
              avatarSrc:
                "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
              fallback: "TO",
            },
            title: "Custom ERP alert",
            relativeTime: "Just now",
            occurredAt: "2026-06-21T10:00:00Z",
            category: "Inventory",
          },
        ]}
        menuLabel="Alerts"
        trigger={<button type="button">Open notifications</button>}
        unreadCount={1}
      />
    );

    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Custom ERP alert")).toBeInTheDocument();
    expect(screen.getByText("1 new")).toBeInTheDocument();
    expect(
      screen.queryByText("AP invoice batch requires your approval")
    ).not.toBeInTheDocument();
  });

  it("renders ISO timestamps inside time elements", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        trigger={<button type="button">Open notifications</button>}
      />
    );

    const inboxItem = defaultAppShellInboxNotifications[0];
    if (inboxItem === undefined) {
      throw new Error("Expected inbox notification fixture.");
    }
    const timeElement = screen.getByText(inboxItem.relativeTime);
    expect(timeElement.tagName).toBe("TIME");
    expect(timeElement).toHaveAttribute("dateTime", inboxItem.occurredAt);
  });

  it("switches to the general tab", () => {
    render(
      <AppShellNotificationDropdown
        defaultOpen
        defaultTab="general"
        trigger={<button type="button">Open notifications</button>}
      />
    );

    expect(
      screen.getByRole("list", { name: "General notifications" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Scheduled maintenance window this Saturday")
    ).toBeInTheDocument();
  });
});
