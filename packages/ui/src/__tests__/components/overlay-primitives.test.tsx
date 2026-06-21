import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("overlay primitive governance", () => {
  it("renders DialogContent with governed overlay slots", () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-slot",
      "dialog-content"
    );
    expect(screen.getByText("Confirm")).toHaveAttribute(
      "data-slot",
      "dialog-title"
    );
    expect(screen.getByText("Are you sure?")).toHaveAttribute(
      "data-slot",
      "dialog-description"
    );
  });

  it("keeps governed data attributes authoritative on DialogContent", () => {
    render(
      <Dialog open>
        <DialogContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          showCloseButton={false}
        >
          Body
        </DialogContent>
      </Dialog>
    );

    const content = screen.getByRole("dialog");

    expectGovernedDataAuthority(content, {
      "data-component": "Dialog",
      "data-recipe": "surface",
      "data-slot": "dialog-content",
      "data-state": "ready",
    });
    expectGovernedPrimitive(content, {
      component: "Dialog",
      slot: "dialog-content",
      recipe: "surface",
    });
  });

  it("forwards ref to DialogTitle", () => {
    const ref = createRef<HTMLHeadingElement>();

    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle ref={ref}>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(ref.current).toBe(screen.getByText("Title"));
  });

  it("renders DialogContent close button on governed wrapper slots", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const closeWrapper = document.querySelector(
      "[data-slot='dialog-close-button']"
    );

    expect(closeWrapper).not.toBeNull();
    expectGovernedPrimitive(closeWrapper as HTMLElement, {
      component: "Dialog",
      slot: "dialog-close-button",
      recipe: "surface",
    });

    const closeLabel = screen.getByText("Close");

    expect(closeLabel).toHaveAttribute("data-slot", "dialog-close-label");
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "data-slot",
      "button"
    );
  });

  it("renders SheetContent close button on governed wrapper slots", () => {
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
  });

  it("hides governed Sheet close button wrapper on mobile sidebar sheets", () => {
    render(
      <Sheet open>
        <SheetContent data-mobile="true" side="left">
          Mobile panel
        </SheetContent>
      </Sheet>
    );

    const content = screen.getByRole("dialog");

    expect(content).toHaveAttribute("data-mobile", "true");
    expect(content.className).toContain(
      "data-[mobile=true]:[&_[data-slot=sheet-close-button]]:hidden"
    );

    const closeWrapper = document.querySelector(
      "[data-slot='sheet-close-button']"
    );

    expect(closeWrapper).not.toBeNull();
  });

  it("keeps governed data attributes authoritative on SheetContent", () => {
    render(
      <Sheet open>
        <SheetContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          showCloseButton={false}
        >
          Body
        </SheetContent>
      </Sheet>
    );

    const content = screen.getByRole("dialog");

    expectGovernedDataAuthority(content, {
      "data-component": "Sheet",
      "data-recipe": "surface",
      "data-slot": "sheet-content",
      "data-state": "ready",
    });
    expectGovernedPrimitive(content, {
      component: "Sheet",
      slot: "sheet-content",
      recipe: "surface",
    });
  });
});
