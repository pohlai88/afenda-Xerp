import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  type AppShellAccountSettings06PasskeyRow,
  type AppShellAccountSettings06SessionRow,
  AppShellAccountSettings06User,
} from "../shadcn-studio/blocks/app-shell-account-settings-06-user";

const sessions: AppShellAccountSettings06SessionRow[] = [
  {
    id: "sess_1",
    issuedAtLabel: "Signed in today",
    ipAddress: "127.0.0.1",
    userAgent: "vitest",
    isCurrent: true,
  },
];

const passkeys: AppShellAccountSettings06PasskeyRow[] = [
  {
    id: "pk_1",
    label: "1Password",
    createdAtLabel: "Registered yesterday",
  },
];

describe("AppShellAccountSettings06User", () => {
  it("renders passkeys section with list and add action", () => {
    render(
      <AppShellAccountSettings06User
        onAddPasskey={vi.fn()}
        onDeletePasskey={vi.fn()}
        passkeys={passkeys}
        sessions={sessions}
        userMfaEnabled={false}
      />
    );

    expect(screen.getByText("Passkeys")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add passkey" })
    ).toBeInTheDocument();
    expect(screen.getByText("1Password")).toBeInTheDocument();
    expect(screen.getByText("Registered yesterday")).toBeInTheDocument();
  });

  it("calls passkey add and delete handlers", async () => {
    const user = setupUser();
    const onAddPasskey = vi.fn();
    const onDeletePasskey = vi.fn();

    render(
      <AppShellAccountSettings06User
        onAddPasskey={onAddPasskey}
        onDeletePasskey={onDeletePasskey}
        passkeys={passkeys}
        sessions={sessions}
        userMfaEnabled={false}
      />
    );

    await user.click(screen.getByRole("button", { name: "Add passkey" }));
    expect(onAddPasskey).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole("button", { name: "Remove passkey 1Password" })
    );
    expect(onDeletePasskey).toHaveBeenCalledWith("pk_1");
  });
});
