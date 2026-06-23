import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Collapsible governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Collapsible
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-state="fake"
        data-testid="collapsible-root"
        state="ready"
      >
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    const root = screen.getByTestId("collapsible-root");

    expectGovernedDataAuthority(root, {
      "data-component": "Collapsible",
      "data-recipe": "surface",
      "data-slot": "collapsible",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "Collapsible",
      recipe: "surface",
      slot: "collapsible",
      state: "ready",
    });
  });

  it("keeps governed data attributes authoritative on trigger", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-component="Override" data-slot="override">
          Toggle
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });

    expectGovernedDataAuthority(trigger, {
      "data-component": "Collapsible",
      "data-recipe": "surface",
      "data-slot": "collapsible-trigger",
    });
  });

  it("keeps governed data attributes authoritative on content", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent data-slot="override">Content</CollapsibleContent>
      </Collapsible>
    );

    const content = screen
      .getByText("Content")
      .closest("[data-slot='collapsible-content']");

    expect(content).not.toBeNull();
    expectGovernedDataAuthority(content as HTMLElement, {
      "data-component": "Collapsible",
      "data-recipe": "surface",
      "data-slot": "collapsible-content",
    });
  });

  it("applies governed state to root", () => {
    render(
      <Collapsible data-testid="collapsible-root" state="loading">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByTestId("collapsible-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("forwards ref to root, trigger, and content", () => {
    const rootRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Collapsible defaultOpen ref={rootRef}>
        <CollapsibleTrigger ref={triggerRef}>Toggle</CollapsibleTrigger>
        <CollapsibleContent ref={contentRef}>Content</CollapsibleContent>
      </Collapsible>
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("preserves expandable button semantics", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Order details</CollapsibleTrigger>
        <CollapsibleContent>Line items</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Order details" });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Governed `data-state` reflects interaction state (ready), not Radix open/closed.
    expect(trigger).toHaveAttribute("data-state", "ready");
  });

  it("reflects collapsed aria-expanded when closed", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Order details</CollapsibleTrigger>
        <CollapsibleContent>Line items</CollapsibleContent>
      </Collapsible>
    );

    expect(
      screen.getByRole("button", { name: "Order details" })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("exposes displayName on collapsible parts", () => {
    expect(Collapsible.displayName).toBe("Collapsible");
    expect(CollapsibleTrigger.displayName).toBe("CollapsibleTrigger");
    expect(CollapsibleContent.displayName).toBe("CollapsibleContent");
  });
});
