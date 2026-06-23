import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { RadioGroup, RadioGroupItem } from "../../components/radio-group";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("RadioGroup governance", () => {
  it("exposes displayName on RadioGroup and RadioGroupItem", () => {
    expect(RadioGroup.displayName).toBe("RadioGroup");
    expect(RadioGroupItem.displayName).toBe("RadioGroupItem");
  });

  it("renders root and item with governed data-slots", () => {
    render(
      <RadioGroup aria-label="Priority">
        <RadioGroupItem aria-label="Medium" value="medium" />
      </RadioGroup>
    );

    expectGovernedPrimitive(screen.getByRole("radiogroup", { name: "Priority" }), {
      component: "RadioGroup",
      slot: "radio-group",
      recipe: "form-control",
    });
    expect(screen.getByRole("radio", { name: "Medium" })).toHaveAttribute(
      "data-slot",
      "radio-group-item"
    );
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <RadioGroup
        aria-label="Priority"
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        state="ready"
      >
        <RadioGroupItem aria-label="Medium" value="medium" />
      </RadioGroup>
    );

    expectGovernedDataAuthority(
      screen.getByRole("radiogroup", { name: "Priority" }),
      {
        "data-component": "RadioGroup",
        "data-recipe": "form-control",
        "data-slot": "radio-group",
        "data-state": "ready",
      }
    );
  });

  it("keeps governed data attributes authoritative on item", () => {
    render(
      <RadioGroup aria-label="Priority">
        <RadioGroupItem
          aria-label="Medium"
          data-component="Override"
          data-slot="override"
          value="medium"
        />
      </RadioGroup>
    );

    expectGovernedDataAuthority(screen.getByRole("radio", { name: "Medium" }), {
      "data-component": "RadioGroup",
      "data-recipe": "form-control",
      "data-slot": "radio-group-item",
    });
  });

  it("renders indicator slots inside checked item", () => {
    render(
      <RadioGroup aria-label="Priority" defaultValue="medium">
        <RadioGroupItem aria-label="Medium" value="medium" />
      </RadioGroup>
    );

    const item = screen.getByRole("radio", { name: "Medium" });

    expect(
      item.querySelector('[data-slot="radio-group-indicator"]')
    ).toBeTruthy();
    expect(
      item.querySelector('[data-slot="radio-group-indicator-dot"]')
    ).toBeTruthy();
  });

  it("propagates loading state on root", () => {
    render(
      <RadioGroup aria-label="Priority" state="loading">
        <RadioGroupItem aria-label="Medium" value="medium" />
      </RadioGroup>
    );

    expectGovernedPrimitive(screen.getByRole("radiogroup", { name: "Priority" }), {
      component: "RadioGroup",
      slot: "radio-group",
      recipe: "form-control",
      state: "loading",
    });
  });

  it("forwards ref on RadioGroup root and RadioGroupItem", () => {
    const groupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();

    render(
      <RadioGroup aria-label="Priority" ref={groupRef}>
        <RadioGroupItem aria-label="Medium" ref={itemRef} value="medium" />
      </RadioGroup>
    );

    expect(groupRef.current).toBe(screen.getByRole("radiogroup", { name: "Priority" }));
    expect(itemRef.current).toBe(screen.getByRole("radio", { name: "Medium" }));
  });

  it("associates item id with label htmlFor for accessibility", () => {
    render(
      <RadioGroup defaultValue="pending">
        <StoryRow>
          <RadioGroupItem id="status-pending" value="pending" />
          <label htmlFor="status-pending">Pending approval</label>
        </StoryRow>
      </RadioGroup>
    );

    expect(screen.getByRole("radio")).toHaveAttribute("id", "status-pending");
    expect(screen.getByText("Pending approval")).toHaveAttribute(
      "for",
      "status-pending"
    );
  });
});

function StoryRow({ children }: { readonly children: ReactNode }) {
  return <div data-testid="story-row">{children}</div>;
}
