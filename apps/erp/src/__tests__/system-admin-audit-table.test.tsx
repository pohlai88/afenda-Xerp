import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SystemAdminAuditTable } from "@/components/system-admin/system-admin-audit-table";
import type { AdminAuditEventRow } from "@/lib/system-admin/list-recent-audit-events.server";
import { SYSTEM_ADMIN_AUDIT_TABLE_COPY } from "@/lib/system-admin/system-admin-audit.copy.contract";

const SAMPLE_ROWS: AdminAuditEventRow[] = [
  {
    action: "invite_user",
    correlationId: "corr-001",
    createdAt: "2026-06-24T10:00:00.000Z",
    id: "evt-001",
    module: "system-admin",
    result: "success",
    targetId: "user-abc",
    targetType: "user",
  },
  {
    action: "change_role",
    correlationId: "corr-002",
    createdAt: "2026-06-24T09:00:00.000Z",
    id: "evt-002",
    module: "system-admin",
    result: "denied",
    targetId: null,
    targetType: "membership",
  },
];

describe("SystemAdminAuditTable", () => {
  it("renders audit rows when data is provided", () => {
    render(<SystemAdminAuditTable rows={SAMPLE_ROWS} />);

    expect(screen.getByText("invite_user")).toBeDefined();
    expect(screen.getByText("change_role")).toBeDefined();
  });

  it("renders empty state when no rows provided", () => {
    render(<SystemAdminAuditTable rows={[]} />);

    expect(
      screen.getByText(SYSTEM_ADMIN_AUDIT_TABLE_COPY.emptyStateTitle)
    ).toBeDefined();
  });

  it("renders sortable column header buttons for Time, Module, Result", () => {
    render(<SystemAdminAuditTable rows={SAMPLE_ROWS} />);

    expect(
      screen.getByRole("button", {
        name: /Sort by Time/,
      })
    ).toBeDefined();
    expect(
      screen.getByRole("button", {
        name: /Sort by Module/,
      })
    ).toBeDefined();
    expect(
      screen.getByRole("button", {
        name: /Sort by Result/,
      })
    ).toBeDefined();
  });

  it("renders result badges without className on @afenda/ui Badge", () => {
    const { container } = render(<SystemAdminAuditTable rows={SAMPLE_ROWS} />);

    const badges = container.querySelectorAll("[data-slot='badge']");
    for (const badge of badges) {
      const classAttr = badge.getAttribute("class") ?? "";
      expect(classAttr).not.toMatch(/className/);
    }
  });

  it("renders correlation IDs in code elements", () => {
    render(<SystemAdminAuditTable rows={SAMPLE_ROWS} />);

    const codes = screen.getAllByText(/corr-/);
    expect(codes.length).toBeGreaterThan(0);
  });
});
