import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Pagination,
  PaginationContent,
  PaginationItem,
  SidebarInput,
  SidebarProvider,
  SidebarTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../index";

describe("navigation primitive governance", () => {
  describe("Tabs", () => {
    it("renders root with governed data-slot", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList aria-label="My tabs">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      const tabsRoot = screen
        .getByRole("tablist", { name: "My tabs" })
        .closest("[data-slot='tabs']");
      expect(tabsRoot).toHaveAttribute("data-slot", "tabs");
      expect(tabsRoot).toHaveAttribute("data-component", "Tabs");
    });

    it("renders tabs-list slot", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList aria-label="My tabs">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      const list = screen.getByRole("tablist", { name: "My tabs" });
      expect(list).toHaveAttribute("data-slot", "tabs-list");
    });

    it("renders tabs-trigger slot", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList aria-label="My tabs">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      const trigger = screen.getByRole("tab", { name: "Tab 1" });
      expect(trigger).toHaveAttribute("data-slot", "tabs-trigger");
    });

    it("keeps governed data attributes authoritative on tabs-list", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList
            aria-label="My tabs"
            data-component="Override"
            data-slot="override"
          >
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );
      const list = screen.getByRole("tablist", { name: "My tabs" });
      expect(list).toHaveAttribute("data-slot", "tabs-list");
      expect(list).toHaveAttribute("data-component", "Tabs");
    });
  });

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

  describe("Sidebar", () => {
    it("renders SidebarTrigger without layout className policy violations", () => {
      render(
        <SidebarProvider>
          <SidebarTrigger />
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: "Toggle Sidebar" });

      expect(trigger).toHaveAttribute("data-sidebar", "trigger");
      expect(trigger).toHaveAttribute("data-slot", "button");
      expect(trigger).toHaveAttribute("data-component", "Button");
    });

    it("renders SidebarInput without TIP-004 className policy violations", () => {
      render(
        <SidebarProvider>
          <SidebarInput placeholder="Search modules" />
        </SidebarProvider>
      );

      const input = screen.getByPlaceholderText("Search modules");

      expect(input).toHaveAttribute("data-sidebar", "input");
      expect(input).toHaveAttribute("data-slot", "input");
      expect(input).toHaveAttribute("data-component", "Input");
    });
  });
});
