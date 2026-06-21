import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { defaultAppShellActivities } from "../shadcn-studio/data/app-shell.data";
import { AppShellActivityFeed } from "../shadcn-studio/blocks/app-shell-activity-feed";

describe("AppShellActivityFeed", () => {
  it("renders the ERP activity feed with accessible list semantics", () => {
    render(<AppShellActivityFeed />);

    expect(
      screen.getByRole("feed", { name: "Team activity feed" })
    ).toBeInTheDocument();
    expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByText(/Q2 budget review/)).toBeInTheDocument();
    expect(screen.getByText("ap-invoices-june.pdf")).toBeInTheDocument();
    expect(screen.getByText("Manufacturing")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(defaultAppShellActivities.length);
  });

  it("supports a custom feed label", () => {
    render(<AppShellActivityFeed feedLabel="Finance activity" />);

    expect(
      screen.getByRole("feed", { name: "Finance activity" })
    ).toBeInTheDocument();
  });

  it("renders an empty-state status when there are no activities", () => {
    render(<AppShellActivityFeed activities={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent(/No team activity yet/);
    expect(screen.queryByRole("feed")).not.toBeInTheDocument();
  });

  it("renders mention reply controls for mention-type activities", () => {
    render(<AppShellActivityFeed />);

    expect(screen.getByLabelText("Reply message")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Reply to mention" })).toBeInTheDocument();
    expect(screen.getByText("Attach image", { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("renders ISO timestamps inside time elements", () => {
    render(<AppShellActivityFeed />);

    const mentionActivity = defaultAppShellActivities.find(
      (item) => item.id === "activity-q2-budget-mention"
    );
    expect(mentionActivity).toBeDefined();

    const timeElement = screen.getByText(mentionActivity?.relativeTime ?? "");
    expect(timeElement.tagName).toBe("TIME");
    expect(timeElement).toHaveAttribute("dateTime", mentionActivity?.occurredAt);
  });

  it("renders actor avatars with governed data-slot values", () => {
    render(<AppShellActivityFeed />);

    const feed = screen.getByRole("feed", { name: "Team activity feed" });
    const avatars = within(feed).getAllByText("AM");

    expect(avatars[0]?.closest('[data-slot="avatar"]')).not.toBeNull();
    expect(within(feed).getByText("JR").closest('[data-slot="avatar-fallback"]')).not.toBeNull();
  });

  it("renders governed badges with the canonical data-slot value", () => {
    render(<AppShellActivityFeed />);

    const feed = screen.getByRole("feed", { name: "Team activity feed" });
    const manufacturingBadge = within(feed).getByText("Manufacturing");

    expect(manufacturingBadge).toHaveAttribute("data-slot", "badge");
  });

  it("renders file attachments as navigable links", () => {
    render(<AppShellActivityFeed />);

    const invoiceLink = screen.getByRole("link", { name: /ap-invoices-june\.pdf/i });
    expect(invoiceLink).toHaveAttribute("href", "#");

    const designLink = screen.getByRole("link", { name: /BOM-redesign-v3\.fig/i });
    expect(designLink).toHaveAttribute("href", "#");
  });

  it("accepts a custom activities feed", () => {
    render(
      <AppShellActivityFeed
        activities={[
          {
            id: "custom-activity",
            kind: "simple",
            actor: {
              name: "Test Operator",
              avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
              fallback: "TO",
            },
            action: "approved your purchase order",
            relativeTime: "Just now",
            occurredAt: "2026-06-21T10:00:00Z",
          },
        ]}
      />
    );

    expect(screen.getByText("Test Operator")).toBeInTheDocument();
    expect(screen.getByText(/approved your purchase order/)).toBeInTheDocument();
    expect(screen.queryByText("Alex Morgan")).not.toBeInTheDocument();
  });
});
