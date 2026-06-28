import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AppShellAccountSettings05,
  type AppShellAccountSettings05MemberRow,
  type AppShellAccountSettings05PendingInviteRow,
} from "../presentation/blocks/app-shell-account-settings-05";

const roleOptions = [
  { label: "Tenant admin", value: "role_admin" },
  { label: "Workspace reader", value: "role_reader" },
] as const;

const members: AppShellAccountSettings05MemberRow[] = [
  {
    email: "admin@example.com",
    id: "membership_admin",
    isAdmin: true,
    name: "Admin User",
    role: "role_admin",
  },
  {
    email: "reader@example.com",
    id: "membership_reader",
    name: "Reader User",
    role: "role_reader",
  },
];

const pendingInvites: AppShellAccountSettings05PendingInviteRow[] = [
  {
    email: "pending@example.com",
    id: "membership_pending",
    name: "Pending User",
    role: "role_reader",
  },
];

describe("AppShellAccountSettings05", () => {
  it("renders members and pending invitations", () => {
    render(
      <AppShellAccountSettings05
        members={members}
        pendingInvites={pendingInvites}
        roleOptions={roleOptions}
      />
    );

    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Pending invitations")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("pending@example.com")).toBeInTheDocument();
  });

  it("calls pending revoke and resend handlers from the actions menu", async () => {
    const user = setupUser();
    const onPendingRemove = vi.fn();
    const onPendingResend = vi.fn();

    render(
      <AppShellAccountSettings05
        members={members}
        onPendingRemove={onPendingRemove}
        onPendingResend={onPendingResend}
        pendingInvites={pendingInvites}
        roleOptions={roleOptions}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Actions for pending invite pending@example.com",
      })
    );
    await user.click(screen.getByRole("menuitem", { name: "Resend" }));
    expect(onPendingResend).toHaveBeenCalledWith("membership_pending");

    await user.click(
      screen.getByRole("button", {
        name: "Actions for pending invite pending@example.com",
      })
    );
    await user.click(screen.getByRole("menuitem", { name: "Revoke" }));
    expect(onPendingRemove).toHaveBeenCalledWith("membership_pending");
  });

  it("calls member role change handler for non-admin members", async () => {
    const user = setupUser();
    const onMemberRoleChange = vi.fn();

    render(
      <AppShellAccountSettings05
        members={members}
        onMemberRoleChange={onMemberRoleChange}
        pendingInvites={[]}
        roleOptions={roleOptions}
      />
    );

    const roleSelects = screen.getAllByRole("combobox");
    const readerRoleSelect = roleSelects.find(
      (element) => !element.hasAttribute("disabled")
    );

    expect(readerRoleSelect).toBeDefined();
    await user.click(readerRoleSelect as HTMLElement);
    await user.click(screen.getByRole("option", { name: "Tenant admin" }));

    expect(onMemberRoleChange).toHaveBeenCalledWith(
      "membership_reader",
      "role_admin"
    );
  });
});
