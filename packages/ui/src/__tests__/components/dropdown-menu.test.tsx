import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("DropdownMenu governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(DropdownMenu.displayName).toBe("DropdownMenu");
    expect(DropdownMenuTrigger.displayName).toBe("DropdownMenuTrigger");
    expect(DropdownMenuContent.displayName).toBe("DropdownMenuContent");
    expect(DropdownMenuItem.displayName).toBe("DropdownMenuItem");
    expect(DropdownMenuLabel.displayName).toBe("DropdownMenuLabel");
    expect(DropdownMenuSeparator.displayName).toBe("DropdownMenuSeparator");
    expect(DropdownMenuCheckboxItem.displayName).toBe(
      "DropdownMenuCheckboxItem"
    );
    expect(DropdownMenuSubTrigger.displayName).toBe("DropdownMenuSubTrigger");
    expect(DropdownMenuSubContent.displayName).toBe("DropdownMenuSubContent");
  });

  it("applies governed presentation on trigger and rejects consumer overrides", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger
          data-component="Override"
          data-recipe="override"
          data-slot="override"
        >
          Row actions
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>View</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expectGovernedDataAuthority(screen.getByText("Row actions"), {
      "data-component": "DropdownMenu",
      "data-recipe": "surface",
      "data-slot": "dropdown-menu-trigger",
    });
  });

  it("renders governed content and item slots when open", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Row actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Invoice</DropdownMenuLabel>
          <DropdownMenuItem data-slot="override">View</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(
      document.querySelector('[data-slot="dropdown-menu-content"]')
    ).toBeInTheDocument();
    expect(screen.getByText("View")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-item"
    );
    expect(screen.getByText("Invoice")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-label"
    );
  });

  it("does not allow consumer data attributes to override governed item attributes", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Row actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            data-component="Override"
            data-recipe="override"
            data-slot="override"
            data-state="fake"
          >
            View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expectGovernedDataAuthority(
      screen.getByRole("menuitem", { name: "View" }),
      {
        "data-component": "DropdownMenu",
        "data-recipe": "surface",
        "data-slot": "dropdown-menu-item",
        "data-state": "ready",
      }
    );
  });

  it("emits destructive variant as semantic data attribute on items", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Row actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute(
      "data-variant",
      "destructive"
    );
  });

  it("accepts governed state on root without breaking trigger presentation", () => {
    render(
      <DropdownMenu open state="loading">
        <DropdownMenuTrigger>Row actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>View</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Row actions")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-trigger"
    );
  });

  it("forwards ref to trigger", () => {
    const triggerRef = createRef<HTMLButtonElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger ref={triggerRef}>Row actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>View</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expectGovernedPrimitive(triggerRef.current as HTMLElement, {
      component: "DropdownMenu",
      slot: "dropdown-menu-trigger",
      recipe: "surface",
    });
  });

  it("renders checkbox item indicator with governed slot", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Columns</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>
            Employee ID
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-checkbox-item"
    );
  });

  it("renders sub menu trigger with chevron governance", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByRole("menuitem", { name: "Share" })).toHaveAttribute(
      "data-slot",
      "dropdown-menu-sub-trigger"
    );
  });
});
