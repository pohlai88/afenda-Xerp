import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShellContextSwitcher } from "../shadcn-studio/blocks/app-shell-context-switcher";

describe("AppShellContextSwitcher", () => {
  it("does not render when only one target is available", () => {
    const { container } = render(
      <AppShellContextSwitcher
        allowedOptions={{
          targets: [
            {
              companySlug: "dev-company",
              label: "Dev Company",
              isSelected: true,
            },
          ],
        }}
        onSelect={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a switch trigger when multiple targets are available", () => {
    render(
      <AppShellContextSwitcher
        allowedOptions={{
          targets: [
            {
              companySlug: "alpha-co",
              label: "Alpha Co",
              isSelected: true,
            },
            {
              companySlug: "beta-co",
              label: "Beta Co",
              isSelected: false,
            },
          ],
        }}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Switch workspace context" })
    ).toBeInTheDocument();
  });
});
