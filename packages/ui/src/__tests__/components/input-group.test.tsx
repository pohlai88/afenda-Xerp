import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../../components/input-group";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("InputGroup governance", () => {
  it("keeps governed data attributes authoritative on InputGroup root", () => {
    render(
      <InputGroup
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-testid="input-group"
        state="ready"
      >
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );

    expectGovernedDataAuthority(screen.getByTestId("input-group"), {
      "data-component": "InputGroup",
      "data-recipe": "form-control",
      "data-slot": "input-group",
      "data-state": "ready",
    });
    expectGovernedPrimitive(screen.getByTestId("input-group"), {
      component: "InputGroup",
      recipe: "form-control",
      slot: "input-group",
      state: "ready",
    });
  });

  it("applies governed state and form-control axes on InputGroup root", () => {
    render(
      <InputGroup
        data-testid="input-group"
        density="compact"
        size="sm"
        state="loading"
      >
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );

    const root = screen.getByTestId("input-group");

    expect(root).toHaveAttribute("data-state", "loading");
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root).toHaveAttribute("data-size", "sm");
  });

  it("renders InputGroupInput with governed control slot", () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search" />
      </InputGroup>
    );

    const input = screen.getByRole("textbox", { name: "Search" });

    expect(input).toHaveAttribute("data-slot", "input-group-control");
    expect(input).toHaveAttribute("data-component", "InputGroup");
    expect(input).toHaveAttribute("data-recipe", "form-control");
  });

  it("renders addon, text, textarea, and button slots", () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start" data-testid="addon">
          <InputGroupText>PO-</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Purchase order" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Clear">×</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );

    expect(screen.getByTestId("addon")).toHaveAttribute(
      "data-slot",
      "input-group-addon"
    );
    expect(screen.getByTestId("addon")).toHaveAttribute("data-align", "inline-start");
    expect(screen.getByText("PO-")).toHaveAttribute("data-slot", "input-group-text");

    const button = screen.getByRole("button", { name: "Clear" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button.parentElement).toHaveAttribute(
      "data-slot",
      "input-group-button"
    );
    expect(button.parentElement).toHaveAttribute("data-size", "xs");
  });

  it("renders InputGroupTextarea with governed control slot", () => {
    render(
      <InputGroup>
        <InputGroupTextarea aria-label="Comment" />
      </InputGroup>
    );

    expect(screen.getByRole("textbox", { name: "Comment" })).toHaveAttribute(
      "data-slot",
      "input-group-control"
    );
  });

  it("forwards ref to InputGroup root", () => {
    const groupRef = createRef<HTMLDivElement>();

    render(
      <InputGroup ref={groupRef}>
        <InputGroupInput aria-label="Search" />
      </InputGroup>
    );

    expect(groupRef.current).toBe(screen.getByRole("group"));
  });

  it("exposes displayName on input group parts", () => {
    expect(InputGroup.displayName).toBe("InputGroup");
    expect(InputGroupAddon.displayName).toBe("InputGroupAddon");
    expect(InputGroupButton.displayName).toBe("InputGroupButton");
    expect(InputGroupInput.displayName).toBe("InputGroupInput");
    expect(InputGroupText.displayName).toBe("InputGroupText");
    expect(InputGroupTextarea.displayName).toBe("InputGroupTextarea");
  });
});
