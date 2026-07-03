"use client";

import { DatatableInvoiceBlock } from "@afenda/shadcn-studio";
import type { ComponentProps } from "react";
import type { SystemAdminPermissionRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

type InvoiceRow = ComponentProps<typeof DatatableInvoiceBlock>["data"][number];

export interface SystemAdminPermissionsTableProps {
  readonly permissions: readonly SystemAdminPermissionRowDto[];
}

function mapPermissionStatus(
  permission: SystemAdminPermissionRowDto
): InvoiceRow["status"] {
  if (permission.key.includes("delete")) {
    return "past due";
  }

  if (permission.key.includes("write")) {
    return "downloaded";
  }

  return "paid";
}

function mapPermissionRows(
  permissions: readonly SystemAdminPermissionRowDto[]
): InvoiceRow[] {
  return permissions.map((permission) => ({
    avatar: "",
    balance: 0,
    client: permission.name,
    fallback: permission.key.slice(0, 2).toUpperCase(),
    field: `${permission.domain} · ${permission.action}`,
    id: permission.id,
    issuedDate: new Date("2026-01-01T00:00:00.000Z"),
    status: mapPermissionStatus(permission),
    total: 0,
  }));
}

export function SystemAdminPermissionsTable({
  permissions,
}: SystemAdminPermissionsTableProps) {
  if (permissions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No permissions are registered in the catalog yet.
      </p>
    );
  }

  return <DatatableInvoiceBlock data={mapPermissionRows(permissions)} />;
}
