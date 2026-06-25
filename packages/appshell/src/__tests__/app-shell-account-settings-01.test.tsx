import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShellAccountSettings01 } from "../shadcn-studio/blocks/app-shell-account-settings-01";

describe("AppShellAccountSettings01", () => {
  it("renders promoted default sections when slots are not provided", () => {
    const { container } = render(<AppShellAccountSettings01 />);

    expect(
      container.querySelector(".app-shell-studio-account-settings-01")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Personal information" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Email & password" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Connected accounts" })
    ).toBeInTheDocument();
    expect(screen.getByText("Social URLs")).toBeInTheDocument();
    expect(screen.getByText("Danger zone")).toBeInTheDocument();
  });

  it("renders injected personal info slot", () => {
    render(
      <AppShellAccountSettings01
        personalInfoSection={<p>Custom personal info</p>}
      />
    );

    expect(screen.getByText("Custom personal info")).toBeInTheDocument();
  });
});
