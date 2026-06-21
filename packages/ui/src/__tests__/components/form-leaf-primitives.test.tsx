import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "../../index";

// Radix Slider requires ResizeObserver — polyfill for jsdom
beforeAll(() => {
  if (typeof window.ResizeObserver === "undefined") {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

describe("form-leaf primitive governance", () => {
  describe("Textarea", () => {
    it("renders with governed data-slot and data-recipe", () => {
      render(<Textarea aria-label="Notes" />);
      const el = screen.getByRole("textbox", { name: "Notes" });
      expect(el).toHaveAttribute("data-slot", "textarea");
      expect(el).toHaveAttribute("data-component", "Textarea");
      expect(el).toHaveAttribute("data-recipe", "form-control");
    });

    it("keeps governed data attributes authoritative", () => {
      render(
        <Textarea
          aria-label="Notes"
          data-recipe="override"
          data-slot="override"
        />
      );
      const el = screen.getByRole("textbox", { name: "Notes" });
      expect(el).toHaveAttribute("data-slot", "textarea");
      expect(el).toHaveAttribute("data-recipe", "form-control");
    });
  });

  describe("RadioGroup", () => {
    it("renders root with governed data-slot", () => {
      render(
        <RadioGroup aria-label="Options">
          <RadioGroupItem aria-label="Option A" value="a" />
        </RadioGroup>
      );
      const group = screen.getByRole("radiogroup", { name: "Options" });
      expect(group).toHaveAttribute("data-slot", "radio-group");
      expect(group).toHaveAttribute("data-component", "RadioGroup");
    });

    it("renders item with governed data-slot", () => {
      render(
        <RadioGroup aria-label="Options">
          <RadioGroupItem aria-label="Option A" value="a" />
        </RadioGroup>
      );
      const item = screen.getByRole("radio", { name: "Option A" });
      expect(item).toHaveAttribute("data-slot", "radio-group-item");
    });

    it("keeps governed data attributes authoritative on root", () => {
      render(
        <RadioGroup
          aria-label="Options"
          data-component="Override"
          data-slot="override"
        >
          <RadioGroupItem aria-label="A" value="a" />
        </RadioGroup>
      );
      const group = screen.getByRole("radiogroup", { name: "Options" });
      expect(group).toHaveAttribute("data-slot", "radio-group");
      expect(group).toHaveAttribute("data-component", "RadioGroup");
    });
  });

  describe("Toggle", () => {
    it("renders with governed data-slot", () => {
      render(<Toggle aria-label="Bold">B</Toggle>);
      const el = screen.getByRole("button", { name: "Bold" });
      expect(el).toHaveAttribute("data-slot", "toggle");
      expect(el).toHaveAttribute("data-component", "Toggle");
      expect(el).toHaveAttribute("data-recipe", "form-control");
    });

    it("keeps governed data attributes authoritative", () => {
      render(
        <Toggle aria-label="Bold" data-slot="override">
          B
        </Toggle>
      );
      const el = screen.getByRole("button", { name: "Bold" });
      expect(el).toHaveAttribute("data-slot", "toggle");
    });
  });

  describe("ToggleGroup", () => {
    it("renders root with governed data-slot", () => {
      render(
        <ToggleGroup aria-label="Text align" type="single">
          <ToggleGroupItem aria-label="Left" value="left">
            L
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Right" value="right">
            R
          </ToggleGroupItem>
        </ToggleGroup>
      );
      // Radix ToggleGroup emits role="radiogroup" for type="single"
      const group = screen.getByRole("radiogroup", { name: "Text align" });
      expect(group).toHaveAttribute("data-slot", "toggle-group");
      expect(group).toHaveAttribute("data-component", "ToggleGroup");
    });

    it("renders item with governed data-slot", () => {
      render(
        <ToggleGroup aria-label="Text align" type="single">
          <ToggleGroupItem aria-label="Left" value="left">
            L
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item = screen.getByRole("radio", { name: "Left" });
      expect(item).toHaveAttribute("data-slot", "toggle-group-item");
    });
  });

  describe("NativeSelect", () => {
    it("renders select with governed data-slot", () => {
      render(
        <NativeSelect aria-label="Country">
          <NativeSelectOption value="us">US</NativeSelectOption>
        </NativeSelect>
      );
      const select = screen.getByRole("combobox", { name: "Country" });
      expect(select).toHaveAttribute("data-slot", "native-select");
    });

    it("keeps governed data attributes authoritative on select", () => {
      render(
        <NativeSelect
          aria-label="Country"
          data-component="Override"
          data-slot="override"
        >
          <NativeSelectOption value="us">US</NativeSelectOption>
        </NativeSelect>
      );
      const select = screen.getByRole("combobox", { name: "Country" });
      expect(select).toHaveAttribute("data-slot", "native-select");
      expect(select).toHaveAttribute("data-component", "NativeSelect");
    });

    it("renders optgroup with governed data-slot", () => {
      render(
        <NativeSelect aria-label="Country">
          <NativeSelectOptGroup data-testid="optgroup" label="Europe">
            <NativeSelectOption value="fr">France</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      );
      const optgroup = screen.getByTestId("optgroup");
      expect(optgroup).toHaveAttribute("data-slot", "native-select-optgroup");
      expect(optgroup).toHaveAttribute("data-component", "NativeSelect");
    });
  });

  describe("Slider", () => {
    it("renders root with governed data-slot", () => {
      render(
        <Slider
          aria-label="Volume"
          data-testid="slider-root"
          defaultValue={[50]}
        />
      );
      const sliderRoot = screen.getByTestId("slider-root");
      expect(sliderRoot).toHaveAttribute("data-slot", "slider");
      expect(sliderRoot).toHaveAttribute("data-component", "Slider");
    });

    it("renders thumb with slider-thumb slot", () => {
      render(<Slider aria-label="Volume" defaultValue={[50]} />);
      // Radix Slider root carries aria-label; the thumb span role="slider" has no computed name in jsdom
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("data-slot", "slider-thumb");
    });

    it("keeps governed data attributes authoritative on root", () => {
      render(
        <Slider
          aria-label="Volume"
          data-slot="override"
          data-testid="slider-root"
          defaultValue={[50]}
        />
      );
      const sliderRoot = screen.getByTestId("slider-root");
      expect(sliderRoot).toHaveAttribute("data-slot", "slider");
    });
  });
});
