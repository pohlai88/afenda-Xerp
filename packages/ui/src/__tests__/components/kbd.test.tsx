import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Kbd, KbdGroup } from "../../components/kbd";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Kbd governance", () => {
  it("renders native kbd with governed data-slot and recipe", () => {
    render(<Kbd>⌘</Kbd>);

    const key = screen.getByText("⌘");

    expect(key.tagName).toBe("KBD");
    expectGovernedPrimitive(key, {
      component: "Kbd",
      slot: "kbd",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("keeps governed data attributes authoritative on Kbd root", () => {
    render(
      <Kbd
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-testid="kbd-root"
        state="ready"
      >
        K
      </Kbd>
    );

    expectGovernedDataAuthority(screen.getByTestId("kbd-root"), {
      "data-component": "Kbd",
      "data-recipe": "form-control",
      "data-slot": "kbd",
      "data-state": "ready",
    });
  });

  it("applies governed state on Kbd root", () => {
    render(
      <Kbd data-testid="kbd-root" state="loading">
        S
      </Kbd>
    );

    expect(screen.getByTestId("kbd-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("renders KbdGroup with governed group slot", () => {
    render(
      <KbdGroup data-testid="kbd-group" state="ready">
        <Kbd>⌘</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>
    );

    const group = screen.getByTestId("kbd-group");

    expect(group).toHaveAttribute("data-slot", "kbd-group");
    expect(group).toHaveAttribute("data-component", "Kbd");
    expect(group).toHaveAttribute("data-recipe", "form-control");
    expect(group).toHaveAttribute("data-state", "ready");
  });

  it("keeps governed data attributes authoritative on KbdGroup", () => {
    render(
      <KbdGroup
        data-component="Override"
        data-slot="override"
        data-testid="kbd-group"
      >
        <Kbd>⌘</Kbd>
      </KbdGroup>
    );

    expectGovernedDataAuthority(screen.getByTestId("kbd-group"), {
      "data-component": "Kbd",
      "data-recipe": "form-control",
      "data-slot": "kbd-group",
    });
  });

  it("forwards ref to Kbd root", () => {
    const ref = createRef<HTMLElement>();

    render(<Kbd ref={ref}>K</Kbd>);

    expect(ref.current).toHaveAttribute("data-slot", "kbd");
  });

  it("exposes displayName on Kbd parts", () => {
    expect(Kbd.displayName).toBe("Kbd");
    expect(KbdGroup.displayName).toBe("KbdGroup");
  });
});
