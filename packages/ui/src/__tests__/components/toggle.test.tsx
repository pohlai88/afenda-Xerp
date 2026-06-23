import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Toggle } from "../../components/toggle";
import { getGovernedStates } from "../../governance/state";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Toggle governance", () => {
  it("exposes displayName on Toggle", () => {
    expect(Toggle.displayName).toBe("Toggle");
  });

  it("renders with governed default attributes", () => {
    render(<Toggle aria-label="Bold">B</Toggle>);

    const toggle = screen.getByRole("button", { name: "Bold" });

    expectGovernedPrimitive(toggle, {
      component: "Toggle",
      slot: "toggle",
      recipe: "form-control",
      state: "ready",
    });
    expect(toggle).toHaveAttribute("data-variant", "default");
    expect(toggle).toHaveAttribute("data-size", "default");
  });

  it("keeps governed data attributes authoritative on Toggle root", () => {
    render(
      <Toggle
        aria-label="Bold"
        data-component="Override"
        data-recipe="override"
        data-size="lg"
        data-slot="override"
        data-state="fake"
        data-variant="outline"
        size="sm"
        state="loading"
        variant="default"
      >
        B
      </Toggle>
    );

    expectGovernedDataAuthority(screen.getByRole("button", { name: "Bold" }), {
      "data-component": "Toggle",
      "data-recipe": "form-control",
      "data-size": "sm",
      "data-slot": "toggle",
      "data-state": "loading",
      "data-variant": "default",
    });
  });

  it.each(getGovernedStates())("renders governed state %s on root", (state) => {
    render(
      <Toggle aria-label={`State ${state}`} state={state}>
        B
      </Toggle>
    );

    expect(
      screen.getByRole("button", { name: `State ${state}` })
    ).toHaveAttribute("data-state", state);
  });

  it("forwards ref to the toggle element", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Toggle aria-label="Bold" ref={ref}>
        B
      </Toggle>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("data-slot", "toggle");
  });

  it("preserves pressed accessibility semantics", () => {
    render(
      <Toggle aria-label="Bold active" pressed>
        B
      </Toggle>
    );

    expect(screen.getByRole("button", { name: "Bold active" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("marks disabled toggles as unavailable", () => {
    render(
      <Toggle aria-label="Disabled bold" disabled>
        B
      </Toggle>
    );

    expect(
      screen.getByRole("button", { name: "Disabled bold" })
    ).toBeDisabled();
  });

  it.each([
    ["default", "default"],
    ["outline", "outline"],
  ] as const)("applies variant %s", (variant, expected) => {
    render(
      <Toggle aria-label={`Variant ${variant}`} variant={variant}>
        B
      </Toggle>
    );

    expect(
      screen.getByRole("button", { name: `Variant ${variant}` })
    ).toHaveAttribute("data-variant", expected);
  });

  it.each([
    ["sm", "sm"],
    ["default", "default"],
    ["lg", "lg"],
  ] as const)("applies size %s", (size, expected) => {
    render(
      <Toggle aria-label={`Size ${size}`} size={size}>
        B
      </Toggle>
    );

    expect(
      screen.getByRole("button", { name: `Size ${size}` })
    ).toHaveAttribute("data-size", expected);
  });
});
