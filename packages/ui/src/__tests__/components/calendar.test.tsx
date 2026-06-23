import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Calendar } from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

const STORY_MONTH = new Date(2026, 5, 1);
const STORY_SELECTED = new Date(2026, 5, 21);

function getCalendarRoot(container: HTMLElement) {
  const root = container.querySelector('[data-slot="calendar"]');
  expect(root).toBeInstanceOf(HTMLElement);
  return root as HTMLElement;
}

describe("Calendar governance", () => {
  it("renders root with governed data-slot", () => {
    const { container } = render(
      <Calendar
        defaultMonth={STORY_MONTH}
        mode="single"
        selected={STORY_SELECTED}
      />
    );

    const root = getCalendarRoot(container);
    expectGovernedPrimitive(root, {
      component: "Calendar",
      slot: "calendar",
      recipe: "surface",
    });
  });

  it("keeps governed data attributes authoritative on root", () => {
    const { container } = render(
      <Calendar
        data-component="Override"
        data-slot="override"
        defaultMonth={STORY_MONTH}
        mode="single"
        selected={STORY_SELECTED}
      />
    );

    const root = getCalendarRoot(container);
    expectGovernedDataAuthority(root, {
      "data-component": "Calendar",
      "data-recipe": "surface",
      "data-slot": "calendar",
      "data-state": "ready",
    });
  });

  it("applies governed state to root", () => {
    render(
      <Calendar
        data-testid="calendar-root"
        defaultMonth={STORY_MONTH}
        mode="single"
        selected={STORY_SELECTED}
        state="loading"
      />
    );

    expect(screen.getByTestId("calendar-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("renders day buttons with governed button slot", () => {
    render(
      <Calendar
        defaultMonth={STORY_MONTH}
        mode="single"
        selected={STORY_SELECTED}
      />
    );

    const selectedDay = screen.getByRole("gridcell", { selected: true });
    const dayButton = selectedDay.querySelector("[data-slot='button']");
    expect(dayButton).toBeInTheDocument();
    expect(dayButton).toHaveAttribute("data-component", "Calendar");
  });

  it("forwards ref to calendar root", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Calendar
        defaultMonth={STORY_MONTH}
        mode="single"
        ref={ref}
        selected={STORY_SELECTED}
      />
    );

    expect(ref.current).toHaveAttribute("data-slot", "calendar");
    expect(ref.current).toHaveAttribute("data-component", "Calendar");
  });

  it("preserves calendar grid semantics for keyboard traversal", () => {
    render(
      <Calendar
        defaultMonth={STORY_MONTH}
        mode="single"
        selected={STORY_SELECTED}
      />
    );

    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to the Previous Month" })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Go to the Next Month" })
    ).toBeEnabled();
  });
});
