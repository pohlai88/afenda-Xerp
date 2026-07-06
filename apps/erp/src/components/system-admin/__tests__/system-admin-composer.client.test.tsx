// @vitest-environment jsdom

import { StudioPresentationProviders } from "@afenda/shadcn-studio-v2/clients";
import { render, screen } from "@afenda/testing/react";
import { describe, expect, it } from "vitest";

import { SystemAdminAuditComposer } from "../system-admin-audit-composer.client";
import { SystemAdminDiagnosticsPanel } from "../system-admin-diagnostics-panel.client";
import { SystemAdminMembershipsComposer } from "../system-admin-memberships-composer.client";
import { SystemAdminPermissionsComposer } from "../system-admin-permissions-composer.client";
import { SystemAdminRolesComposer } from "../system-admin-roles-composer.client";
import { SystemAdminSettingsPanel } from "../system-admin-settings-panel.client";
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

const auditRows = [
  {
    action: "user.invite",
    correlationId: "req_abc123",
    createdAt: "2026-06-26T14:22:00.000Z",
    id: "audit-1",
    result: "success",
    target: "user · user-1",
  },
] as const;

const diagnosticsSnapshot = {
  apiContractCount: 24,
  companyId: "company-1",
  correlationId: "req_diag_01",
  protectedSurfaceCount: 12,
  recentAuditEventCount: 42,
  spineDelegateIds: ["spine.users.list", "spine.roles.list"],
  tenantId: "tenant-abc12345",
  workspaceId: "workspace-1",
} as const;

const settingsModules = [
  {
    domain: "system_admin",
    label: "System admin",
    permissionCount: 8,
  },
] as const;

describe("SystemAdminAuditComposer", () => {
  it("renders v2 DataTableSurface for audit rows", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminAuditComposer data={auditRows} />
      </StudioPresentationProviders>
    );

    expect(screen.getByRole("heading", { name: "Audit events" })).toBeVisible();
    expect(screen.getByText("user.invite")).toBeVisible();
  });
});

describe("SystemAdminSettingsPanel", () => {
  it("renders v2 SettingsSurface for module rows", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminSettingsPanel modules={settingsModules} />
      </StudioPresentationProviders>
    );

    expect(
      document.querySelector("[data-slot='settings-surface']")
    ).not.toBeNull();
    expect(screen.getByText("System admin")).toBeVisible();
  });
});

describe("SystemAdminDiagnosticsPanel", () => {
  it("renders v2 MetricWidget and EvidenceWidget surfaces", () => {
    render(
      <StudioPresentationProviders>
        <SystemAdminDiagnosticsPanel snapshot={diagnosticsSnapshot} />
      </StudioPresentationProviders>
    );

    expect(
      document.querySelector("[data-slot='metric-widget']")
    ).not.toBeNull();
    expect(
      document.querySelector("[data-slot='evidence-widget']")
    ).not.toBeNull();
    expect(screen.getByText("API contracts")).toBeVisible();
  });
});
