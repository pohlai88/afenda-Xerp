import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../../components/popover";
import {
  expectGovernedDataAuthority,
} from "../helpers/governance-assertions";

describe("Popover governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(Popover.displayName).toBe("Popover");
    expect(PopoverTrigger.displayName).toBe("PopoverTrigger");
    expect(PopoverContent.displayName).toBe("PopoverContent");
    expect(PopoverHeader.displayName).toBe("PopoverHeader");
    expect(PopoverTitle.displayName).toBe("PopoverTitle");
    expect(PopoverDescription.displayName).toBe("PopoverDescription");
  });

  it("accepts governed state on root without breaking trigger presentation", () => {
    render(
      <Popover open state="loading">
        <PopoverTrigger>Filter rows</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    );

    expectGovernedDataAuthority(screen.getByText("Filter rows"), {
      "data-component": "Popover",
      "data-slot": "popover-trigger",
    });
    expect(screen.getByText("Title").closest('[data-slot="popover-content"]'))
      .toBeTruthy();
  });

  it("rejects consumer data-slot override on Popover root props via trigger/content", () => {
    render(
      <Popover data-component="Override" data-state="fake" open state="ready">
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent data-slot="override">
          <PopoverTitle>Summary</PopoverTitle>
        </PopoverContent>
      </Popover>
    );

    expect(
      document.querySelector('[data-slot="popover-content"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Summary")).toHaveAttribute(
      "data-slot",
      "popover-title"
    );
  });

  it("applies governed presentation on trigger and rejects consumer overrides", () => {
    render(
      <Popover>
        <PopoverTrigger
          data-component="Override"
          data-recipe="override"
          data-slot="override"
        >
          Filter rows
        </PopoverTrigger>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );

    expectGovernedDataAuthority(screen.getByText("Filter rows"), {
      "data-component": "Popover",
      "data-recipe": "surface",
      "data-slot": "popover-trigger",
    });
  });

  it("renders governed content slot when open", () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    );

    expect(
      document.querySelector('[data-slot="popover-content"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Title")).toHaveAttribute(
      "data-slot",
      "popover-title"
    );
  });

  it("keeps governed data attributes authoritative on PopoverContent", () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
        >
          <PopoverDescription>Helper text</PopoverDescription>
        </PopoverContent>
      </Popover>
    );

    const content = document.querySelector('[data-slot="popover-content"]');

    expect(content).toBeTruthy();
    expectGovernedDataAuthority(content as HTMLElement, {
      "data-component": "Popover",
      "data-recipe": "surface",
      "data-slot": "popover-content",
      "data-state": "ready",
    });
    expect(screen.getByText("Helper text")).toHaveAttribute(
      "data-slot",
      "popover-description"
    );
  });

  it("forwards ref on PopoverTrigger and PopoverContent", () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Popover open>
        <PopoverTrigger ref={triggerRef}>Open</PopoverTrigger>
        <PopoverContent ref={contentRef}>
          <PopoverTitle>Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
