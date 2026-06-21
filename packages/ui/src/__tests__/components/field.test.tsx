import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../../index";
import { expectGovernedDataAuthority } from "../helpers/governance-assertions";

describe("Field governance", () => {
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

  it("governs FieldSeparator line without raw Tailwind in Field", () => {
    render(
      <Field>
        <FieldSeparator>Or</FieldSeparator>
      </Field>
    );

    const separatorLine = screen
      .getByText("Or")
      .closest("[data-slot=field-separator]");
    expect(
      separatorLine?.querySelector("[data-slot=field-separator-line]")
    ).toBeTruthy();
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
  });

  it("returns null when FieldError has no content or errors", () => {
    const { container } = render(<FieldError />);

    expect(container).toBeEmptyDOMElement();
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
});
