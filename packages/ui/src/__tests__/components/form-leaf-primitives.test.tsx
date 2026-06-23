import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import {
  Input,
  Label,
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  RadioGroup,
  RadioGroupItem,
  Slider,
} from "../../index";
import { expectGovernedDataAuthority } from "../helpers/governance-assertions";

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
  describe("Input", () => {
    it("renders with governed data-slot and data-recipe", () => {
      render(<Input aria-label="Email" />);
      const el = screen.getByRole("textbox", { name: "Email" });
      expect(el).toHaveAttribute("data-slot", "input");
      expect(el).toHaveAttribute("data-component", "Input");
      expect(el).toHaveAttribute("data-recipe", "form-control");
    });

    it("keeps governed data attributes authoritative", () => {
      render(
        <Input
          aria-label="Email"
          data-recipe="override"
          data-slot="override"
        />
      );
      const el = screen.getByRole("textbox", { name: "Email" });
      expectGovernedDataAuthority(el, {
        "data-slot": "input",
        "data-recipe": "form-control",
        "data-component": "Input",
      });
    });

    it("forwards aria-invalid for ERP validation states", () => {
      render(<Input aria-invalid="true" aria-label="Amount" />);
      const el = screen.getByRole("textbox", { name: "Amount" });
      expect(el).toHaveAttribute("aria-invalid", "true");
      expect(el.className).toContain("--afenda-form-field-invalid-border");
    });
  });

  describe("Label", () => {
    it("renders with governed data-slot and associates via htmlFor", () => {
      render(
        <>
          <Label htmlFor="name">Name</Label>
          <input id="name" />
        </>
      );
      const el = screen.getByText("Name");
      expect(el).toHaveAttribute("data-slot", "label");
      expect(el).toHaveAttribute("data-component", "Label");
      expect(el).toHaveAttribute("for", "name");
    });

    it("keeps governed data attributes authoritative", () => {
      render(<Label data-slot="override">Name</Label>);
      const el = screen.getByText("Name");
      expect(el).toHaveAttribute("data-slot", "label");
      expect(el).toHaveAttribute("data-component", "Label");
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
