import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function renderOpenSelect() {
  Element.prototype.scrollIntoView = vi.fn();

  return render(
    <Select open>
      <SelectTrigger aria-label="Department">
        <SelectValue placeholder="Choose department" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Operations</SelectLabel>
          <SelectItem value="engineering">Engineering</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="finance">Finance</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select governance", () => {
  it("exposes displayName on public Select parts", () => {
    expect(Select.displayName).toBe("Select");
    expect(SelectValue.displayName).toBe("SelectValue");
    expect(SelectTrigger.displayName).toBe("SelectTrigger");
    expect(SelectContent.displayName).toBe("SelectContent");
    expect(SelectGroup.displayName).toBe("SelectGroup");
    expect(SelectLabel.displayName).toBe("SelectLabel");
    expect(SelectItem.displayName).toBe("SelectItem");
    expect(SelectSeparator.displayName).toBe("SelectSeparator");
    expect(SelectScrollUpButton.displayName).toBe("SelectScrollUpButton");
    expect(SelectScrollDownButton.displayName).toBe("SelectScrollDownButton");
  });

  it("renders SelectTrigger and SelectValue with governed data-slots", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="Pick status" />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: "Status" });

    expectGovernedPrimitive(trigger, {
      component: "Select",
      slot: "select-trigger",
      recipe: "form-control",
    });
    expect(trigger.querySelector('[data-slot="select-value"]')).toBeTruthy();
  });

  it("keeps governed data attributes authoritative on SelectTrigger", () => {
    render(
      <Select state="ready">
        <SelectTrigger
          aria-label="Priority"
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          data-state="fake"
        >
          <SelectValue placeholder="Pick priority" />
        </SelectTrigger>
      </Select>
    );

    expectGovernedDataAuthority(
      screen.getByRole("combobox", { name: "Priority" }),
      {
        "data-component": "Select",
        "data-recipe": "form-control",
        "data-slot": "select-trigger",
        "data-state": "ready",
      }
    );
  });

  it("exposes listbox semantics and governed item slots when open", () => {
    renderOpenSelect();

    expect(screen.getByRole("listbox")).toHaveAttribute(
      "data-slot",
      "select-content"
    );
    expect(screen.getByRole("option", { name: "Engineering" })).toHaveAttribute(
      "data-slot",
      "select-item"
    );
    expect(
      screen
        .getByRole("option", { name: "Engineering" })
        .querySelector('[data-slot="select-item-indicator"]')
    ).toBeTruthy();
  });

  it("renders governed group, label, and separator slots when open", () => {
    renderOpenSelect();

    expect(
      document.querySelector('[data-slot="select-group"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Operations")).toHaveAttribute(
      "data-slot",
      "select-label"
    );
    expect(
      document.querySelector('[data-slot="select-separator"]')
    ).toBeInTheDocument();
  });

  it("forwards ref to SelectTrigger", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Select>
        <SelectTrigger aria-label="Currency" ref={ref}>
          <SelectValue placeholder="Pick currency" />
        </SelectTrigger>
      </Select>
    );

    expect(ref.current).toBe(
      screen.getByRole("combobox", { name: "Currency" })
    );
  });

  it("marks trigger chevron icons as decorative", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Department">
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
      </Select>
    );

    const triggerChevron = document.querySelector('[data-slot="select-icon"]');

    expect(triggerChevron).toHaveAttribute("aria-hidden", "true");
  });

  it("marks scroll button icons as decorative when mounted", () => {
    Element.prototype.scrollIntoView = vi.fn();

    render(
      <Select open>
        <SelectTrigger aria-label="Long list">
          <SelectValue placeholder="Choose item" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }, (_, index) => (
            <SelectItem key={`item-${index}`} value={`item-${index}`}>
              Item {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

    const scrollUp = document.querySelector(
      '[data-slot="select-scroll-up-button"] svg'
    );
    const scrollDown = document.querySelector(
      '[data-slot="select-scroll-down-button"] svg'
    );

    if (scrollUp) {
      expect(scrollUp).toHaveAttribute("aria-hidden", "true");
    }
    if (scrollDown) {
      expect(scrollDown).toHaveAttribute("aria-hidden", "true");
    }
  });
});
