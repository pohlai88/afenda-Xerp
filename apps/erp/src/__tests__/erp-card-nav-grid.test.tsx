import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErpCardNavGrid } from "@/components/erp-card-nav-grid";
import { SYSTEM_ADMIN_SECTIONS } from "@/lib/system-admin/system-admin-sections";

describe("ErpCardNavGrid", () => {
  it("renders navigable cards derived from system admin sections", () => {
    const items = [
      {
        description: "Open the user directory and invite flows when they land.",
        href: "/system-admin/users",
        iconKey: "users",
        label: "Users",
        sectionId: "users",
      },
      {
        description: "Review recent security and configuration audit events.",
        href: "/system-admin/audit",
        iconKey: "audit",
        label: "Audit",
        sectionId: "audit",
      },
    ] as const;

    render(<ErpCardNavGrid items={items} />);

    expect(
      screen.getByRole("navigation", { name: "System admin sections" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Users/i })).toHaveAttribute(
      "href",
      "/system-admin/users"
    );
    expect(screen.getByRole("link", { name: /Audit/i })).toHaveAttribute(
      "href",
      SYSTEM_ADMIN_SECTIONS[4]?.href
    );
  });

  it("renders nothing when no items are provided", () => {
    const { container } = render(<ErpCardNavGrid items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
