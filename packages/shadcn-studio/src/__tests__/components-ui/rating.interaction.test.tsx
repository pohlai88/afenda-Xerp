import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Rating } from "../../components-ui/rating";

describe("rating interaction", () => {
  it("updates value via keyboard ArrowRight", async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(<Rating max={5} onValueChange={onValueChange} />);

    const group = screen.getByRole("radiogroup", { name: "Rating" });
    group.focus();

    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it("clears value via keyboard Enter when a star is selected", async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(<Rating defaultValue={3} max={5} onValueChange={onValueChange} />);

    const group = screen.getByRole("radiogroup", { name: "Rating" });
    group.focus();

    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it("does not invoke onValueChange when disabled", async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(<Rating disabled max={5} onValueChange={onValueChange} />);

    const group = screen.getByRole("radiogroup", { name: "Rating" });
    expect(group).not.toHaveAttribute("tabindex", "0");

    await user.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
