import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/hover-card";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("HoverCard governance", () => {
  it("keeps governed data attributes authoritative on HoverCardContent", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Preview</HoverCardTrigger>
        <HoverCardContent
          data-component="Override"
          data-recipe="fake"
          data-slot="override"
          state="ready"
        >
          Body
        </HoverCardContent>
      </HoverCard>
    );

    const content = document.querySelector(
      "[data-slot='hover-card-content']"
    ) as HTMLElement;

    expect(content).not.toBeNull();
    expectGovernedDataAuthority(content, {
      "data-component": "HoverCard",
      "data-recipe": "surface",
      "data-slot": "hover-card-content",
      "data-state": "ready",
    });
    expectGovernedPrimitive(content, {
      component: "HoverCard",
      recipe: "surface",
      slot: "hover-card-content",
      state: "ready",
    });
  });

  it("applies governed state to HoverCardContent", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Preview</HoverCardTrigger>
        <HoverCardContent data-testid="hover-card-content" state="loading">
          Body
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByTestId("hover-card-content")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("renders HoverCardContent with governed content and trigger slots", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Vendor preview</HoverCardTrigger>
        <HoverCardContent>Acme Supplies Ltd.</HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText("Acme Supplies Ltd.")).toHaveAttribute(
      "data-slot",
      "hover-card-content"
    );
    expect(screen.getByText("Vendor preview")).toHaveAttribute(
      "data-slot",
      "hover-card-trigger"
    );
    expectGovernedPrimitive(screen.getByText("Acme Supplies Ltd."), {
      component: "HoverCard",
      recipe: "surface",
      slot: "hover-card-content",
    });
  });

  it("accepts governed surface variant axes on HoverCardContent", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Preview</HoverCardTrigger>
        <HoverCardContent
          data-testid="hover-card-content"
          density="compact"
          radius="sm"
          shadow="overlay"
        >
          Body
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByTestId("hover-card-content")).toHaveAttribute(
      "data-recipe",
      "surface"
    );
  });

  it("exposes displayName on hover card parts", () => {
    expect(HoverCard.displayName).toBe("HoverCard");
    expect(HoverCardTrigger.displayName).toBe("HoverCardTrigger");
    expect(HoverCardContent.displayName).toBe("HoverCardContent");
  });
});
