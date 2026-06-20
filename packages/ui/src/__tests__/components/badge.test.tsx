import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Badge governance", () => {
  it("renders governed default attributes", () => {
    render(<Badge>Active</Badge>);

    const badge = screen.getByText("Active");

    expect(badge).toHaveAttribute("data-tone", "neutral");
    expect(badge).toHaveAttribute("data-emphasis", "solid");
    expectGovernedPrimitive(badge, {
      component: "Badge",
      slot: "badge",
      recipe: "badge",
      state: "ready",
    });
  });

  it("does not allow consumer data attributes to override governed badge attributes", () => {
    render(
      <Badge tone="success" emphasis="soft" data-component="Fake" data-state="fake" data-tone="danger">
        Active
      </Badge>
    );

    const badge = screen.getByText("Active");

    expect(badge).toHaveAttribute("data-tone", "success");
    expect(badge).toHaveAttribute("data-emphasis", "soft");
    expectGovernedDataAuthority(badge, {
      "data-component": "Badge",
      "data-recipe": "badge",
      "data-state": "ready",
    });
  });

  it("emits optional density and size data attributes when provided", () => {
    render(
      <Badge tone="neutral" emphasis="solid" density="compact" size="sm">
        Count
      </Badge>
    );

    const badge = screen.getByText("Count");

    expect(badge).toHaveAttribute("data-density", "compact");
    expect(badge).toHaveAttribute("data-size", "sm");
    expect(badge).not.toHaveAttribute("data-presentation");
  });

  it("forwards ref to the badge element", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Badge ref={ref}>New</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveTextContent("New");
  });

  it("supports asChild without losing governed attributes", () => {
    render(
      <Badge asChild tone="info">
        <a href="/status">Status</a>
      </Badge>
    );

    const link = screen.getByRole("link", { name: "Status" });

    expect(link).toHaveAttribute("data-tone", "info");
    expectGovernedPrimitive(link, {
      component: "Badge",
      slot: "badge",
      recipe: "badge",
    });
  });

  it("routes allowed layout className through governance", () => {
    render(<Badge className="w-full">Active</Badge>);

    expect(screen.getByText("Active")).toHaveClass("w-full");
  });

  it("throws on forbidden semantic className in development", () => {
    expect(() =>
      render(<Badge className="bg-red-500 text-white">Bad</Badge>)
    ).toThrow(/className policy violation/);
  });
});
