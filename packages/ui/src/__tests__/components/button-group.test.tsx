import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("ButtonGroup governance", () => {
  it("renders horizontal root with governed slots and orientation data", () => {
    render(
      <ButtonGroup data-testid="button-group">
        <Button emphasis="outline" intent="secondary" size="sm">
          Left
        </Button>
        <Button emphasis="outline" intent="secondary" size="sm">
          Right
        </Button>
      </ButtonGroup>
    );

    const group = screen.getByTestId("button-group");

    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(group).toHaveAttribute("role", "group");
    expectGovernedPrimitive(group, {
      component: "ButtonGroup",
      slot: "button-group",
      recipe: "surface",
      state: "ready",
    });
  });

  it("renders vertical orientation with governed root slot", () => {
    render(
      <ButtonGroup data-testid="button-group" orientation="vertical">
        <Button emphasis="outline" intent="secondary" size="sm">
          Top
        </Button>
        <Button emphasis="outline" intent="secondary" size="sm">
          Bottom
        </Button>
      </ButtonGroup>
    );

    const group = screen.getByTestId("button-group");

    expect(group).toHaveAttribute("data-orientation", "vertical");
    expectGovernedPrimitive(group, {
      component: "ButtonGroup",
      slot: "button-group",
      recipe: "surface",
    });
  });

  it("does not allow consumer data attributes to override governed root attributes", () => {
    render(
      <ButtonGroup
        data-component="Override"
        data-orientation="override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="button-group"
        orientation="horizontal"
      >
        <Button emphasis="outline" intent="secondary" size="sm">
          Action
        </Button>
      </ButtonGroup>
    );

    const group = screen.getByTestId("button-group");

    expectGovernedDataAuthority(group, {
      "data-component": "ButtonGroup",
      "data-recipe": "surface",
      "data-slot": "button-group",
      "data-state": "ready",
      "data-orientation": "horizontal",
    });
  });

  it("renders ButtonGroupText and ButtonGroupSeparator with governed slots", () => {
    render(
      <ButtonGroup>
        <Button emphasis="outline" intent="secondary" size="sm">
          Edit
        </Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>Qty</ButtonGroupText>
      </ButtonGroup>
    );

    expect(screen.getByText("Qty")).toHaveAttribute(
      "data-slot",
      "button-group-text"
    );
    expect(
      document.querySelector("[data-slot='button-group-separator']")
    ).not.toBeNull();
  });

  it("forwards ref to ButtonGroup root", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ButtonGroup ref={ref}>
        <Button emphasis="outline" intent="secondary" size="sm">
          Save
        </Button>
      </ButtonGroup>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "button-group");
  });

  it("emits governed loading state on root", () => {
    render(
      <ButtonGroup data-testid="button-group" state="loading">
        <Button disabled emphasis="solid" intent="primary" size="sm" state="loading">
          Saving
        </Button>
      </ButtonGroup>
    );

    expect(screen.getByTestId("button-group")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("routes allowed layout className through governance on root", () => {
    render(
      <ButtonGroup className="w-full" data-testid="button-group">
        <Button emphasis="outline" intent="secondary" size="sm">
          Action
        </Button>
      </ButtonGroup>
    );

    expect(screen.getByTestId("button-group")).toHaveClass("w-full");
  });

  it("does not allow consumer data attributes to override ButtonGroupText slot", () => {
    render(
      <ButtonGroup>
        <ButtonGroupText data-slot="override" data-testid="group-text">
          Qty
        </ButtonGroupText>
      </ButtonGroup>
    );

    expect(screen.getByTestId("group-text")).toHaveAttribute(
      "data-slot",
      "button-group-text"
    );
  });

  it("merges separator and group footer governed slots", () => {
    render(
      <ButtonGroup>
        <ButtonGroupSeparator data-testid="group-separator" />
      </ButtonGroup>
    );

    const separator = screen.getByTestId("group-separator");

    expect(separator).toHaveAttribute("data-slot", "button-group-separator");
    expect(separator).toHaveAttribute("data-component", "ButtonGroup");
  });
});
