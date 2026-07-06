// @vitest-environment jsdom

import { render, screen } from "@afenda/testing/react";
import { StudioPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import { describe, expect, it } from "vitest";

import { SystemAdminMembershipsComposer } from "../system-admin-memberships-composer.client";
import { SystemAdminPermissionsComposer } from "../system-admin-permissions-composer.client";
import { SystemAdminRolesComposer } from "../system-admin-roles-composer.client";
import { SystemAdminUsersComposer } from "../system-admin-users-composer.client";

const membershipRows = [
  {
    email: "jordan.lee@example.com",
    id: "membership-1",
    role: "admin" as const,
    status: "active" as const,
    user: "Jordan Lee",
  },
] as const;

const userRows = [
  {
    email: "ada.lovelace@example.com",
    id: "user-ada",
    role: "admin" as const,
    status: "active" as const,
    user: "Ada Lovelace",
  },
] as const;

const roleRows = [
  {
    id: "role-1",
    key: "tenant.admin",
    name: "Tenant Admin",
    scope: "tenant",
    status: "active" as const,
  },
] as const;

const permissionRows = [
  {
    action: "users_read",
    domain: "system_admin",
    id: "perm-1",
    key: "system_admin.users_read",
    name: "Read platform users",
  },
] as const;

describe("SystemAdminMembershipsComposer", () => {
  it("renders v2 DataTableSurface for membership rows", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminMembershipsComposer data={membershipRows} />
      </StudioPresentationProviders>
    );

    expect(screen.getByRole("heading", { name: "Memberships" })).toBeVisible();
    expect(screen.getByText("Jordan Lee")).toBeVisible();
    expect(
      document.querySelector("[data-slot='data-table-surface-table']")
    ).not.toBeNull();
  });

  it("shows empty state when no memberships exist", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminMembershipsComposer data={[]} />
      </StudioPresentationProviders>
    );

    expect(
      screen.getByText(
        "No active memberships exist for this company scope yet."
      )
    ).toBeVisible();
  });
});

describe("SystemAdminUsersComposer", () => {
  it("renders v2 DataTableSurface for user rows", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminUsersComposer data={userRows} />
      </StudioPresentationProviders>
    );

    expect(screen.getByRole("heading", { name: "Users" })).toBeVisible();
    expect(screen.getByText("Ada Lovelace")).toBeVisible();
  });
});

describe("SystemAdminRolesComposer", () => {
  it("renders v2 DataTableSurface for role rows", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminRolesComposer data={roleRows} />
      </StudioPresentationProviders>
    );

    expect(screen.getByRole("heading", { name: "Roles" })).toBeVisible();
    expect(screen.getByText("Tenant Admin")).toBeVisible();
  });
});

describe("SystemAdminPermissionsComposer", () => {
  it("renders v2 DataTableSurface for permission rows", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminPermissionsComposer data={permissionRows} />
      </StudioPresentationProviders>
    );

    expect(screen.getByRole("heading", { name: "Permissions" })).toBeVisible();
    expect(screen.getByText("Read platform users")).toBeVisible();
  });
});
