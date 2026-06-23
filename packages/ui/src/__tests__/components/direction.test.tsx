import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DirectionProvider, useDirection } from "../../components/direction";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function DirectionReadout() {
  return <span data-testid="direction-readout">{useDirection()}</span>;
}

describe("Direction governance", () => {
  it("keeps governed data attributes authoritative on the direction root", () => {
    const { container } = render(
      <DirectionProvider
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        dir="rtl"
        state="ready"
      >
        <span>Child</span>
      </DirectionProvider>
    );

    const root = container.querySelector('[data-slot="direction"]');

    expect(root).not.toBeNull();
    expectGovernedDataAuthority(root as HTMLElement, {
      "data-component": "Direction",
      "data-recipe": "surface",
      "data-slot": "direction",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root as HTMLElement, {
      component: "Direction",
      recipe: "surface",
      slot: "direction",
      state: "ready",
    });
  });

  it("applies governed state to the direction root", () => {
    const { container } = render(
      <DirectionProvider dir="ltr" state="loading">
        <span>Child</span>
      </DirectionProvider>
    );

    expect(container.querySelector('[data-slot="direction"]')).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("prefers direction over dir when both are supplied", () => {
    render(
      <DirectionProvider dir="ltr" direction="rtl">
        <DirectionReadout />
      </DirectionProvider>
    );

    expect(screen.getByTestId("direction-readout")).toHaveTextContent("rtl");
  });

  it("exposes useDirection from the active provider scope", () => {
    render(
      <DirectionProvider dir="rtl">
        <DirectionReadout />
      </DirectionProvider>
    );

    expect(screen.getByTestId("direction-readout")).toHaveTextContent("rtl");
  });

  it("scopes nested providers independently", () => {
    render(
      <DirectionProvider dir="ltr">
        <DirectionProvider dir="rtl">
          <DirectionReadout />
        </DirectionProvider>
      </DirectionProvider>
    );

    expect(screen.getByTestId("direction-readout")).toHaveTextContent("rtl");
  });

  it("sets displayName on DirectionProvider", () => {
    expect(DirectionProvider.displayName).toBe("DirectionProvider");
  });
});
