import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/navigation-menu";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function OpenNavigationMenu({
  children,
  itemValue = "finance",
  ...props
}: ComponentProps<typeof NavigationMenu> & {
  readonly itemValue?: string;
}) {
  return (
    <NavigationMenu value={itemValue} {...props}>
      <NavigationMenuList>
        <NavigationMenuItem value={itemValue}>{children}</NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(NavigationMenu.displayName).toBe("NavigationMenu");
    expect(NavigationMenuList.displayName).toBe("NavigationMenuList");
    expect(NavigationMenuItem.displayName).toBe("NavigationMenuItem");
    expect(NavigationMenuTrigger.displayName).toBe("NavigationMenuTrigger");
    expect(NavigationMenuContent.displayName).toBe("NavigationMenuContent");
    expect(NavigationMenuLink.displayName).toBe("NavigationMenuLink");
    expect(NavigationMenuIndicator.displayName).toBe("NavigationMenuIndicator");
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <NavigationMenu
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="navigation-menu-root"
        state="ready"
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expectGovernedDataAuthority(screen.getByTestId("navigation-menu-root"), {
      "data-component": "NavigationMenu",
      "data-recipe": "surface",
      "data-slot": "navigation-menu",
      "data-state": "ready",
    });
  });

  it("renders governed list, item, link, and trigger slots", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList data-testid="navigation-menu-list">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
            <NavigationMenuLink href="#">Reports</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByTestId("navigation-menu-list")).toHaveAttribute(
      "data-slot",
      "navigation-menu-list"
    );
    expect(screen.getByText("Modules")).toHaveAttribute(
      "data-slot",
      "navigation-menu-trigger"
    );
    expect(screen.getByRole("link", { name: "Reports" })).toHaveAttribute(
      "data-slot",
      "navigation-menu-link"
    );
  });

  it("does not allow consumer data attributes to override governed link attributes", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              data-component="Override"
              data-recipe="override"
              data-slot="override"
              data-state="fake"
              href="#"
            >
              Reports
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expectGovernedDataAuthority(screen.getByRole("link", { name: "Reports" }), {
      "data-component": "NavigationMenu",
      "data-recipe": "surface",
      "data-slot": "navigation-menu-link",
      "data-state": "ready",
    });
  });

  it("renders content and viewport slots when panel is open", () => {
    render(
      <OpenNavigationMenu itemValue="finance">
        <NavigationMenuTrigger>Finance</NavigationMenuTrigger>
        <NavigationMenuContent forceMount>
          <NavigationMenuLink href="#">Invoices</NavigationMenuLink>
        </NavigationMenuContent>
      </OpenNavigationMenu>
    );

    expect(
      document.querySelector('[data-slot="navigation-menu-content"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="navigation-menu-viewport-wrapper"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="navigation-menu-viewport"]')
    ).toBeInTheDocument();
  });

  it("applies governed state on root", () => {
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

  it("emits viewport flag as semantic data attribute on root", () => {
    render(
      <NavigationMenu data-testid="navigation-menu-root" viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByTestId("navigation-menu-root")).toHaveAttribute(
      "data-viewport",
      "false"
    );
    expect(
      document.querySelector('[data-slot="navigation-menu-viewport"]')
    ).not.toBeInTheDocument();
  });

  it("forwards ref to root", () => {
    const ref = createRef<HTMLElement>();

    render(
      <NavigationMenu ref={ref}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expectGovernedPrimitive(ref.current as HTMLElement, {
      component: "NavigationMenu",
      recipe: "surface",
      slot: "navigation-menu",
    });
  });

  it("marks trigger chevron as aria-hidden", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const chevron = screen
      .getByRole("button", { name: "Modules" })
      .querySelector("svg");

    expect(chevron).toHaveAttribute("aria-hidden", "true");
    expect(chevron).toHaveAttribute(
      "data-slot",
      "navigation-menu-trigger-chevron"
    );
  });

  it("registers NavigationMenuIndicator for governed slot map coverage", () => {
    expect(NavigationMenuIndicator.displayName).toBe("NavigationMenuIndicator");
  });
});
