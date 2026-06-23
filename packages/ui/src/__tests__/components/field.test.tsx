import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Field governance", () => {
  it("exports displayName on every public slot", () => {
    expect(Field.displayName).toBe("Field");
    expect(FieldSet.displayName).toBe("FieldSet");
    expect(FieldLegend.displayName).toBe("FieldLegend");
    expect(FieldGroup.displayName).toBe("FieldGroup");
    expect(FieldContent.displayName).toBe("FieldContent");
    expect(FieldTitle.displayName).toBe("FieldTitle");
    expect(FieldLabel.displayName).toBe("FieldLabel");
    expect(FieldDescription.displayName).toBe("FieldDescription");
    expect(FieldSeparator.displayName).toBe("FieldSeparator");
    expect(FieldError.displayName).toBe("FieldError");
  });

  it("keeps governed data attributes authoritative on Field root", () => {
    render(
      <Field data-component="Fake" data-state="fake">
        Name
      </Field>
    );

    const field = screen.getByText("Name");

    expectGovernedDataAuthority(field, {
      "data-component": "Field",
      "data-recipe": "form-control",
      "data-state": "ready",
    });
    expect(field).toHaveAttribute("role", "group");
    expect(field).toHaveAttribute("data-slot", "field");
  });

  it("propagates loading state on Field root", () => {
    render(<Field state="loading">Loading field</Field>);

    expectGovernedPrimitive(screen.getByText("Loading field"), {
      component: "Field",
      slot: "field",
      recipe: "form-control",
      state: "loading",
    });
  });

  it("keeps governed data attributes authoritative on FieldLabel", () => {
    render(
      <Field>
        <FieldLabel
          data-component="Override"
          data-slot="override"
          htmlFor="email"
        >
          Email
        </FieldLabel>
      </Field>
    );

    expectGovernedDataAuthority(screen.getByText("Email"), {
      "data-component": "Field",
      "data-slot": "field-label",
    });
  });

  it("emits structural slots for group, content, description, and title", () => {
    render(
      <FieldGroup>
        <FieldTitle>Section</FieldTitle>
        <FieldContent>
          <FieldDescription>Helper text</FieldDescription>
        </FieldContent>
      </FieldGroup>
    );

    expect(screen.getByText("Section")).toHaveAttribute(
      "data-slot",
      "field-label"
    );
    expect(screen.getByText("Helper text")).toHaveAttribute(
      "data-slot",
      "field-description"
    );
    expect(
      screen.getByText("Helper text").closest("[data-slot=field-content]")
    ).toBeTruthy();
    expect(
      screen.getByText("Section").closest("[data-slot=field-group]")
    ).toBeTruthy();
  });

  it("governs FieldSeparator line without raw Tailwind in Field", () => {
    render(
      <Field>
        <FieldSeparator>Or</FieldSeparator>
      </Field>
    );

    const separatorLine = screen
      .getByText("Or")
      .closest("[data-slot=field-separator]")
      ?.querySelector("[data-slot=field-separator-line]");

    expect(separatorLine).toBeTruthy();
    expect(separatorLine?.className).toContain("flex");
    expect(separatorLine?.className).toContain("w-full");
    expect(separatorLine?.className).toContain("items-center");
  });

  it("associates FieldLabel with control via htmlFor and id", () => {
    render(
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <input id="email" type="email" />
      </Field>
    );

    const label = screen.getByText("Email");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", "email");
    expect(input).toHaveAttribute("id", "email");
  });

  it("renders FieldLabel and FieldLegend with correct slot names", () => {
    render(
      <FieldSet>
        <FieldLegend>Section</FieldLegend>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
        </Field>
      </FieldSet>
    );

    expect(screen.getByText("Section")).toHaveAttribute(
      "data-slot",
      "field-legend"
    );
    expect(screen.getByText("Name")).toHaveAttribute(
      "data-slot",
      "field-label"
    );
    expect(screen.getByText("Section").closest("fieldset")).toHaveAttribute(
      "data-slot",
      "field-set"
    );
  });

  it("emits legend variant without letting consumer override governed slots", () => {
    render(
      <FieldSet>
        <FieldLegend data-slot="override" variant="label">
          PO header
        </FieldLegend>
      </FieldSet>
    );

    const legend = screen.getByText("PO header");

    expect(legend).toHaveAttribute("data-field-legend-variant", "label");
    expect(legend).toHaveAttribute("data-slot", "field-legend");
  });

  it("returns null when FieldError has no content or errors", () => {
    const { container } = render(<FieldError />);

    expect(container).toBeEmptyDOMElement();
  });

  it("keeps governed data attributes authoritative on FieldError", () => {
    render(
      <FieldError
        data-component="Override"
        data-slot="override"
        errors={[{ message: "Required" }]}
      />
    );

    expectGovernedDataAuthority(screen.getByRole("alert"), {
      "data-component": "Field",
      "data-slot": "field-error",
    });
  });

  it("renders a single unique error message without a list", () => {
    render(
      <FieldError
        errors={[{ message: "Required" }, { message: "Required" }, undefined]}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("deduplicates FieldError messages as a list when multiple unique errors exist", () => {
    render(
      <FieldError
        errors={[
          { message: "Required" },
          { message: "Required" },
          { message: "Too short" },
        ]}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("list")).toHaveAttribute(
      "data-slot",
      "field-error-list"
    );
  });

  it("forwards ref on FieldError and FieldLabel", () => {
    const errorRef = createRef<HTMLDivElement>();
    const labelRef = createRef<HTMLLabelElement>();

    render(
      <Field>
        <FieldLabel htmlFor="email" ref={labelRef}>
          Email
        </FieldLabel>
        <FieldError errors={[{ message: "Required" }]} ref={errorRef} />
      </Field>
    );

    expect(errorRef.current).toBeInstanceOf(HTMLDivElement);
    expect(labelRef.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("associates FieldLabel htmlFor with control id and propagates aria-invalid", () => {
    render(
      <Field>
        <FieldLabel htmlFor="sku">SKU</FieldLabel>
        <input aria-invalid="true" id="sku" type="text" />
        <FieldError errors={[{ message: "Invalid SKU format" }]} />
      </Field>
    );

    const label = screen.getByText("SKU");
    const control = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", "sku");
    expect(control).toHaveAttribute("id", "sku");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid SKU format");
  });
});
