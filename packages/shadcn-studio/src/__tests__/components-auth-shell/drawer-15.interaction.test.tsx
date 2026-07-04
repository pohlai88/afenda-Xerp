import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthShellSurfaceV1 from "../../components-auth-shell/prelogin-bundle-01";

describe("AuthShellSurfaceV1 drawer interaction", () => {
  it("opens the auth navigation drawer and switches between auth routes", async () => {
    const user = setupUser();

    render(<AuthShellSurfaceV1 mode="drawer" triggerLabel="Open authentication" />);

    await user.click(
      screen.getByRole("button", { name: "Open authentication" })
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Authenticate without leaving the drawer.",
      })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /reset password/i }));

    expect(
      screen.getByRole("button", {
        name: "Send reset link",
      })
    ).toBeInTheDocument();
  });
});
