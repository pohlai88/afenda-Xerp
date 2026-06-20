import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("composite primitive governance", () => {
  it("renders AlertDialogContent with governed overlay slots", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole("alertdialog")).toHaveAttribute(
      "data-slot",
      "alert-dialog-content"
    );
    expect(screen.getByText("Delete item")).toHaveAttribute(
      "data-slot",
      "alert-dialog-title"
    );
    expect(screen.getByText("This action cannot be undone.")).toHaveAttribute(
      "data-slot",
      "alert-dialog-description"
    );
  });

  it("keeps governed data attributes authoritative on AlertDialogContent", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
        >
          Body
        </AlertDialogContent>
      </AlertDialog>
    );

    const content = screen.getByRole("alertdialog");

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
    });
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

  it("renders Avatar with governed slots", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("AB")).toHaveAttribute("data-slot", "avatar-fallback");
    expect(screen.getByText("AB").parentElement).toHaveAttribute("data-slot", "avatar");
  });

  it("keeps governed data attributes authoritative on Avatar", () => {
    render(
      <Avatar data-component="Override" data-recipe="override" data-slot="override">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByText("AB").parentElement;

    expect(avatar).not.toBeNull();
    expectGovernedDataAuthority(avatar as HTMLElement, {
      "data-component": "Avatar",
      "data-recipe": "form-control",
      "data-slot": "avatar",
      "data-state": "ready",
    });
    expectGovernedPrimitive(avatar as HTMLElement, {
      component: "Avatar",
      slot: "avatar",
      recipe: "form-control",
    });
  });

  it("forwards ref to AvatarFallback", () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Avatar>
        <AvatarFallback ref={ref}>AB</AvatarFallback>
      </Avatar>
    );

    expect(ref.current).toBe(screen.getByText("AB"));
  });

  it("renders AvatarGroup and AvatarGroupCount with governed slots", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByText("+3")).toHaveAttribute("data-slot", "avatar-group-count");
    expect(screen.getByText("A").closest("[data-slot='avatar-group']")).not.toBeNull();
  });
});
