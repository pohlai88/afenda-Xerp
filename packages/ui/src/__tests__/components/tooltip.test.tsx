import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/tooltip";
import { getGovernedStates } from "../../governance/state";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function renderOpenTooltip(
  contentProps: ComponentProps<typeof TooltipContent> = {}
) {
  return render(
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent {...contentProps}>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(Tooltip.displayName).toBe("Tooltip");
    expect(TooltipTrigger.displayName).toBe("TooltipTrigger");
    expect(TooltipContent.displayName).toBe("TooltipContent");
    expect(TooltipProvider.displayName).toBe("TooltipProvider");
  });

  it("renders TooltipContent with governed slots when open", () => {
    renderOpenTooltip();

    const content = document.querySelector("[data-slot='tooltip-content']");

    expect(content).not.toBeNull();
    expect(content).toHaveTextContent("Tooltip text");
    expectGovernedPrimitive(content as HTMLElement, {
      component: "Tooltip",
      slot: "tooltip-content",
      recipe: "surface",
      state: "ready",
    });
    expect(
      document.querySelector("[data-slot='tooltip-arrow']")
    ).not.toBeNull();
  });

  it("keeps governed data attributes authoritative on TooltipContent", () => {
    renderOpenTooltip({
      "data-component": "Override",
      "data-recipe": "override",
      "data-slot": "override",
      "data-state": "fake",
      state: "loading",
    } as ComponentProps<typeof TooltipContent>);

    const content = document.querySelector("[data-slot='tooltip-content']");

    expectGovernedDataAuthority(content as HTMLElement, {
      "data-component": "Tooltip",
      "data-recipe": "surface",
      "data-slot": "tooltip-content",
      "data-state": "loading",
    });
  });

  it.each(
    getGovernedStates()
  )("renders governed state %s on TooltipContent", (state) => {
    renderOpenTooltip({ state });

    expect(
      document.querySelector("[data-slot='tooltip-content']")
    ).toHaveAttribute("data-state", state);
  });

  it("applies governed presentation on trigger and rejects consumer overrides", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger
            data-component="Override"
            data-recipe="override"
            data-slot="override"
          >
            Hover me
          </TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expectGovernedDataAuthority(screen.getByText("Hover me"), {
      "data-component": "Tooltip",
      "data-recipe": "surface",
      "data-slot": "tooltip-trigger",
    });
  });

  it("renders governed arrow slot with decorative semantics", () => {
    renderOpenTooltip();

    const arrow = document.querySelector("[data-slot='tooltip-arrow']");

    expect(arrow).toHaveAttribute("data-component", "Tooltip");
    expect(arrow).toHaveAttribute("data-recipe", "surface");
  });

  it("forwards ref on TooltipTrigger and TooltipContent", () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger ref={triggerRef}>Hover me</TooltipTrigger>
          <TooltipContent ref={contentRef}>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toHaveAttribute("data-slot", "tooltip-trigger");
    expect(contentRef.current).toHaveAttribute("data-slot", "tooltip-content");
  });

  it("preserves tooltip role accessibility semantics when open", () => {
    renderOpenTooltip();

    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
  });
});
