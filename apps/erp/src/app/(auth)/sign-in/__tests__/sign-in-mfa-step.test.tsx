import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignInMfaStep } from "@/app/(auth)/_components/sign-in-mfa-step";

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
}));

const twoFactorMocks = vi.hoisted(() => ({
  sendOtp: vi.fn(),
  verifyBackupCode: vi.fn(),
  verifyOtp: vi.fn(),
  verifyTotp: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
}));

vi.mock("@afenda/auth/client", () => ({
  twoFactor: twoFactorMocks,
}));

describe("SignInMfaStep", () => {
  beforeEach(() => {
    routerMocks.refresh.mockReset();
    routerMocks.replace.mockReset();
    twoFactorMocks.sendOtp.mockReset();
    twoFactorMocks.verifyTotp.mockReset();
    twoFactorMocks.verifyOtp.mockReset();
    twoFactorMocks.verifyBackupCode.mockReset();
  });

  it("verifies TOTP and redirects on success", async () => {
    twoFactorMocks.verifyTotp.mockResolvedValue({ data: {}, error: null });
    const user = setupUser();

    render(
      <SignInMfaStep
        methods={["totp"]}
        nextPath="/dashboard"
        onBack={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText("Authentication code"), "123456");
    await user.click(
      screen.getByRole("button", { name: "Verify and continue" })
    );

    await waitFor(() => {
      expect(twoFactorMocks.verifyTotp).toHaveBeenCalledWith({
        code: "123456",
        trustDevice: true,
      });
    });
    expect(routerMocks.replace).toHaveBeenCalledWith("/dashboard");
    expect(routerMocks.refresh).toHaveBeenCalledOnce();
  });

  it("shows backup-code flow when toggled", async () => {
    twoFactorMocks.verifyBackupCode.mockResolvedValue({
      data: {},
      error: null,
    });
    const user = setupUser();

    render(<SignInMfaStep methods={["totp"]} nextPath="/" onBack={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Use a backup code instead" })
    );
    await user.type(screen.getByLabelText("Backup code"), "backup-1");
    await user.click(
      screen.getByRole("button", { name: "Verify and continue" })
    );

    await waitFor(() => {
      expect(twoFactorMocks.verifyBackupCode).toHaveBeenCalledWith({
        code: "backup-1",
        trustDevice: true,
      });
    });
  });

  it("sends and verifies email OTP when otp is the only method", async () => {
    twoFactorMocks.sendOtp.mockResolvedValue({ data: {}, error: null });
    twoFactorMocks.verifyOtp.mockResolvedValue({ data: {}, error: null });
    const user = setupUser();

    render(
      <SignInMfaStep methods={["otp"]} nextPath="/dashboard" onBack={vi.fn()} />
    );

    expect(await screen.findByText(/sent a sign-in code/i)).toBeInTheDocument();
    expect(twoFactorMocks.sendOtp).toHaveBeenCalledWith({ trustDevice: true });

    await user.type(screen.getByLabelText("Email code"), "445566");
    await user.click(
      screen.getByRole("button", { name: "Verify and continue" })
    );

    await waitFor(() => {
      expect(twoFactorMocks.verifyOtp).toHaveBeenCalledWith({
        code: "445566",
        trustDevice: true,
      });
    });
    expect(routerMocks.replace).toHaveBeenCalledWith("/dashboard");
  });

  it("surfaces verification errors", async () => {
    twoFactorMocks.verifyTotp.mockResolvedValue({
      data: null,
      error: { message: "Invalid code" },
    });
    const user = setupUser();

    render(<SignInMfaStep methods={["totp"]} nextPath="/" onBack={vi.fn()} />);

    await user.type(screen.getByLabelText("Authentication code"), "000000");
    await user.click(
      screen.getByRole("button", { name: "Verify and continue" })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not verify that code/i
    );
    expect(routerMocks.replace).not.toHaveBeenCalled();
  });
});
