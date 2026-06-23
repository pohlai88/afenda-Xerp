import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/tabs";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function renderBasicTabs(rootProps: ComponentProps<typeof Tabs> = {}) {
  return render(
    <Tabs defaultValue="overview" {...rootProps}>
      <TabsList aria-label="Workspace views">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="activity">Activity panel</TabsContent>
    </Tabs>
  );
}

describe("Tabs governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(Tabs.displayName).toBe("Tabs");
    expect(TabsList.displayName).toBe("TabsList");
    expect(TabsTrigger.displayName).toBe("TabsTrigger");
    expect(TabsContent.displayName).toBe("TabsContent");
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Tabs
        data-component="Override"
        data-orientation="vertical"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="tabs-root"
        defaultValue="overview"
        orientation="horizontal"
        state="ready"
      >
        <TabsList aria-label="Workspace views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
      </Tabs>
    );

    expectGovernedDataAuthority(screen.getByTestId("tabs-root"), {
      "data-component": "Tabs",
      "data-orientation": "horizontal",
      "data-recipe": "surface",
      "data-slot": "tabs",
      "data-state": "ready",
    });
  });

  it("keeps governed data attributes authoritative on tabs-list", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList
          aria-label="Workspace views"
          data-component="Override"
          data-slot="override"
          data-variant="line"
          variant="default"
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
      </Tabs>
    );

    const list = screen.getByRole("tablist", { name: "Workspace views" });

    expectGovernedDataAuthority(list, {
      "data-component": "Tabs",
      "data-recipe": "surface",
      "data-slot": "tabs-list",
      "data-variant": "default",
    });
  });

  it("keeps governed data attributes authoritative on tabs-trigger and content", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace views">
          <TabsTrigger
            data-component="Override"
            data-slot="override"
            value="overview"
          >
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent
          data-component="Override"
          data-slot="override"
          value="overview"
        >
          Overview panel
        </TabsContent>
      </Tabs>
    );

    expectGovernedDataAuthority(screen.getByRole("tab", { name: "Overview" }), {
      "data-component": "Tabs",
      "data-recipe": "surface",
      "data-slot": "tabs-trigger",
    });

    expectGovernedDataAuthority(screen.getByRole("tabpanel"), {
      "data-component": "Tabs",
      "data-recipe": "surface",
      "data-slot": "tabs-content",
    });
  });

  it("renders governed slot map on all parts", () => {
    renderBasicTabs();

    const tablist = screen.getByRole("tablist", { name: "Workspace views" });
    const tabsRoot = tablist.closest("[data-slot='tabs']");

    expect(tabsRoot).not.toBeNull();
    expectGovernedPrimitive(tabsRoot as HTMLElement, {
      component: "Tabs",
      recipe: "surface",
      slot: "tabs",
    });
    expectGovernedPrimitive(tablist, {
      component: "Tabs",
      recipe: "surface",
      slot: "tabs-list",
    });
    expectGovernedPrimitive(screen.getByRole("tab", { name: "Overview" }), {
      component: "Tabs",
      recipe: "surface",
      slot: "tabs-trigger",
    });
    expectGovernedPrimitive(screen.getByRole("tabpanel"), {
      component: "Tabs",
      recipe: "surface",
      slot: "tabs-content",
    });
  });

  it("applies governed state to root", () => {
    render(
      <Tabs data-testid="tabs-root" defaultValue="overview" state="loading">
        <TabsList aria-label="Workspace views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId("tabs-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("emits line variant on tabs-list", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace views" variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
      </Tabs>
    );

    expect(
      screen.getByRole("tablist", { name: "Workspace views" })
    ).toHaveAttribute("data-variant", "line");
  });

  it("forwards orientation to Radix root for keyboard navigation", () => {
    render(
      <Tabs
        data-testid="tabs-root"
        defaultValue="general"
        orientation="vertical"
      >
        <TabsList aria-label="Settings">
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="general">General panel</TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId("tabs-root")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });

  it("forwards refs to root, list, trigger, and content", () => {
    const rootRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Tabs defaultValue="overview" ref={rootRef}>
        <TabsList aria-label="Workspace views" ref={listRef}>
          <TabsTrigger ref={triggerRef} value="overview">
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent ref={contentRef} value="overview">
          Overview panel
        </TabsContent>
      </Tabs>
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(listRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("preserves tablist accessibility semantics", () => {
    renderBasicTabs();

    expect(
      screen.getByRole("tablist", { name: "Workspace views" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
  });

  it("marks disabled triggers as unavailable", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="locked">
            Locked
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tab", { name: "Locked" })).toBeDisabled();
  });
});
