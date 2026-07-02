import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "../../components-ui/textarea";

describe("textarea interaction", () => {
  it("accepts typed text", async () => {
    const user = setupUser();

    render(<Textarea aria-label="Notes" />);

    const field = screen.getByRole("textbox", { name: "Notes" });
    await user.type(field, "Line one");
    expect(field).toHaveValue("Line one");
  });

  it("does not accept input when disabled", async () => {
    const user = setupUser();

    render(<Textarea aria-label="Notes" disabled />);

    const field = screen.getByRole("textbox", { name: "Notes" });
    expect(field).toBeDisabled();

    await user.type(field, "Line one");
    expect(field).toHaveValue("");
  });

  it("fires onChange when text is entered", async () => {
    const user = setupUser();
    const onChange = vi.fn();

    render(<Textarea aria-label="Notes" onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "Notes" }), "a");
    expect(onChange).toHaveBeenCalled();
  });
});
