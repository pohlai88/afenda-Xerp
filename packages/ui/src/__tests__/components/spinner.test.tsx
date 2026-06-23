import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Spinner } from "../../components/spinner";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Spinner governance", () => {
  it("exposes displayName on Spinner", () => {
    expect(Spinner.displayName).toBe("Spinner");
  });

  it("renders with governed data-slot and recipe", () => {
    render(<Spinner data-testid="spinner" />);

    expectGovernedPrimitive(screen.getByTestId("spinner"), {
      component: "Spinner",
      slot: "spinner",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("does not allow consumer props to override governed data attributes", () => {
    render(
      <Spinner
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="spinner"
        state="ready"
      />
    );

    expectGovernedDataAuthority(screen.getByTestId("spinner"), {
      "data-component": "Spinner",
      "data-recipe": "form-control",
      "data-slot": "spinner",
      "data-state": "ready",
    });
  });

  it("forwards ref to the spinner svg", () => {
    const ref = createRef<SVGSVGElement>();

    render(<Spinner ref={ref} />);

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current).toHaveAttribute("data-slot", "spinner");
  });

  it("exposes loading status semantics by default", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");

    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(spinner).toHaveAttribute("aria-busy", "true");
  });

  it("allows callers to override aria-label for action-specific feedback", () => {
    render(<Spinner aria-label="Syncing bank transactions" />);

    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Syncing bank transactions"
    );
  });

  it("reflects governed loading state on root", () => {
    render(<Spinner data-testid="spinner" state="loading" />);

    expect(screen.getByTestId("spinner")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("applies governed size variant on root", () => {
    render(<Spinner data-testid="spinner" size="xl" />);

    const spinner = screen.getByTestId("spinner");

    expect(spinner).toHaveAttribute("data-size", "xl");
    expect(spinner).toHaveClass("size-8", "animate-spin");
  });
});
