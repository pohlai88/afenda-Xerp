import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("button interaction", () => {
  it("fires click handler when enabled", async () => {
    const user = setupUser();
    let clicked = false;

    render(
      <Button
        onClick={() => {
          clicked = true;
        }}
      >
        Save changes
      </Button>
    );

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(clicked).toBe(true);
  });

  it("does not fire click handler when disabled", async () => {
    const user = setupUser();
    let clicked = false;

    render(
      <Button
        disabled
        onClick={() => {
          clicked = true;
        }}
      >
        Save changes
      </Button>
    );

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(clicked).toBe(false);
  });

  it("activates via keyboard Enter and Space", async () => {
    const user = setupUser();
    let clicks = 0;

    render(
      <Button
        onClick={() => {
          clicks += 1;
        }}
      >
        Confirm
      </Button>
    );

    const button = screen.getByRole("button", { name: "Confirm" });
    button.focus();

    await user.keyboard("{Enter}");
    expect(clicks).toBe(1);

    await user.keyboard(" ");
    expect(clicks).toBe(2);
  });
});
