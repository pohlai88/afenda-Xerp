import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Toggle } from "./toggle";

describe("toggle interaction", () => {
  it("toggles pressed state via click", async () => {
    const user = setupUser();

    render(<Toggle aria-label="Bold">B</Toggle>);

    const control = screen.getByRole("button", { name: "Bold" });
    expect(control).toHaveAttribute("aria-pressed", "false");

    await user.click(control);
    expect(control).toHaveAttribute("aria-pressed", "true");

    await user.click(control);
    expect(control).toHaveAttribute("aria-pressed", "false");
  });

  it("does not toggle when disabled", async () => {
    const user = setupUser();

    render(
      <Toggle aria-label="Bold" disabled>
        B
      </Toggle>
    );

    const control = screen.getByRole("button", { name: "Bold" });
    expect(control).toBeDisabled();
    expect(control).toHaveAttribute("aria-pressed", "false");

    await user.click(control);
    expect(control).toHaveAttribute("aria-pressed", "false");
  });
});
