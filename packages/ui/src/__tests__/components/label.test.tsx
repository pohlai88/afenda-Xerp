import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Input } from "../../components/input";
import { Label } from "../../components/label";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Label governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Label
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-testid="label-root"
        htmlFor="vendor-code"
        state="ready"
      >
        Vendor code
      </Label>
    );

    const label = screen.getByTestId("label-root");

    expectGovernedDataAuthority(label, {
      "data-component": "Label",
      "data-recipe": "form-control",
      "data-slot": "label",
      "data-state": "ready",
    });
    expectGovernedPrimitive(label, {
      component: "Label",
      recipe: "form-control",
      slot: "label",
      state: "ready",
    });
  });

  it("associates with controls via htmlFor and id", () => {
    render(
      <>
        <Label htmlFor="invoice-amount">Invoice amount</Label>
        <Input id="invoice-amount" type="number" />
      </>
    );

    const label = screen.getByText("Invoice amount");
    const input = screen.getByRole("spinbutton");

    expect(label).toHaveAttribute("for", "invoice-amount");
    expect(input).toHaveAttribute("id", "invoice-amount");
  });

  it("applies governed density and size axes", () => {
    render(
      <Label
        data-testid="label-root"
        density="compact"
        htmlFor="compact-field"
        size="sm"
      >
        Compact label
      </Label>
    );

    const label = screen.getByTestId("label-root");

    expect(label).toHaveAttribute("data-density", "compact");
    expect(label).toHaveAttribute("data-size", "sm");
  });

  it("applies governed state on root", () => {
    render(
      <Label data-testid="label-root" htmlFor="loading-field" state="loading">
        Loading label
      </Label>
    );

    expect(screen.getByTestId("label-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("forwards ref to the native label element", () => {
    const ref = createRef<HTMLLabelElement>();

    render(
      <Label htmlFor="vendor-code" ref={ref}>
        Vendor code
      </Label>
    );

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current).toHaveAttribute("data-slot", "label");
  });

  it("sets displayName on Label", () => {
    expect(Label.displayName).toBe("Label");
  });
});
