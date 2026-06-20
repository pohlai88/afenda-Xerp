import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

    expect(screen.getByRole("dialog")).toHaveAttribute("data-slot", "dialog-content");
    expect(screen.getByText("Confirm")).toHaveAttribute("data-slot", "dialog-title");
    expect(screen.getByText("Are you sure?")).toHaveAttribute(
      "data-slot",
      "dialog-description"
    );
  });

  it("keeps governed data attributes authoritative on DialogContent", () => {
    render(
      <Dialog open>
        <DialogContent
          showCloseButton={false}
          data-component="Override"
          data-recipe="override"
          data-slot="override"
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
});
