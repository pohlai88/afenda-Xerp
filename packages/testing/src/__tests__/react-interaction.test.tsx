import { render, screen } from "@testing-library/react";
import { setupUser } from "@afenda/testing/react";
import { describe, expect, it } from "vitest";

describe("@afenda/testing/react", () => {
  it("exports setupUser with pointer checks disabled for jsdom", async () => {
    const user = setupUser();

    render(
      <button type="button" onClick={() => undefined}>
        Activate
      </button>
    );

    const button = screen.getByRole("button", { name: "Activate" });
    await user.click(button);

    expect(button).toBeInTheDocument();
  });
});
