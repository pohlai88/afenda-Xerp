"use client";

import { DatatableUserBlock } from "@afenda/shadcn-studio";
import type { ComponentProps } from "react";
import type { SystemAdminRoleRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

type UserRow = ComponentProps<typeof DatatableUserBlock>["data"][number];

export interface SystemAdminRolesTableProps {
  readonly roles: readonly SystemAdminRoleRowDto[];
}

function mapRoleStatus(status: string): UserRow["status"] {
  if (
    status.toLowerCase() === "inactive" ||
    status.toLowerCase() === "disabled"
  ) {
    return "inactive";
  }

  if (status.toLowerCase() === "pending") {
    return "pending";
  }

  return "active";
}

function mapRolePlan(scope: string): UserRow["plan"] {
  const normalizedScope = scope.toLowerCase();

  if (normalizedScope.includes("platform")) {
    return "enterprise";
  }

  if (normalizedScope.includes("tenant")) {
    return "company";
  }

  return "team";
}

function mapRoleBilling(status: string): UserRow["billing"] {
  if (status.toLowerCase() === "inactive") {
    return "manual-paypal";
  }

  if (status.toLowerCase() === "pending") {
    return "manual-cash";
  }

  return "auto-debit";
}

function mapRoleProfileName(name: string): string {
  return name.trim() || "Role";
}

function mapRoleRow(role: SystemAdminRoleRowDto): UserRow {
  return {
    avatar: "",
    billing: mapRoleBilling(role.status),
    email: role.key,
    fallback: mapRoleProfileName(role.name).slice(0, 2).toUpperCase(),
    id: role.id,
    plan: mapRolePlan(role.scope),
    role: role.name.toLowerCase().includes("admin") ? "admin" : "subscriber",
    status: mapRoleStatus(role.status),
    user: role.name,
  };
}

export function SystemAdminRolesTable({ roles }: SystemAdminRolesTableProps) {
  if (roles.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No roles are configured for this tenant yet.
      </p>
    );
  }

  return <DatatableUserBlock data={roles.map(mapRoleRow)} />;
}
