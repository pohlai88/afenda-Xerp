import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthVerifyEmailSentState } from "@/app/(auth)/_components/auth-journey-states";

describe("Auth journey states", () => {
  it("renders package status surface with h2 inside entry page", () => {
    render(
      <AuthEntryPage route="verifyEmailSent">
        <AuthVerifyEmailSentState />
      </AuthEntryPage>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Check your inbox" })
    ).toBeTruthy();
    const status = screen.getByRole("status");
    expect(status.getAttribute("data-auth-slot")).toBe("status");
    expect(status.getAttribute("data-tone")).toBe("positive");
    expect(screen.queryAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
