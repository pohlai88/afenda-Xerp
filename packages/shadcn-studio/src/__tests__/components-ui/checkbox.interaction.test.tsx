import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "../../components-ui/checkbox";

describe("checkbox interaction", () => {
  it("toggles checked state via click", async () => {
    const user = setupUser();

    render(<Checkbox aria-label="Accept terms" />);

    const control = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(control).not.toBeChecked();

    await user.click(control);
    expect(control).toBeChecked();

    await user.click(control);
    expect(control).not.toBeChecked();
  });

  it("is keyboard reachable via Tab focus", async () => {
    const user = setupUser();

    render(<Checkbox aria-label="Subscribe" />);

    const control = screen.getByRole("checkbox", { name: "Subscribe" });
    await user.tab();
    expect(control).toHaveFocus();
  });

  it("does not toggle when disabled", async () => {
    const user = setupUser();

    render(<Checkbox aria-label="Accept terms" disabled />);

    const control = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(control).toHaveAttribute("aria-disabled", "true");
    expect(control).not.toBeChecked();

    await user.click(control);
    expect(control).not.toBeChecked();
  });

  it("renders indicator slot when checked", async () => {
    const user = setupUser();

    render(<Checkbox aria-label="Accept terms" />);

    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));

    expect(
      document.querySelector('[data-slot="checkbox-indicator"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="checkbox"]')
    ).toBeInTheDocument();
  });

  it("keeps governed data-slot when consumer passes override on root", () => {
    render(<Checkbox aria-label="Accept terms" data-slot="wrong-checkbox" />);

    expect(
      document.querySelector('[data-slot="checkbox"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="wrong-checkbox"]')
    ).not.toBeInTheDocument();
  });
});
