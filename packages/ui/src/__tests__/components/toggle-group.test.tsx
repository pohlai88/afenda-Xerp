import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupSingleProps,
} from "../../components/toggle-group";
import { getGovernedStates } from "../../governance/state";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function renderSingleToggleGroup(
  rootProps: Partial<ToggleGroupSingleProps> = {}
) {
  return render(
    <ToggleGroup aria-label="View mode" type="single" {...rootProps}>
      <ToggleGroupItem aria-label="List view" value="list">
        List
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Grid view" value="grid">
        Grid
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

describe("ToggleGroup governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(ToggleGroup.displayName).toBe("ToggleGroup");
    expect(ToggleGroupItem.displayName).toBe("ToggleGroupItem");
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <ToggleGroup
        aria-label="View mode"
        data-component="Override"
        data-orientation="vertical"
        data-recipe="override"
        data-size="lg"
        data-slot="override"
        data-spacing={0}
        data-state="fake"
        data-variant="outline"
        orientation="horizontal"
        size="sm"
        spacing={2}
        state="ready"
        type="single"
        variant="default"
      >
        <ToggleGroupItem aria-label="List view" value="list">
          List
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expectGovernedDataAuthority(
      screen.getByRole("radiogroup", { name: "View mode" }),
      {
        "data-component": "ToggleGroup",
        "data-orientation": "horizontal",
        "data-recipe": "form-control",
        "data-size": "sm",
        "data-slot": "toggle-group",
        "data-spacing": "2",
        "data-state": "ready",
        "data-variant": "default",
      }
    );
  });

  it("keeps governed data attributes authoritative on items", () => {
    render(
      <ToggleGroup aria-label="View mode" type="single">
        <ToggleGroupItem
          aria-label="List view"
          data-component="Override"
          data-slot="override"
          value="list"
        >
          List
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expectGovernedDataAuthority(
      screen.getByRole("radio", { name: "List view" }),
      {
        "data-component": "ToggleGroup",
        "data-recipe": "form-control",
        "data-slot": "toggle-group-item",
      }
    );
  });

  it("renders governed slot map on root and items", () => {
    renderSingleToggleGroup({ defaultValue: "list" });

    const group = screen.getByRole("radiogroup", { name: "View mode" });

    expectGovernedPrimitive(group, {
      component: "ToggleGroup",
      recipe: "form-control",
      slot: "toggle-group",
    });
    expectGovernedPrimitive(screen.getByRole("radio", { name: "List view" }), {
      component: "ToggleGroup",
      recipe: "form-control",
      slot: "toggle-group-item",
    });
  });

  it("applies governed state on root", () => {
    renderSingleToggleGroup({ state: "loading" });

    expect(
      screen.getByRole("radiogroup", { name: "View mode" })
    ).toHaveAttribute("data-state", "loading");
  });

  it.each(getGovernedStates())("renders governed state %s on root", (state) => {
    renderSingleToggleGroup({ state });

    expect(
      screen.getByRole("radiogroup", { name: "View mode" })
    ).toHaveAttribute("data-state", state);
  });

  it.each(
    getGovernedStates()
  )("renders governed state %s on items", (state) => {
    render(
      <ToggleGroup aria-label="View mode" defaultValue="list" type="single">
        <ToggleGroupItem aria-label="List view" state={state} value="list">
          List
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByRole("radio", { name: "List view" })).toHaveAttribute(
      "data-state",
      state
    );
  });

  it("inherits variant and size from root context on items", () => {
    render(
      <ToggleGroup
        aria-label="Currency"
        defaultValue="usd"
        size="sm"
        type="single"
        variant="outline"
      >
        <ToggleGroupItem value="usd">USD</ToggleGroupItem>
      </ToggleGroup>
    );

    const item = screen.getByRole("radio", { name: "USD" });

    expect(item).toHaveAttribute("data-variant", "outline");
    expect(item).toHaveAttribute("data-size", "sm");
  });

  it("forwards orientation to Radix root for keyboard traversal", () => {
    render(
      <ToggleGroup
        aria-label="Sections"
        data-testid="toggle-group-root"
        defaultValue="summary"
        orientation="vertical"
        type="single"
        variant="outline"
      >
        <ToggleGroupItem value="summary">Summary</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByTestId("toggle-group-root")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });

  it("forwards refs to root and items", () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();

    render(
      <ToggleGroup aria-label="View mode" ref={rootRef} type="single">
        <ToggleGroupItem aria-label="List view" ref={itemRef} value="list">
          List
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("preserves single-select radiogroup accessibility semantics", () => {
    renderSingleToggleGroup({ defaultValue: "list" });

    expect(screen.getByRole("radio", { name: "List view" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "Grid view" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("preserves multiple-select group accessibility semantics", () => {
    render(
      <ToggleGroup
        aria-label="Formatting"
        defaultValue={["bold"]}
        type="multiple"
      >
        <ToggleGroupItem aria-label="Bold" value="bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Italic" value="italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(
      screen.getByRole("toolbar", { name: "Formatting" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("marks disabled items as unavailable", () => {
    render(
      <ToggleGroup aria-label="View mode" defaultValue="list" type="single">
        <ToggleGroupItem aria-label="List view" value="list">
          List
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Grid view" disabled value="grid">
          Grid
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByRole("radio", { name: "Grid view" })).toBeDisabled();
  });
});
