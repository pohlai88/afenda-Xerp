import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Accordion governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Accordion
        collapsible
        data-component="Override"
        data-slot="override"
        data-state="fake"
        data-testid="accordion-root"
        defaultValue="item-1"
        type="single"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const root = screen.getByTestId("accordion-root");

    expectGovernedDataAuthority(root, {
      "data-component": "Accordion",
      "data-recipe": "surface",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "Accordion",
      slot: "accordion",
      recipe: "surface",
      state: "ready",
    });
  });

  it("forwards ref to the accordion root element", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Accordion defaultValue="item-1" ref={ref} type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders emitted slot map for item, trigger, header, content, and inner", () => {
    render(
      <Accordion defaultValue="item-1" type="single">
        <AccordionItem data-testid="accordion-item" value="item-1">
          <AccordionTrigger>Question</AccordionTrigger>
          <AccordionContent>Answer</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId("accordion-item")).toHaveAttribute(
      "data-slot",
      "accordion-item"
    );

    const trigger = screen.getByRole("button", { name: "Question" });
    expect(trigger).toHaveAttribute("data-slot", "accordion-trigger");

    const header = trigger.parentElement;
    expect(header).toHaveAttribute("data-slot", "accordion-header");

    expect(
      screen
        .getByText("Answer")
        .closest('[data-slot="accordion-content-inner"]')
    ).toBeTruthy();
    expect(
      screen.getByText("Answer").closest('[data-slot="accordion-content"]')
    ).toBeTruthy();

    const icons = document.querySelectorAll(
      '[data-slot="accordion-trigger-icon"]'
    );
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it("applies governed state to root", () => {
    render(
      <Accordion
        data-testid="accordion-root"
        defaultValue="item-1"
        state="loading"
        type="single"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId("accordion-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("preserves keyboard-operable trigger semantics", () => {
    render(
      <Accordion collapsible defaultValue="item-1" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Keyboard section</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Keyboard section" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toBeEnabled();
  });

  it("preserves disabled item trigger semantics", () => {
    render(
      <Accordion type="single">
        <AccordionItem disabled value="restricted">
          <AccordionTrigger>Restricted</AccordionTrigger>
          <AccordionContent>Hidden</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Restricted" });
    expect(trigger).toBeDisabled();
  });
});
