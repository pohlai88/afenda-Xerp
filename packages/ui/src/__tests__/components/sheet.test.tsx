import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../components/sheet";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Sheet governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(Sheet.displayName).toBe("Sheet");
    expect(SheetContent.displayName).toBe("SheetContent");
    expect(SheetTitle.displayName).toBe("SheetTitle");
    expect(SheetDescription.displayName).toBe("SheetDescription");
  });

  it("keeps governed data attributes authoritative on SheetContent", () => {
    render(
      <Sheet open>
        <SheetContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          data-state="fake"
          data-testid="sheet-content"
          showCloseButton={false}
          state="ready"
        >
          Body
        </SheetContent>
      </Sheet>
    );

    expectGovernedDataAuthority(screen.getByTestId("sheet-content"), {
      "data-component": "Sheet",
      "data-recipe": "surface",
      "data-slot": "sheet-content",
      "data-state": "ready",
    });
  });

  it("renders governed overlay slot", () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false}>Body</SheetContent>
      </Sheet>
    );

    const overlay = document.querySelector("[data-slot='sheet-overlay']");

    expect(overlay).not.toBeNull();
    expectGovernedPrimitive(overlay as HTMLElement, {
      component: "Sheet",
      recipe: "surface",
      slot: "sheet-overlay",
    });
  });

  it("renders close button on governed wrapper slots", () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Panel</SheetTitle>
            <SheetDescription>Details</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    const closeWrapper = document.querySelector(
      "[data-slot='sheet-close-button']"
    );

    expect(closeWrapper).not.toBeNull();
    expectGovernedPrimitive(closeWrapper as HTMLElement, {
      component: "Sheet",
      slot: "sheet-close-button",
      recipe: "surface",
    });

    const closeLabel = screen.getByText("Close");

    expect(closeLabel).toHaveAttribute("data-slot", "sheet-close-label");
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "data-slot",
      "button"
    );
    expect(closeWrapper?.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("hides governed close button wrapper on mobile sidebar sheets", () => {
    render(
      <Sheet open>
        <SheetContent data-mobile="true" side="left">
          Mobile panel
        </SheetContent>
      </Sheet>
    );

    const content = screen.getByRole("dialog");

    expect(content).toHaveAttribute("data-mobile", "true");
    expect(content).toHaveAttribute("data-side", "left");
    expect(content.className).toContain(
      "data-[mobile=true]:[&_[data-slot=sheet-close-button]]:hidden"
    );
  });

  it("applies governed state on content root", () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false} state="loading">
          Body
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("wires aria-labelledby and aria-describedby on SheetContent", () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Confirm</SheetTitle>
            <SheetDescription>Are you sure?</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    const content = screen.getByRole("dialog");
    const title = screen.getByText("Confirm");
    const description = screen.getByText("Are you sure?");

    expect(content).toHaveAttribute("aria-labelledby", title.id);
    expect(content).toHaveAttribute("aria-describedby", description.id);
  });

  it("renders governed title and description slots", () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle data-testid="sheet-title">Title</SheetTitle>
            <SheetDescription data-testid="sheet-description">
              Description
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByTestId("sheet-title")).toHaveAttribute(
      "data-slot",
      "sheet-title"
    );
    expect(screen.getByTestId("sheet-description")).toHaveAttribute(
      "data-slot",
      "sheet-description"
    );
  });

  it("forwards ref to SheetContent", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Sheet open>
        <SheetContent ref={ref} showCloseButton={false}>
          Body
        </SheetContent>
      </Sheet>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "sheet-content");
  });
});
