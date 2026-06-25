import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

const {
  refresh,
  resendSystemAdminInviteAction,
  revokeSystemAdminInviteAction,
} = vi.hoisted(() => ({
  refresh: vi.fn(),
  resendSystemAdminInviteAction: vi.fn(),
  revokeSystemAdminInviteAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("@/lib/system-admin/resend-system-admin-invite.action", () => ({
  resendSystemAdminInviteAction,
}));

vi.mock("@/lib/system-admin/revoke-system-admin-invite.action", () => ({
  revokeSystemAdminInviteAction,
}));

vi.mock("@afenda/appshell", () => ({
  AppShellAccountSettings05: ({
    onPendingResend,
    onPendingRemove,
  }: {
    onPendingResend?: (inviteId: string) => void;
    onPendingRemove?: (inviteId: string) => void;
  }) => (
    <div>
      <button onClick={() => onPendingResend?.("invite-1")} type="button">
        Resend invite
      </button>
      <button onClick={() => onPendingRemove?.("invite-1")} type="button">
        Revoke invite
      </button>
    </div>
  ),
}));

import { SystemAdminMembersSettingsPanel } from "../system-admin-members-settings-panel";

const baseProps = {
  apiScope: {
    companyId: "company-1",
    tenantSlug: "acme",
  },
  companyId: "company-1",
  inviteSlot: null as ReactNode,
  members: [],
  pendingInvites: [
    {
      email: "pending@example.com",
      id: "invite-1",
      name: "Pending User",
      role: "member",
    },
  ],
  roleOptions: [{ label: "Member", value: "member" }],
};

describe("SystemAdminMembersSettingsPanel", () => {
  it("shows an error and skips refresh when resend fails", async () => {
    refresh.mockClear();
    resendSystemAdminInviteAction.mockResolvedValue({
      ok: false,
      code: "NOT_FOUND",
      userMessage: "Invitation not found.",
    });

    const user = setupUser();
    render(<SystemAdminMembersSettingsPanel {...baseProps} />);

    await user.click(screen.getByRole("button", { name: "Resend invite" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invitation not found."
    );
    expect(refresh).not.toHaveBeenCalled();
  });

  it("refreshes members when resend succeeds", async () => {
    refresh.mockClear();
    resendSystemAdminInviteAction.mockResolvedValue({
      ok: true,
      data: { inviteId: "invite-1" },
    });

    const user = setupUser();
    render(<SystemAdminMembersSettingsPanel {...baseProps} />);

    await user.click(screen.getByRole("button", { name: "Resend invite" }));

    await waitFor(() => {
      expect(refresh).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Invitation resent.");
  });

  it("shows an error and skips refresh when revoke fails", async () => {
    refresh.mockClear();
    revokeSystemAdminInviteAction.mockResolvedValue({
      ok: false,
      code: "FORBIDDEN",
      userMessage: "You do not have permission to perform this action.",
    });

    const user = setupUser();
    render(<SystemAdminMembersSettingsPanel {...baseProps} />);

    await user.click(screen.getByRole("button", { name: "Revoke invite" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "You do not have permission to perform this action."
    );
    expect(refresh).not.toHaveBeenCalled();
  });
});
