"use client";

import type { ComponentProps } from "react";
import { DatatableUserBlock } from "./datatable-user";

type UserRow = ComponentProps<typeof DatatableUserBlock>["data"][number];

export interface SystemAdminMembershipTableBlockRow {
  readonly displayName: string;
  readonly email: string;
  readonly membershipId: string;
  readonly membershipStatus: string;
  readonly roleKey: string;
  readonly roleName: string;
}

export interface SystemAdminMembershipsTableBlockProps {
  readonly memberships: readonly SystemAdminMembershipTableBlockRow[];
}

function normalizeStatus(value: string): UserRow["status"] {
  const status = value.toLowerCase();

  if (status === "inactive" || status === "revoked") {
    return "inactive";
  }

  if (status === "pending") {
    return "pending";
  }

  return "active";
}

function mapMembershipRole(value: string): UserRow["role"] {
  const normalized = value.toLowerCase();

  if (normalized.includes("admin")) {
    return "admin";
  }

  if (normalized.includes("editor")) {
    return "editor";
  }

  if (normalized.includes("maintainer")) {
    return "maintainer";
  }

  return "subscriber";
}

function mapMembershipPlan(value: string): UserRow["plan"] {
  const normalized = value.toLowerCase();

  if (normalized.includes("enterprise")) {
    return "enterprise";
  }

  if (normalized.includes("company")) {
    return "company";
  }

  return "team";
}

function mapMembershipBilling(status: string): UserRow["billing"] {
  const normalized = status.toLowerCase();

  if (normalized === "inactive") {
    return "manual-paypal";
  }

  if (normalized === "pending") {
    return "manual-cash";
  }

  return "auto-debit";
}

function mapMembershipProfileText(value: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    return "Membership";
  }

  return normalized;
}

function mapMembershipRow(
  membership: SystemAdminMembershipTableBlockRow
): UserRow {
  return {
    avatar: "",
    billing: mapMembershipBilling(membership.membershipStatus),
    email: membership.email,
    fallback: mapMembershipProfileText(membership.displayName)
      .slice(0, 2)
      .toUpperCase(),
    id: membership.membershipId,
    plan: mapMembershipPlan(membership.roleKey),
    role: mapMembershipRole(membership.roleName),
    status: normalizeStatus(membership.membershipStatus),
    user: mapMembershipProfileText(membership.displayName),
  };
}

export function SystemAdminMembershipsTableBlock({
  memberships,
}: SystemAdminMembershipsTableBlockProps) {
  if (memberships.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No active memberships exist for the company scope yet.
      </p>
    );
  }

  return <DatatableUserBlock data={memberships.map(mapMembershipRow)} />;
}
