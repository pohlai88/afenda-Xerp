import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "../../components-ui/input";

describe("input interaction", () => {
  it("accepts typed text", async () => {
    const user = setupUser();

    render(<Input aria-label="Email address" type="email" />);

    const field = screen.getByRole("textbox", { name: "Email address" });
    await user.type(field, "ops@afenda.test");
    expect(field).toHaveValue("ops@afenda.test");
  });

  it("does not accept input when disabled", async () => {
    const user = setupUser();

    render(<Input aria-label="Email address" disabled type="email" />);

    const field = screen.getByRole("textbox", { name: "Email address" });
    expect(field).toBeDisabled();

    await user.type(field, "ops@afenda.test");
    expect(field).toHaveValue("");
  });
});
