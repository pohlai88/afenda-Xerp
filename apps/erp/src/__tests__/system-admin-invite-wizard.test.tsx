import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SystemAdminInviteDialog } from "@/components/system-admin/system-admin-invite-dialog";
import { SYSTEM_ADMIN_INVITE_TRIGGER_LABEL } from "@/lib/system-admin/system-admin-invite.copy.contract";

const mockInviteSystemAdminUser = vi.fn();

vi.mock("@/lib/system-admin/system-admin-invite.client", () => ({
  inviteSystemAdminUser: (
    ...args: Parameters<typeof mockInviteSystemAdminUser>
  ) => mockInviteSystemAdminUser(...args),
}));

const ROLE_OPTIONS = [
  {
    description: "Tenant-wide administration for development workspaces.",
    roleId: "role-admin",
    roleName: "Tenant Admin",
  },
  {
    description: "Workspace dashboard access only.",
    roleId: "role-reader",
    roleName: "Workspace Reader",
  },
] as const;

const API_SCOPE = {
  companyId: "company-a",
  companySlug: "acme-co",
  tenantSlug: "acme",
} as const;

describe("SystemAdminInviteDialog", () => {
  it("renders governed invite trigger without className on primitives", () => {
    render(
      <SystemAdminInviteDialog
        apiScope={API_SCOPE}
        roleOptions={ROLE_OPTIONS}
      />
    );

    expect(
      screen.getByRole("button", { name: SYSTEM_ADMIN_INVITE_TRIGGER_LABEL })
    ).toBeInTheDocument();
  });

  it("walks identity, role, and confirm steps then submits invite", async () => {
    mockInviteSystemAdminUser.mockResolvedValueOnce({
      membershipId: "membership-002",
      userId: "user-002",
    });

    const user = setupUser();

    render(
      <SystemAdminInviteDialog
        apiScope={API_SCOPE}
        roleOptions={ROLE_OPTIONS}
      />
    );

    await user.click(
      screen.getByRole("button", { name: SYSTEM_ADMIN_INVITE_TRIGGER_LABEL })
    );

    expect(
      screen.getByRole("heading", { name: "User identity" })
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("Display name"), "Invited User");
    await user.type(
      screen.getByLabelText("Email address"),
      "invited@example.com"
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByRole("heading", { name: "Assign role" })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByRole("heading", { name: "Confirm invite" })
    ).toBeInTheDocument();
    expect(screen.getByText("Invited User")).toBeInTheDocument();
    expect(screen.getByText("invited@example.com")).toBeInTheDocument();
    expect(screen.getByText("Tenant Admin")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Send invite" }));

    expect(mockInviteSystemAdminUser).toHaveBeenCalledWith(API_SCOPE, {
      displayName: "Invited User",
      email: "invited@example.com",
      roleId: "role-admin",
    });
  });

  it("associates role radios with labels for keyboard selection", async () => {
    const user = setupUser();

    render(
      <SystemAdminInviteDialog
        apiScope={API_SCOPE}
        roleOptions={ROLE_OPTIONS}
      />
    );

    await user.click(
      screen.getByRole("button", { name: SYSTEM_ADMIN_INVITE_TRIGGER_LABEL })
    );
    await user.type(screen.getByLabelText("Display name"), "Invited User");
    await user.type(
      screen.getByLabelText("Email address"),
      "invited@example.com"
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const workspaceReaderRadio = screen.getByRole("radio", {
      name: /Workspace Reader/,
    });

    await user.click(workspaceReaderRadio);
    expect(workspaceReaderRadio).toHaveAttribute("aria-checked", "true");
  });

  it("exposes step indicator with aria-current on the active step", async () => {
    const user = setupUser();

    render(
      <SystemAdminInviteDialog
        apiScope={API_SCOPE}
        roleOptions={ROLE_OPTIONS}
      />
    );

    await user.click(
      screen.getByRole("button", { name: SYSTEM_ADMIN_INVITE_TRIGGER_LABEL })
    );

    const steps = screen.getByRole("navigation", {
      name: "Invite wizard steps",
    });
    expect(steps.querySelector('[aria-current="step"]')).toHaveTextContent(
      "Identity"
    );
  });
});
