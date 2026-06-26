import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2VerifyEmailSentState } from "@/app/(auth-v2)/_components/auth-v2-journey-states";

describe("AuthV2 journey states", () => {
  it("renders package status surface with h2 inside entry page", () => {
    render(
      <AuthV2EntryPage route="verifyEmailSent">
        <AuthV2VerifyEmailSentState />
      </AuthV2EntryPage>
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
