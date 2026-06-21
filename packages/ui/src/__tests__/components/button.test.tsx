import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Button } from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Button governance", () => {
  it("renders with governed recipe classes and default attributes", () => {
    render(
      <Button emphasis="solid" intent="primary" size="md">
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toHaveClass("bg-primary");
    expectGovernedPrimitive(button, {
      component: "Button",
      slot: "button",
      recipe: "button",
      state: "ready",
    });
  });

  it("defaults native button type to button", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "button"
    );
  });

  it("allows explicit submit type", () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit"
    );
  });

  it("forwards ref to the native button element", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Save</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent("Save");
  });

  it("does not allow consumer props to override governed data attributes", () => {
    render(
      <Button
        data-component="Fake"
        data-emphasis="ghost"
        data-intent="danger"
        data-recipe="fake"
        data-size="xl"
        data-state="fake"
        emphasis="solid"
        intent="primary"
        size="md"
      >
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Save" });

    expectGovernedDataAuthority(button, {
      "data-component": "Button",
      "data-recipe": "button",
      "data-state": "ready",
      "data-intent": "primary",
      "data-emphasis": "solid",
      "data-size": "md",
    });
  });

  it("routes allowed layout className through governance", () => {
    render(<Button className="w-full">Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("w-full");
  });

  it("throws on forbidden semantic className in development", () => {
    expect(() =>
      render(<Button className="bg-red-500 text-white shadow-xl">Bad</Button>)
    ).toThrow(/className policy violation/);
  });

  it("supports asChild without losing governed attributes", () => {
    render(
      <Button asChild intent="primary">
        <a href="/dashboard">Dashboard</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: "Dashboard" });

    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveAttribute("data-intent", "primary");
    expectGovernedPrimitive(link, {
      component: "Button",
      slot: "button",
      recipe: "button",
    });
  });

  it("marks asChild disabled content as aria-disabled and removes it from tab order", () => {
    render(
      <Button asChild disabled>
        <a href="/admin/delete">Delete</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: "Delete" });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).not.toHaveAttribute("disabled");
  });

  it("preserves caller aria-disabled on native button", () => {
    render(
      <Button aria-disabled={false} disabled>
        Save
      </Button>
    );

    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "aria-disabled",
      "false"
    );
  });
});
