import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/dialog";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Dialog governance", () => {
  it("keeps governed data attributes authoritative on DialogContent", () => {
    render(
      <Dialog open>
        <DialogContent
          data-component="Override"
          data-recipe="fake"
          data-slot="override"
          showCloseButton={false}
          state="ready"
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
      recipe: "surface",
      slot: "dialog-content",
      state: "ready",
    });
  });

  it("applies governed state to DialogContent", () => {
    render(
      <Dialog open>
        <DialogContent data-testid="dialog-content" showCloseButton={false} state="loading">
          Body
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("marks decorative close icon as aria-hidden", () => {
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

    const closeButton = screen.getByRole("button", { name: "Close" });
    const icon = closeButton.querySelector("svg");

    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps governed data attributes authoritative on DialogTitle", () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle data-component="Override" data-slot="override">
            Title
          </DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expectGovernedDataAuthority(screen.getByText("Title"), {
      "data-component": "Dialog",
      "data-recipe": "surface",
      "data-slot": "dialog-title",
      "data-state": "ready",
    });
  });

  it("forwards ref to DialogTitle", () => {
    const titleRef = createRef<HTMLHeadingElement>();

    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle ref={titleRef}>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(titleRef.current).toBe(screen.getByText("Title"));
  });

  it("wires aria-labelledby and aria-describedby on DialogContent", () => {
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

    const dialog = screen.getByRole("dialog");
    const titleId = screen.getByText("Confirm").getAttribute("id");
    const descriptionId = screen.getByText("Are you sure?").getAttribute("id");

    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    expect(dialog).toHaveAttribute("aria-labelledby", titleId);
    expect(dialog).toHaveAttribute("aria-describedby", descriptionId);
  });

  it("exposes displayName on dialog parts", () => {
    expect(Dialog.displayName).toBe("Dialog");
    expect(DialogTrigger.displayName).toBe("DialogTrigger");
    expect(DialogContent.displayName).toBe("DialogContent");
    expect(DialogHeader.displayName).toBe("DialogHeader");
    expect(DialogFooter.displayName).toBe("DialogFooter");
    expect(DialogTitle.displayName).toBe("DialogTitle");
    expect(DialogDescription.displayName).toBe("DialogDescription");
  });
});
