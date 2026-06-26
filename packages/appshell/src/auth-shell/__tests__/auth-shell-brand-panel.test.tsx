import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthShellBrandPanel } from "../auth-shell-brand-panel.js";

describe("AuthShellBrandPanel (v2)", () => {
  it("renders tenant logo and copy when branded props are provided", () => {
    render(
      <AuthShellBrandPanel
        brandColor="#112233"
        headline="Tenant headline"
        logoAlt="Acme logo"
        logoUrl="https://storage.example/logo.png"
        productLabel="Acme ERP"
        supportingText="Tenant supporting copy"
      />
    );

    expect(
      screen.getByRole("img", { name: "Acme logo" }).getAttribute("src")
    ).toBe("https://storage.example/logo.png");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Tenant headline"
    );
    expect(screen.getByText("Tenant supporting copy")).toBeTruthy();
  });

  it("falls back to product label mark when logoUrl is absent", () => {
    render(
      <AuthShellBrandPanel productLabel="Afenda ERP" supportingText="Default" />
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Afenda ERP")).toBeTruthy();
  });
});
