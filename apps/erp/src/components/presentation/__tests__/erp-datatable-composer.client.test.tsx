// @vitest-environment jsdom

import { render, screen } from "@afenda/testing/react";
import { StudioPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import { describe, expect, it } from "vitest";

import { ErpDataTableComposer } from "../erp-datatable-composer.client";
import { systemAdminUserTableColumnDefs } from "@/lib/presentation/system-admin-user-table-columns";

const fixtureRows = [
  {
    email: "ada.lovelace@example.com",
    id: "user-ada",
    role: "admin" as const,
    status: "active" as const,
    user: "Ada Lovelace",
  },
  {
    email: "grace.hopper@example.com",
    id: "user-grace",
    role: "editor" as const,
    status: "pending" as const,
    user: "Grace Hopper",
  },
] as const;

describe("ErpDataTableComposer", () => {
  it("projects TanStack rows into V2 DataTableSurface", () => {
    render(
      <StudioPresentationProviders>
        <ErpDataTableComposer
          columns={systemAdminUserTableColumnDefs}
          data={fixtureRows}
          getRowId={(row) => row.id}
          surface={{
            description: "Fixture directory for composer proof.",
            title: "Users directory",
          }}
        />
      </StudioPresentationProviders>
    );

    expect(
      screen.getByRole("heading", { name: "Users directory" })
    ).toBeVisible();
    expect(screen.getByText("Ada Lovelace")).toBeVisible();
    expect(screen.getByText("grace.hopper@example.com")).toBeVisible();
    expect(screen.getByText("admin")).toBeVisible();
    expect(
      document.querySelector("[data-slot='data-table-surface-table']")
    ).not.toBeNull();
  });
});
