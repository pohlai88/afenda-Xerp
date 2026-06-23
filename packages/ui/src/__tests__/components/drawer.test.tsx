import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/drawer";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Drawer governance", () => {
  it("keeps governed data attributes authoritative on DrawerContent", () => {
    render(
      <Drawer open>
        <DrawerContent
          data-component="Override"
          data-recipe="fake"
          data-slot="override"
          state="ready"
        >
          Body
        </DrawerContent>
      </Drawer>
    );

    const content = screen.getByRole("dialog");

    expectGovernedDataAuthority(content, {
      "data-component": "Drawer",
      "data-recipe": "surface",
      "data-slot": "drawer-content",
      "data-state": "ready",
    });
    expectGovernedPrimitive(content, {
      component: "Drawer",
      recipe: "surface",
      slot: "drawer-content",
      state: "ready",
    });
  });

  it("applies governed state to DrawerContent", () => {
    render(
      <Drawer open>
        <DrawerContent data-testid="drawer-content" state="loading">
          Body
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByTestId("drawer-content")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("renders DrawerContent with governed overlay slots", () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Mobile panel</DrawerTitle>
            <DrawerDescription>Swipe to dismiss</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-slot",
      "drawer-content"
    );
    expect(
      document.querySelector("[data-slot='drawer-handle']")
    ).not.toBeNull();
    expect(
      document.querySelector("[data-slot='drawer-overlay']")
    ).not.toBeNull();
    expect(screen.getByText("Mobile panel")).toHaveAttribute(
      "data-slot",
      "drawer-title"
    );
    expect(screen.getByText("Swipe to dismiss")).toHaveAttribute(
      "data-slot",
      "drawer-description"
    );
  });

  it("keeps governed data attributes authoritative on DrawerTitle", () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle data-component="Override" data-slot="override">
            Title
          </DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    expectGovernedDataAuthority(screen.getByText("Title"), {
      "data-component": "Drawer",
      "data-recipe": "surface",
      "data-slot": "drawer-title",
      "data-state": "ready",
    });
  });

  it("forwards ref to DrawerTitle", () => {
    const titleRef = createRef<HTMLHeadingElement>();

    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle ref={titleRef}>Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    expect(titleRef.current).toBe(screen.getByText("Title"));
  });

  it("wires aria-labelledby and aria-describedby on DrawerContent", () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Confirm</DrawerTitle>
            <DrawerDescription>Are you sure?</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    const dialog = screen.getByRole("dialog");
    const titleId = screen.getByText("Confirm").getAttribute("id");
    const descriptionId = screen.getByText("Are you sure?").getAttribute("id");

    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    expect(dialog).toHaveAttribute("aria-labelledby", titleId);
    expect(dialog).toHaveAttribute("aria-describedby", descriptionId);
  });

  it("exposes displayName on drawer parts", () => {
    expect(Drawer.displayName).toBe("Drawer");
    expect(DrawerTrigger.displayName).toBe("DrawerTrigger");
    expect(DrawerContent.displayName).toBe("DrawerContent");
    expect(DrawerHeader.displayName).toBe("DrawerHeader");
    expect(DrawerFooter.displayName).toBe("DrawerFooter");
    expect(DrawerTitle.displayName).toBe("DrawerTitle");
    expect(DrawerDescription.displayName).toBe("DrawerDescription");
  });
});
