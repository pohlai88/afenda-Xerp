import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "../../components/sidebar";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";
import { renderWithSidebar } from "../helpers/render-governed";

describe("Sidebar governance", () => {
  it("renders SidebarProvider root with governed wrapper slot", () => {
    render(
      <SidebarProvider data-testid="sidebar-provider">
        <span>child</span>
      </SidebarProvider>
    );

    expectGovernedPrimitive(screen.getByTestId("sidebar-provider"), {
      component: "Sidebar",
      slot: "sidebar-wrapper",
      recipe: "surface",
      state: "ready",
    });
  });

  it("keeps governed data attributes authoritative on SidebarProvider", () => {
    render(
      <SidebarProvider
        data-component="Override"
        data-slot="override"
        data-testid="sidebar-provider"
        state="loading"
      >
        <span>child</span>
      </SidebarProvider>
    );

    expectGovernedDataAuthority(screen.getByTestId("sidebar-provider"), {
      "data-component": "Sidebar",
      "data-recipe": "surface",
      "data-slot": "sidebar-wrapper",
      "data-state": "loading",
    });
  });

  it("renders SidebarHeader with governed header slot", () => {
    renderWithSidebar(
      <SidebarHeader data-testid="sidebar-header">Modules</SidebarHeader>
    );

    expectGovernedPrimitive(screen.getByTestId("sidebar-header"), {
      component: "Sidebar",
      slot: "sidebar-header",
      recipe: "surface",
    });
    expect(screen.getByTestId("sidebar-header")).toHaveAttribute(
      "data-sidebar",
      "header"
    );
  });

  it("keeps governed data attributes authoritative on SidebarHeader", () => {
    renderWithSidebar(
      <SidebarHeader
        data-component="Override"
        data-slot="override"
        data-testid="sidebar-header"
      >
        Modules
      </SidebarHeader>
    );

    expectGovernedDataAuthority(screen.getByTestId("sidebar-header"), {
      "data-component": "Sidebar",
      "data-recipe": "surface",
      "data-slot": "sidebar-header",
    });
  });

  it("renders SidebarTrigger without passing className to Button", () => {
    renderWithSidebar(<SidebarTrigger data-testid="sidebar-trigger-shell" />);

    const trigger = screen.getByRole("button", { name: "Toggle Sidebar" });

    expect(trigger).toHaveAttribute("data-sidebar", "trigger");
    expect(trigger).toHaveAttribute("data-slot", "button");
    expect(trigger).toHaveAttribute("data-component", "Button");
    expect(screen.getByTestId("sidebar-trigger-shell")).toContainElement(
      trigger
    );
  });

  it("renders SidebarInput with governed shell and inner input", () => {
    renderWithSidebar(<SidebarInput placeholder="Search modules" />);

    const input = screen.getByPlaceholderText("Search modules");

    expect(input).toHaveAttribute("data-sidebar", "input");
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("data-component", "Input");
    expect(input.parentElement).toHaveAttribute("data-slot", "sidebar-input");
  });

  it("wraps SidebarSeparator without passing sidebar classes to Separator", () => {
    renderWithSidebar(<SidebarSeparator data-testid="sidebar-separator" />);

    const wrapper = screen.getByTestId("sidebar-separator");

    expect(wrapper).toHaveAttribute("data-slot", "sidebar-separator");
    expect(wrapper).toHaveAttribute("data-sidebar", "separator");
    expect(
      wrapper.querySelector("[data-slot='separator'][data-component='Separator']")
    ).not.toBeNull();
  });

  it("renders desktop Sidebar body peer with collapse semantics", () => {
    render(
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarContent data-testid="sidebar-content">Nav</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const body = screen
      .getByTestId("sidebar-content")
      .closest("[data-slot='sidebar']");

    expect(body).not.toBeNull();
    if (body === null) {
      throw new Error("Expected sidebar body peer");
    }
    expect(body).toHaveAttribute("data-state", "expanded");
  });

  it("renders SidebarMenuButton with variant slot key", () => {
    renderWithSidebar(
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton data-testid="menu-button" variant="outline">
            Finance
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );

    expect(screen.getByTestId("menu-button")).toHaveAttribute(
      "data-slot",
      "sidebar-menu-button"
    );
    expect(screen.getByTestId("menu-button")).toHaveAttribute(
      "data-sidebar",
      "menu-button"
    );
  });

  it("exposes accessible names on trigger and rail", () => {
    renderWithSidebar(
      <>
        <SidebarTrigger />
        <SidebarRail />
      </>
    );

    const toggles = screen.getAllByRole("button", { name: "Toggle Sidebar" });

    expect(toggles).toHaveLength(2);
    expect(toggles[0]).toHaveAttribute("data-sidebar", "trigger");
    expect(toggles[1]).toHaveAttribute("data-sidebar", "rail");
  });

  it("forwards ref to SidebarInset", () => {
    const ref = createRef<HTMLElement>();

    renderWithSidebar(<SidebarInset ref={ref}>Main</SidebarInset>);

    expect(ref.current).toHaveAttribute("data-slot", "sidebar-inset");
  });

  it("exposes displayName on forwardRef sidebar parts", () => {
    expect(SidebarProvider.displayName).toBe("SidebarProvider");
    expect(SidebarHeader.displayName).toBe("SidebarHeader");
    expect(SidebarInset.displayName).toBe("SidebarInset");
    expect(SidebarInput.displayName).toBe("SidebarInput");
    expect(SidebarSeparator.displayName).toBe("SidebarSeparator");
    expect(SidebarTrigger.displayName).toBe("SidebarTrigger");
  });
});
