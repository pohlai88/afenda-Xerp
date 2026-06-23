import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Separator } from "../../components/separator";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Separator governance", () => {
  it("exposes displayName on Separator", () => {
    expect(Separator.displayName).toBe("Separator");
  });

  it("renders with governed data-slot and recipe", () => {
    render(<Separator data-testid="separator" />);

    expectGovernedPrimitive(screen.getByTestId("separator"), {
      component: "Separator",
      slot: "separator",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("does not allow consumer props to override governed data attributes", () => {
    render(
      <Separator
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="separator"
        state="ready"
      />
    );

    expectGovernedDataAuthority(screen.getByTestId("separator"), {
      "data-component": "Separator",
      "data-recipe": "form-control",
      "data-slot": "separator",
      "data-state": "ready",
    });
  });

  it("forwards ref to the separator element", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Separator ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("defaults decorative to true without separator role", () => {
    render(<Separator data-testid="separator" />);

    expect(screen.getByTestId("separator")).not.toHaveAttribute(
      "role",
      "separator"
    );
  });

  it("exposes separator role when decorative is false", () => {
    render(<Separator data-testid="separator" decorative={false} />);

    expect(screen.getByTestId("separator")).toHaveAttribute(
      "role",
      "separator"
    );
  });

  it("applies vertical orientation via Radix data attributes", () => {
    render(
      <Separator data-testid="separator" orientation="vertical" />
    );

    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });

  it("reflects governed loading state on the root", () => {
    render(<Separator data-testid="separator" state="loading" />);

    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("routes allowed layout className through governance", () => {
    render(<Separator className="w-full" data-testid="separator" />);

    expect(screen.getByTestId("separator")).toHaveClass("w-full");
  });

  it("throws on forbidden semantic className in development", () => {
    expect(() =>
      render(<Separator className="bg-red-500 h-px" data-testid="separator" />)
    ).toThrow(/className policy violation/);
  });
});
