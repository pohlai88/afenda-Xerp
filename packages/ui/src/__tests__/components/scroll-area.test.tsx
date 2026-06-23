import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { ScrollArea, ScrollBar } from "../../components/scroll-area";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function renderOverflowScrollArea() {
  return render(
    <ScrollArea className="h-16 w-48" data-testid="scroll-root">
      <StoryStack>
        {Array.from({ length: 24 }, (_, index) => (
          <div key={`line-${index}`}>Overflow row {index + 1}</div>
        ))}
      </StoryStack>
    </ScrollArea>
  );
}

function StoryStack({ children }: { readonly children: ReactNode }) {
  return <div data-testid="scroll-content">{children}</div>;
}

describe("ScrollArea governance", () => {
  it("exposes displayName on ScrollArea and ScrollBar", () => {
    expect(ScrollArea.displayName).toBe("ScrollArea");
    expect(ScrollBar.displayName).toBe("ScrollBar");
  });

  it("renders root and viewport with governed data-slots", () => {
    render(
      <ScrollArea data-testid="scroll-root">
        <div>Scrollable content</div>
      </ScrollArea>
    );

    const root = screen.getByTestId("scroll-root");

    expectGovernedPrimitive(root, {
      component: "ScrollArea",
      slot: "scroll-area",
      recipe: "form-control",
    });
    expect(
      root.querySelector('[data-slot="scroll-area-viewport"]')
    ).toBeTruthy();
  });

  it("keeps governed data attributes authoritative on viewport", () => {
    render(
      <ScrollArea
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="scroll-root"
        state="ready"
      >
        Content
      </ScrollArea>
    );

    expectGovernedDataAuthority(screen.getByTestId("scroll-root"), {
      "data-component": "ScrollArea",
      "data-recipe": "form-control",
      "data-slot": "scroll-area",
      "data-state": "ready",
    });
  });

  it("keeps governed data attributes authoritative on viewport", () => {
    render(
      <ScrollArea data-testid="scroll-root">
        <div>Content</div>
      </ScrollArea>
    );

    const viewport = screen
      .getByTestId("scroll-root")
      .querySelector('[data-slot="scroll-area-viewport"]');

    expect(viewport).not.toBeNull();
    expectGovernedDataAuthority(viewport as HTMLElement, {
      "data-component": "ScrollArea",
      "data-recipe": "form-control",
      "data-slot": "scroll-area-viewport",
    });
  });

  it("propagates loading state on root", () => {
    render(
      <ScrollArea data-testid="scroll-root" state="loading">
        Content
      </ScrollArea>
    );

    expectGovernedPrimitive(screen.getByTestId("scroll-root"), {
      component: "ScrollArea",
      slot: "scroll-area",
      recipe: "form-control",
      state: "loading",
    });
  });

  it("forwards ref on ScrollArea root", () => {
    const rootRef = createRef<HTMLDivElement>();

    render(
      <ScrollArea className="h-32 w-48" ref={rootRef}>
        <div>Content</div>
      </ScrollArea>
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("mounts scrollable viewport content inside governed ScrollArea", () => {
    renderOverflowScrollArea();

    expect(screen.getByTestId("scroll-root")).toBeTruthy();
    expect(screen.getByTestId("scroll-content")).toBeTruthy();
    expect(screen.getByText("Overflow row 1")).toBeTruthy();
  });
});
