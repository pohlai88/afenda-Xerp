import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("@afenda/testing/react", () => {
  it("exports setupUser with pointer checks disabled for jsdom", async () => {
    const user = setupUser();

    render(
      <button onClick={() => undefined} type="button">
        Activate
      </button>
    );

    const button = screen.getByRole("button", { name: "Activate" });
    await user.click(button);

    expect(button).toBeInTheDocument();
  });
});
