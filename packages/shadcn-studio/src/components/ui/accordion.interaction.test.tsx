import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

describe("accordion interaction", () => {
  it("expands and collapses panel via trigger button", async () => {
    const user = setupUser();

    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Section title</AccordionTrigger>
          <AccordionContent>Panel body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Section title" });
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText("Panel body")).toBeVisible();

    await user.click(trigger);
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();
  });

  it("applies innerClassName to content inner wrapper", async () => {
    const user = setupUser();

    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent innerClassName="custom-inner-padding">
            Panel body
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    await user.click(screen.getByRole("button", { name: "Section" }));

    const inner = screen.getByText("Panel body");
    expect(inner).toHaveClass("custom-inner-padding");
    expect(inner).toHaveAttribute("data-slot", "accordion-content-inner");
  });

  it("keeps governed data-slot on root when consumer passes data-slot", () => {
    const { container } = render(
      <Accordion data-slot="wrong-slot">
        <AccordionItem>
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(
      container.querySelector('[data-slot="accordion"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="wrong-slot"]')
    ).not.toBeInTheDocument();
  });

  it("keeps governed data-slot on item when consumer passes data-slot", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem data-slot="wrong-item">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(
      container.querySelector('[data-slot="accordion-item"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="wrong-item"]')
    ).not.toBeInTheDocument();
  });
});
