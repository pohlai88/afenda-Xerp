import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("toggle-group interaction", () => {
  it("toggles item pressed state via click", async () => {
    const user = setupUser();

    render(
      <ToggleGroup>
        <ToggleGroupItem aria-label="Bold" value="bold">
          B
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const item = screen.getByRole("button", { name: "Bold" });
    expect(item).toHaveAttribute("aria-pressed", "false");

    await user.click(item);
    expect(item).toHaveAttribute("aria-pressed", "true");

    await user.click(item);
    expect(item).toHaveAttribute("aria-pressed", "false");
  });
});
