import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthShellBrandHeader } from "../auth-shell-brand-header.js";

describe("AuthShellBrandHeader (v2)", () => {
  it("renders tenant logo when logoUrl is provided", () => {
    render(
      <AuthShellBrandHeader
        logoAlt="Acme logo"
        logoUrl="https://storage.example/logo.png"
        productLabel="Acme ERP"
      />
    );

    expect(
      screen.getByRole("img", { name: "Acme logo" }).getAttribute("src")
    ).toBe("https://storage.example/logo.png");
  });

  it("falls back to product label when logoUrl is absent", () => {
    render(<AuthShellBrandHeader productLabel="Afenda ERP" />);

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Afenda ERP")).toBeTruthy();
  });
});
