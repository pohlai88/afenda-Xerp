import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../../components/menubar";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function OpenMenubar({
  children,
  menuValue = "file",
  ...props
}: ComponentProps<typeof Menubar> & {
  readonly menuValue?: string;
}) {
  return (
    <Menubar value={menuValue} {...props}>
      <MenubarMenu value={menuValue}>{children}</MenubarMenu>
    </Menubar>
  );
}

describe("Menubar governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(Menubar.displayName).toBe("Menubar");
    expect(MenubarTrigger.displayName).toBe("MenubarTrigger");
    expect(MenubarContent.displayName).toBe("MenubarContent");
    expect(MenubarItem.displayName).toBe("MenubarItem");
    expect(MenubarLabel.displayName).toBe("MenubarLabel");
    expect(MenubarSeparator.displayName).toBe("MenubarSeparator");
    expect(MenubarCheckboxItem.displayName).toBe("MenubarCheckboxItem");
    expect(MenubarSubTrigger.displayName).toBe("MenubarSubTrigger");
    expect(MenubarSubContent.displayName).toBe("MenubarSubContent");
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Menubar
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="menubar-root"
        state="ready"
      >
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );

    expectGovernedDataAuthority(screen.getByTestId("menubar-root"), {
      "data-component": "Menubar",
      "data-recipe": "surface",
      "data-slot": "menubar",
      "data-state": "ready",
    });
  });

  it("applies governed presentation on trigger and rejects consumer overrides", () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger
            data-component="Override"
            data-recipe="override"
            data-slot="override"
          >
            File
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );

    expectGovernedDataAuthority(screen.getByText("File"), {
      "data-component": "Menubar",
      "data-recipe": "surface",
      "data-slot": "menubar-trigger",
    });
  });

  it("renders governed content and item slots when menu is open", () => {
    render(
      <OpenMenubar menuValue="actions">
        <MenubarTrigger>Actions</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarLabel>Invoice</MenubarLabel>
          <MenubarSeparator />
          <MenubarItem data-slot="override">View</MenubarItem>
          <MenubarShortcut>Ctrl+V</MenubarShortcut>
        </MenubarContent>
      </OpenMenubar>
    );

    expect(
      document.querySelector('[data-slot="menubar-content"]')
    ).toBeInTheDocument();
    expect(screen.getByText("View")).toHaveAttribute(
      "data-slot",
      "menubar-item"
    );
    expect(screen.getByText("Invoice")).toHaveAttribute(
      "data-slot",
      "menubar-label"
    );
    expect(
      document.querySelector('[data-slot="menubar-separator"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Ctrl+V")).toHaveAttribute(
      "data-slot",
      "menubar-shortcut"
    );
  });

  it("does not allow consumer data attributes to override governed item attributes", () => {
    render(
      <OpenMenubar menuValue="actions">
        <MenubarTrigger>Actions</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarItem
            data-component="Override"
            data-recipe="override"
            data-slot="override"
            data-state="fake"
          >
            View
          </MenubarItem>
        </MenubarContent>
      </OpenMenubar>
    );

    expectGovernedDataAuthority(screen.getByRole("menuitem", { name: "View" }), {
      "data-component": "Menubar",
      "data-recipe": "surface",
      "data-slot": "menubar-item",
      "data-state": "ready",
    });
  });

  it("emits destructive variant as semantic data attribute on items", () => {
    render(
      <OpenMenubar menuValue="actions">
        <MenubarTrigger>Actions</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarItem variant="destructive">Delete</MenubarItem>
        </MenubarContent>
      </OpenMenubar>
    );

    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute(
      "data-variant",
      "destructive"
    );
  });

  it("applies governed state on root", () => {
    render(
      <Menubar data-testid="menubar-root" state="loading">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByTestId("menubar-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("forwards ref to trigger", () => {
    const triggerRef = createRef<HTMLButtonElement>();

    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger ref={triggerRef}>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expectGovernedPrimitive(triggerRef.current as HTMLElement, {
      component: "Menubar",
      slot: "menubar-trigger",
      recipe: "surface",
    });
  });

  it("renders checkbox item indicator with governed slot", () => {
    render(
      <OpenMenubar menuValue="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarCheckboxItem checked>Employee ID</MenubarCheckboxItem>
        </MenubarContent>
      </OpenMenubar>
    );

    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute(
      "data-slot",
      "menubar-checkbox-item"
    );
  });

  it("renders sub menu trigger with chevron governance", () => {
    render(
      <OpenMenubar menuValue="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarSub open>
            <MenubarSubTrigger>Import</MenubarSubTrigger>
            <MenubarSubContent forceMount>
              <MenubarItem>CSV upload</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </OpenMenubar>
    );

    expect(screen.getByRole("menuitem", { name: "Import" })).toHaveAttribute(
      "data-slot",
      "menubar-sub-trigger"
    );
  });

  it("marks decorative checkbox indicator icons as aria-hidden", () => {
    render(
      <OpenMenubar menuValue="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarCheckboxItem checked>Show grid</MenubarCheckboxItem>
        </MenubarContent>
      </OpenMenubar>
    );

    const indicator = screen
      .getByRole("menuitemcheckbox")
      .querySelector("svg");

    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });
});
