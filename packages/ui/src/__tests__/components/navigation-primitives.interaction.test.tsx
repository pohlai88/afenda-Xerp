import { INTERACTION_TEST_TIMEOUT_MS, setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../index";

describe("navigation primitive interactions", () => {
  vi.setConfig({ testTimeout: INTERACTION_TEST_TIMEOUT_MS });

  it("toggles accordion section visibility on trigger click", async () => {
    const user = setupUser();

    render(
      <Accordion collapsible defaultValue="item-1" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const sectionA = screen.getByRole("button", { name: "Section A" });
    expect(sectionA).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Content A")).toBeVisible();

    await user.click(sectionA);
    expect(sectionA).toHaveAttribute("aria-expanded", "false");

    await user.click(screen.getByRole("button", { name: "Section B" }));
    expect(screen.getByRole("button", { name: "Section B" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("Content B")).toBeVisible();
  });

  it("switches tab panels when another tab trigger is clicked", async () => {
    const user = setupUser();

    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="activity">Activity panel</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Overview panel")).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Activity" }));

    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Activity panel")).toBeVisible();
  });

  it("moves tab selection with ArrowRight keyboard navigation", async () => {
    const user = setupUser();

    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="activity">Activity panel</TabsContent>
        <TabsContent value="audit">Audit panel</TabsContent>
      </Tabs>
    );

    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    overviewTab.focus();

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Activity panel")).toBeVisible();
  });

  it("moves accordion focus with ArrowDown keyboard navigation", async () => {
    const user = setupUser();

    render(
      <Accordion collapsible defaultValue="item-1" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section C</AccordionTrigger>
          <AccordionContent>Content C</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const sectionA = screen.getByRole("button", { name: "Section A" });
    sectionA.focus();

    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("button", { name: "Section B" })).toHaveFocus();

    await user.keyboard("{Home}");

    expect(screen.getByRole("button", { name: "Section A" })).toHaveFocus();
  });
});
