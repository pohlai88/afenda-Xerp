"use client";

import type { ComponentProps } from "react";
import { DatatableInvoiceBlock } from "./datatable-invoice";

type InvoiceRow = ComponentProps<typeof DatatableInvoiceBlock>["data"][number];

export interface SystemAdminPermissionTableBlockRow {
  readonly action: string;
  readonly description?: string | null;
  readonly domain: string;
  readonly id: string;
  readonly key: string;
  readonly name: string;
}

export interface SystemAdminPermissionsTableBlockProps {
  readonly permissions: readonly SystemAdminPermissionTableBlockRow[];
}

function mapPermissionStatus(
  permission: SystemAdminPermissionTableBlockRow
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
  permissions: readonly SystemAdminPermissionTableBlockRow[]
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

export function SystemAdminPermissionsTableBlock({
  permissions,
}: SystemAdminPermissionsTableBlockProps) {
  if (permissions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No permissions are registered in the catalog yet.
      </p>
    );
  }

  return <DatatableInvoiceBlock data={mapPermissionRows(permissions)} />;
}
