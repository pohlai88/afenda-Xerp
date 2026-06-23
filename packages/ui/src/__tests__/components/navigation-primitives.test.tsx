import { render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("navigation primitive governance", () => {
  describe("Breadcrumb", () => {
    it("renders root with governed data-slot", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("data-slot", "breadcrumb");
      expect(nav).toHaveAttribute("data-component", "Breadcrumb");
    });

    it("renders breadcrumb-list slot", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const list = screen.getByRole("list");
      expect(list).toHaveAttribute("data-slot", "breadcrumb-list");
    });

    it("keeps governed data attributes authoritative on root", () => {
      render(
        <Breadcrumb data-component="Override" data-slot="override">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("data-slot", "breadcrumb");
      expect(nav).toHaveAttribute("data-component", "Breadcrumb");
    });

    it("applies governed state to root", () => {
      render(
        <Breadcrumb data-testid="breadcrumb-root" state="loading">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByTestId("breadcrumb-root")).toHaveAttribute(
        "data-state",
        "loading"
      );
    });

    it("renders breadcrumb-link slot with data authority", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                data-component="Override"
                data-slot="override"
                href="/finance"
              >
                Finance
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const link = screen.getByRole("link", { name: "Finance" });
      expectGovernedPrimitive(link, {
        component: "Breadcrumb",
        slot: "breadcrumb-link",
        recipe: "surface",
      });
    });

    it("renders breadcrumb-page with current-page semantics", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Record</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const page = screen.getByText("Current Record");
      expect(page).toHaveAttribute("data-slot", "breadcrumb-page");
      expect(page).toHaveAttribute("aria-current", "page");
      expect(page).toHaveAttribute("aria-disabled", "true");
    });

    it("renders breadcrumb-separator slot", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator data-testid="breadcrumb-separator" />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const separator = screen.getByTestId("breadcrumb-separator");
      expect(separator).toHaveAttribute("data-slot", "breadcrumb-separator");
      expect(separator).toHaveAttribute("role", "presentation");
      expect(separator).toHaveAttribute("aria-hidden", "true");
    });

    it("renders breadcrumb-ellipsis with screen-reader label", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis data-testid="breadcrumb-ellipsis" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const ellipsis = screen.getByTestId("breadcrumb-ellipsis");
      expect(ellipsis).toHaveAttribute("data-slot", "breadcrumb-ellipsis");
      expect(screen.getByText("More")).toBeInTheDocument();
    });

    it("renders breadcrumb-item slot", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem data-testid="breadcrumb-item">
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByTestId("breadcrumb-item")).toHaveAttribute(
        "data-slot",
        "breadcrumb-item"
      );
    });
  });

  describe("Menubar", () => {
    it("applies governed state to root", () => {
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
  });

  describe("NavigationMenu", () => {
    it("applies governed state to root", () => {
      render(
        <NavigationMenu data-testid="navigation-menu-root" state="loading">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="#">Home</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      );

      expect(screen.getByTestId("navigation-menu-root")).toHaveAttribute(
        "data-state",
        "loading"
      );
    });
  });

  describe("Pagination", () => {
    it("renders root with governed data-slot and role=navigation", () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem />
          </PaginationContent>
        </Pagination>
      );
      const nav = screen.getByRole("navigation", { name: "pagination" });
      expect(nav).toHaveAttribute("data-slot", "pagination");
      expect(nav).toHaveAttribute("data-component", "Pagination");
    });

    it("keeps governed data attributes authoritative on root", () => {
      render(
        <Pagination data-component="Override" data-slot="override">
          <PaginationContent>
            <PaginationItem />
          </PaginationContent>
        </Pagination>
      );
      const nav = screen.getByRole("navigation", { name: "pagination" });
      expect(nav).toHaveAttribute("data-slot", "pagination");
      expect(nav).toHaveAttribute("data-component", "Pagination");
    });

    it("renders PaginationItem as intentional governance passthrough", () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem data-testid="pagination-item" />
          </PaginationContent>
        </Pagination>
      );

      const item = screen.getByTestId("pagination-item");

      expect(item).toHaveAttribute("data-slot", "pagination-item");
      expect(item).not.toHaveAttribute("data-component");
      expect(item).not.toHaveAttribute("data-recipe");
    });

    it("forwards ref and exposes displayName on PaginationLink", () => {
      const ref = createRef<HTMLAnchorElement>();

      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" ref={ref}>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      expect(PaginationLink.displayName).toBe("PaginationLink");
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ref.current).toHaveAttribute("data-slot", "pagination-link");
    });
  });

  describe("Accordion", () => {
    it("renders root with governed data-slot", () => {
      render(
        <Accordion data-testid="accordion-root" type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const root = screen.getByTestId("accordion-root");
      expect(root).toHaveAttribute("data-slot", "accordion");
      expect(root).toHaveAttribute("data-component", "Accordion");
    });

    it("renders accordion-item slot", () => {
      render(
        <Accordion type="single">
          <AccordionItem data-testid="accordion-item" value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const item = screen.getByTestId("accordion-item");
      expect(item).toHaveAttribute("data-slot", "accordion-item");
    });

    it("renders trigger with correct accessibility and governed slot", () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const trigger = screen.getByRole("button", { name: /Question 1/i });
      expect(trigger).toHaveAttribute("data-slot", "accordion-trigger");
    });

    it("keeps governed data attributes authoritative on root", () => {
      render(
        <Accordion
          data-component="Override"
          data-slot="override"
          data-testid="acc"
          type="single"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Q</AccordionTrigger>
            <AccordionContent>A</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const root = screen.getByTestId("acc");
      expect(root).toHaveAttribute("data-slot", "accordion");
      expect(root).toHaveAttribute("data-component", "Accordion");
    });
  });

  describe("Command", () => {
    it("renders CommandInput without TIP-004 className policy violations", () => {
      render(
        <Command>
          <CommandInput
            aria-label="Search commands"
            placeholder="Search commands"
          />
          <CommandList />
        </Command>
      );

      const input = screen.getByPlaceholderText("Search commands");
      const wrapper = input.closest("[data-slot='command-input-wrapper']");
      const inputGroup = input.closest("[data-slot='input-group']");

      expect(wrapper).not.toBeNull();
      expect(inputGroup).not.toBeNull();
      expect(input).toHaveAttribute("data-slot", "command-input");
      expect(
        wrapper?.querySelector("[data-slot='command-search-icon']")
      ).not.toBeNull();

      const addon = inputGroup?.querySelector(
        "[data-slot='input-group-addon']"
      );
      expect(addon).not.toBeNull();
      if (addon === null || inputGroup === null) {
        throw new Error("Expected command input group structure");
      }
      if (!(inputGroup instanceof HTMLElement)) {
        throw new Error("Expected input group to be an HTMLElement");
      }
      expect(inputGroup).toContainElement(input);
      expect(within(inputGroup).getByLabelText("Search commands")).toBe(input);
    });

    it("applies governed state to root", () => {
      render(
        <Command data-testid="command-root" state="loading">
          <CommandList />
        </Command>
      );

      expect(screen.getByTestId("command-root")).toHaveAttribute(
        "data-state",
        "loading"
      );
    });

    it("preserves keyboard-navigable option semantics on CommandItem", () => {
      render(
        <Command>
          <CommandList>
            <CommandItem value="dashboard">Dashboard</CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByRole("option", { name: "Dashboard" });

      expect(item).toHaveAttribute("data-slot", "command-item");
      expect(item).toHaveAttribute("data-component", "Command");
    });

    it("keeps governed data attributes authoritative on Command root", () => {
      render(
        <Command
          data-component="Override"
          data-recipe="override"
          data-slot="override"
        >
          <CommandList />
        </Command>
      );

      const root = document.querySelector("[data-slot='command']");

      expect(root).not.toBeNull();
      expectGovernedDataAuthority(root as HTMLElement, {
        "data-component": "Command",
        "data-recipe": "surface",
        "data-slot": "command",
        "data-state": "ready",
      });
      expectGovernedPrimitive(root as HTMLElement, {
        component: "Command",
        slot: "command",
        recipe: "surface",
      });
    });

    it("keeps governed data attributes authoritative on CommandItem", () => {
      render(
        <Command>
          <CommandList>
            <CommandItem
              data-component="Override"
              data-slot="override"
              value="dashboard"
            >
              Dashboard
            </CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByText("Dashboard");

      expectGovernedDataAuthority(item, {
        "data-component": "Command",
        "data-recipe": "surface",
        "data-slot": "command-item",
        "data-state": "ready",
      });
    });
  });
});
