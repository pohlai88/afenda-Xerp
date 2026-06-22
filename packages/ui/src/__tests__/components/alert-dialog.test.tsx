import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("AlertDialog governance", () => {
  it("keeps governed data attributes authoritative on AlertDialogContent", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          data-state="fake"
          data-testid="alert-dialog-content"
        >
          Body
        </AlertDialogContent>
      </AlertDialog>
    );

    const content = screen.getByTestId("alert-dialog-content");

    expectGovernedDataAuthority(content, {
      "data-component": "AlertDialog",
      "data-recipe": "surface",
      "data-slot": "alert-dialog-content",
      "data-state": "ready",
    });
    expectGovernedPrimitive(content, {
      component: "AlertDialog",
      slot: "alert-dialog-content",
      recipe: "surface",
      state: "ready",
    });
  });

  it("forwards ref to AlertDialogContent", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <AlertDialog open>
        <AlertDialogContent ref={ref}>Body</AlertDialogContent>
      </AlertDialog>
    );

    expect(ref.current).toBe(screen.getByRole("alertdialog"));
  });

  it("renders emitted slot map for header, title, description, media, and footer actions", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent size="sm">
          <AlertDialogHeader data-testid="alert-dialog-header">
            <AlertDialogMedia data-testid="alert-dialog-media">
              <span aria-hidden="true">!</span>
            </AlertDialogMedia>
            <AlertDialogTitle>Delete item</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction emphasis="solid" intent="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("alert-dialog-header")).toHaveAttribute(
      "data-slot",
      "alert-dialog-header"
    );
    expect(screen.getByTestId("alert-dialog-media")).toHaveAttribute(
      "data-slot",
      "alert-dialog-media"
    );
    expect(screen.getByText("Delete item")).toHaveAttribute(
      "data-slot",
      "alert-dialog-title"
    );
    expect(screen.getByText("This action cannot be undone.")).toHaveAttribute(
      "data-slot",
      "alert-dialog-description"
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute(
      "data-slot",
      "alert-dialog-cancel"
    );
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute(
      "data-slot",
      "alert-dialog-action"
    );
    expect(screen.getByRole("alertdialog")).toHaveAttribute(
      "data-size",
      "sm"
    );
  });

  it("applies governed state to AlertDialogContent", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent data-testid="alert-dialog-content" state="loading">
          Body
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("alert-dialog-content")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("preserves modal alertdialog semantics and title association", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke access?</AlertDialogTitle>
            <AlertDialogDescription>
              Integrations will stop immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAccessibleName("Revoke access?");
    expect(
      screen.getByText("Integrations will stop immediately.")
    ).toBeInTheDocument();
  });

  it("forwards ref to AlertDialogTitle", () => {
    const ref = createRef<HTMLHeadingElement>();

    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle ref={ref}>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(ref.current).toBe(screen.getByText("Title"));
  });
});
