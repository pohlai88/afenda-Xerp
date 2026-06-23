import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "../../components/native-select";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("NativeSelect governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(NativeSelect.displayName).toBe("NativeSelect");
    expect(NativeSelectOption.displayName).toBe("NativeSelectOption");
    expect(NativeSelectOptGroup.displayName).toBe("NativeSelectOptGroup");
  });

  it("keeps governed data attributes authoritative on the select control", () => {
    render(
      <NativeSelect
        aria-label="Country"
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        state="ready"
      >
        <NativeSelectOption value="us">US</NativeSelectOption>
      </NativeSelect>
    );

    expectGovernedDataAuthority(
      screen.getByRole("combobox", { name: "Country" }),
      {
        "data-component": "NativeSelect",
        "data-recipe": "form-control",
        "data-slot": "native-select",
        "data-state": "ready",
      }
    );
  });

  it("renders wrapper and control slots with governed presentation", () => {
    render(
      <NativeSelect aria-label="Country">
        <NativeSelectOption value="us">US</NativeSelectOption>
      </NativeSelect>
    );

    const select = screen.getByRole("combobox", { name: "Country" });
    const wrapper = select.parentElement;

    expect(wrapper).toHaveAttribute("data-slot", "native-select-wrapper");
    expect(select).toHaveAttribute("data-slot", "native-select");
    expect(
      wrapper?.querySelector('[data-slot="native-select-icon"]')
    ).toBeInTheDocument();
  });

  it("renders option and optgroup with governed data-slot values", () => {
    render(
      <NativeSelect aria-label="Country">
        <NativeSelectOptGroup data-testid="optgroup" label="Europe">
          <NativeSelectOption data-testid="option" value="fr">
            France
          </NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    );

    expect(screen.getByTestId("optgroup")).toHaveAttribute(
      "data-slot",
      "native-select-optgroup"
    );
    expect(screen.getByTestId("option")).toHaveAttribute(
      "data-slot",
      "native-select-option"
    );
  });

  it("does not allow consumer data attributes to override governed option attributes", () => {
    render(
      <NativeSelect aria-label="Country">
        <NativeSelectOption
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          value="us"
        >
          US
        </NativeSelectOption>
      </NativeSelect>
    );

    expectGovernedDataAuthority(screen.getByRole("option", { name: "US" }), {
      "data-component": "NativeSelect",
      "data-recipe": "form-control",
      "data-slot": "native-select-option",
      "data-state": "ready",
    });
  });

  it("applies governed state on wrapper and control", () => {
    render(
      <NativeSelect aria-label="Country" state="loading">
        <NativeSelectOption value="us">US</NativeSelectOption>
      </NativeSelect>
    );

    const select = screen.getByRole("combobox", { name: "Country" });

    expect(select.parentElement).toHaveAttribute("data-state", "loading");
    expect(select).toHaveAttribute("data-state", "loading");
  });

  it("emits native size axis on wrapper and control", () => {
    render(
      <NativeSelect aria-label="Country" size="sm">
        <NativeSelectOption value="us">US</NativeSelectOption>
      </NativeSelect>
    );

    const select = screen.getByRole("combobox", { name: "Country" });

    expect(select.parentElement).toHaveAttribute("data-size", "sm");
    expect(select).toHaveAttribute("data-size", "sm");
  });

  it("forwards ref to the wrapper element", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <NativeSelect aria-label="Country" ref={ref}>
        <NativeSelectOption value="us">US</NativeSelectOption>
      </NativeSelect>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expectGovernedPrimitive(ref.current as HTMLElement, {
      component: "NativeSelect",
      recipe: "form-control",
      slot: "native-select-wrapper",
    });
  });

  it("marks the chevron icon as aria-hidden", () => {
    render(
      <NativeSelect aria-label="Country">
        <NativeSelectOption value="us">US</NativeSelectOption>
      </NativeSelect>
    );

    const icon = screen
      .getByRole("combobox", { name: "Country" })
      .parentElement?.querySelector("svg");

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("data-slot", "native-select-icon");
  });
});
