import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AuthSegmentErrorShell,
  AuthSignInEscape,
} from "@/app/(auth)/_components/auth-error-surface.client";

// AuthSegmentErrorShell reads brand from context; mock to isolate from layout
vi.mock("@/app/(auth)/_components/auth-brand-context", () => ({
  useAuthBrand: () => null,
}));

describe("AuthSegmentErrorShell — escape action", () => {
  it("renders the default sign-in escape link when no escapeAction prop is supplied", () => {
    render(<AuthSegmentErrorShell title="Something went wrong" />);

    const escapeLink = screen.getByRole("link", { name: /return to sign in/i });
    expect(escapeLink).toBeTruthy();
    expect(escapeLink.getAttribute("href")).toBe("/sign-in");
  });

  it("renders a custom escapeAction when supplied, replacing the default", () => {
    render(
      <AuthSegmentErrorShell
        escapeAction={<a href="/custom-escape">Go back</a>}
        title="Something went wrong"
      />
    );

    expect(screen.getByRole("link", { name: /go back/i })).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: /return to sign in/i })
    ).toBeNull();
  });
});

describe("AuthSignInEscape", () => {
  it("renders a link to the sign-in route", () => {
    render(<AuthSignInEscape />);

    const link = screen.getByRole("link", { name: /return to sign in/i });
    expect(link.getAttribute("href")).toBe("/sign-in");
  });
});
