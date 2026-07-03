"use client";

import type { ComponentProps } from "react";
import { DatatableUserBlock } from "./datatable-user";

type UserRow = ComponentProps<typeof DatatableUserBlock>["data"][number];

export interface SystemAdminRoleTableBlockRow {
  readonly description?: string | null;
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly scope: string;
  readonly status: string;
}

export interface SystemAdminRolesTableBlockProps {
  readonly roles: readonly SystemAdminRoleTableBlockRow[];
}

function mapRoleStatus(status: string): UserRow["status"] {
  const normalized = status.toLowerCase();

  if (normalized === "inactive" || normalized === "disabled") {
    return "inactive";
  }

  if (normalized === "pending") {
    return "pending";
  }

  return "active";
}

function mapRolePlan(scope: string): UserRow["plan"] {
  const normalized = scope.toLowerCase();

  if (normalized.includes("platform")) {
    return "enterprise";
  }

  if (normalized.includes("tenant")) {
    return "company";
  }

  return "team";
}

function mapRoleBilling(status: string): UserRow["billing"] {
  const normalized = status.toLowerCase();

  if (normalized === "inactive") {
    return "manual-paypal";
  }

  if (normalized === "pending") {
    return "manual-cash";
  }

  return "auto-debit";
}

function mapRoleProfileName(name: string): string {
  return name.trim() || "Role";
}

function mapRoleRow(role: SystemAdminRoleTableBlockRow): UserRow {
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

export function SystemAdminRolesTableBlock({
  roles,
}: SystemAdminRolesTableBlockProps) {
  if (roles.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No roles are configured for this tenant yet.
      </p>
    );
  }

  return <DatatableUserBlock data={roles.map(mapRoleRow)} />;
}
