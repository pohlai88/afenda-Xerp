import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "../../components/skeleton";
import { getGovernedStates } from "../../governance/state";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Skeleton governance", () => {
  it("renders with governed default attributes", () => {
    render(<Skeleton aria-hidden data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");

    expectGovernedPrimitive(skeleton, {
      component: "Skeleton",
      slot: "skeleton",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("keeps governed data attributes authoritative on Skeleton root", () => {
    render(
      <Skeleton
        aria-hidden
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="skeleton"
        state="loading"
      />
    );

    expectGovernedDataAuthority(screen.getByTestId("skeleton"), {
      "data-component": "Skeleton",
      "data-recipe": "form-control",
      "data-slot": "skeleton",
      "data-state": "loading",
    });
  });

  it("applies governed state on Skeleton root", () => {
    render(<Skeleton aria-hidden data-testid="skeleton" state="loading" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it.each(getGovernedStates())("renders governed state %s", (state) => {
    render(<Skeleton aria-hidden data-testid="skeleton" state={state} />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-state", state);
  });

  it("forwards ref to the skeleton element", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Skeleton aria-hidden ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "skeleton");
  });

  it("preserves decorative aria-hidden from caller", () => {
    render(<Skeleton aria-hidden data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("exposes displayName on Skeleton", () => {
    expect(Skeleton.displayName).toBe("Skeleton");
  });
});
