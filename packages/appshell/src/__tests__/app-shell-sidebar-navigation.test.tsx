import { render, screen } from "@testing-library/react";
import { BarChart3Icon, UsersIcon } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ApplicationShell } from "../app-shell";
import type { AppShellMenuItem } from "../presentation/data/app-shell.data";

const navigationWithActiveRoute = [
  {
    icon: <UsersIcon aria-hidden />,
    label: "HRM",
    href: "/modules/hrm",
    active: true,
  },
  {
    icon: <BarChart3Icon aria-hidden />,
    label: "Accounting",
    href: "/modules/accounting",
  },
] satisfies readonly AppShellMenuItem[];

describe("AppShellSidebar manifest navigation", () => {
  it("sets aria-current=page on the active nav link", () => {
    render(<ApplicationShell navigationPages={navigationWithActiveRoute} />);

    const hrmLink = screen.getByRole("link", { name: "HRM" });
    const accountingLink = screen.getByRole("link", { name: "Accounting" });

    expect(hrmLink).toHaveAttribute("aria-current", "page");
    expect(accountingLink).not.toHaveAttribute("aria-current");
  });

  it("renders manifest badge on sidebar nav items", () => {
    const navigationWithBadge = [
      {
        icon: <UsersIcon aria-hidden />,
        label: "HRM",
        href: "/modules/hrm",
        badge: "New",
      },
    ] satisfies readonly AppShellMenuItem[];

    render(<ApplicationShell navigationPages={navigationWithBadge} />);

    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
