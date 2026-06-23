import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Input } from "../../components/input";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Input governance", () => {
  it("renders with governed data-slot and recipe", () => {
    render(<Input aria-label="Amount" />);

    expectGovernedPrimitive(screen.getByRole("textbox", { name: "Amount" }), {
      component: "Input",
      slot: "input",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("keeps governed data attributes authoritative on Input root", () => {
    render(
      <Input
        aria-label="Amount"
        data-component="Override"
        data-recipe="override"
        data-slot="override"
      />
    );

    expectGovernedDataAuthority(
      screen.getByRole("textbox", { name: "Amount" }),
      {
        "data-component": "Input",
        "data-recipe": "form-control",
        "data-slot": "input",
      }
    );
  });

  it("applies governed state and form-control axes on Input root", () => {
    render(
      <Input
        aria-label="Amount"
        density="compact"
        size="sm"
        state="loading"
      />
    );

    const input = screen.getByRole("textbox", { name: "Amount" });

    expect(input).toHaveAttribute("data-state", "loading");
    expect(input).toHaveAttribute("data-density", "compact");
    expect(input).toHaveAttribute("data-size", "sm");
  });

  it("forwards ref to the native input element", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input aria-label="Amount" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards aria-invalid for ERP error states", () => {
    render(<Input aria-invalid="true" aria-label="Amount" state="error" />);

    const input = screen.getByRole("textbox", { name: "Amount" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-state", "error");
  });

  it("preserves native input type attribute", () => {
    render(<Input aria-label="Email" type="email" />);

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "type",
      "email"
    );
  });

  it("exposes displayName on Input", () => {
    expect(Input.displayName).toBe("Input");
  });
});
