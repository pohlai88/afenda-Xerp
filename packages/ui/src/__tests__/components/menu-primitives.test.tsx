import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  PopoverTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("menu primitive governance", () => {
  it("renders PopoverTitle with governed overlay slot", () => {
    render(<PopoverTitle>Title</PopoverTitle>);

    expect(screen.getByText("Title")).toHaveAttribute("data-slot", "popover-title");
  });

  it("renders DropdownMenuContent with emitted menu slots", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByRole("menu")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-content"
    );
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
      "data-slot",
      "dropdown-menu-item"
    );
  });

  it("keeps governed data attributes authoritative on DropdownMenuContent", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
        >
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const content = screen.getByRole("menu");

    expectGovernedDataAuthority(content, {
      "data-component": "DropdownMenu",
      "data-recipe": "surface",
      "data-slot": "dropdown-menu-content",
      "data-state": "ready",
    });
    expectGovernedPrimitive(content, {
      component: "DropdownMenu",
      slot: "dropdown-menu-content",
      recipe: "surface",
    });
  });

  it("renders SelectTrigger with governed form-control slots", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick fruit" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveAttribute(
      "data-slot",
      "select-trigger"
    );
  });

  it("keeps governed data attributes authoritative on SelectTrigger", () => {
    render(
      <Select>
        <SelectTrigger
          aria-label="Color"
          data-component="Override"
          data-recipe="override"
          data-slot="override"
        >
          <SelectValue placeholder="Pick color" />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: "Color" });

    expectGovernedDataAuthority(trigger, {
      "data-component": "Select",
      "data-recipe": "form-control",
      "data-slot": "select-trigger",
      "data-state": "ready",
    });
  });

  it("exposes listbox semantics for open Select content", () => {
    Element.prototype.scrollIntoView = vi.fn();

    render(
      <Select open>
        <SelectTrigger aria-label="Color">
          <SelectValue placeholder="Pick color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="red">Red</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Red" })).toHaveAttribute(
      "data-slot",
      "select-item"
    );
  });

  it("renders Breadcrumb page with emitted navigation slots", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByLabelText("breadcrumb")).toHaveAttribute(
      "data-slot",
      "breadcrumb"
    );
    expect(screen.getByText("Settings")).toHaveAttribute(
      "data-slot",
      "breadcrumb-page"
    );
  });
});
