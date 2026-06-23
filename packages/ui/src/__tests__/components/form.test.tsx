import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/form";
import { Input } from "../../components/input";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Form alias governance", () => {
  it("keeps governed data attributes authoritative on FormItem", () => {
    render(
      <FormItem
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-testid="form-item"
        state="ready"
      >
        Body
      </FormItem>
    );

    const item = screen.getByTestId("form-item");

    expectGovernedDataAuthority(item, {
      "data-component": "Field",
      "data-recipe": "form-control",
      "data-slot": "field",
      "data-state": "ready",
    });
    expect(item).toHaveAttribute("role", "group");
  });

  it("renders Form alias slots with Field governance emissions", () => {
    render(
      <Form data-testid="form-group">
        <FormItem data-testid="form-item">
          <FormLabel htmlFor="alias-email">Work email</FormLabel>
          <FormControl data-testid="form-control">
            <Input id="alias-email" type="email" />
          </FormControl>
          <FormDescription>Used for notifications.</FormDescription>
          <FormMessage errors={[{ message: "Required" }]} />
        </FormItem>
      </Form>
    );

    expect(screen.getByTestId("form-group")).toHaveAttribute(
      "data-slot",
      "field-group"
    );
    expect(screen.getByTestId("form-item")).toHaveAttribute(
      "data-slot",
      "field"
    );
    expect(screen.getByText("Work email")).toHaveAttribute(
      "data-slot",
      "field-label"
    );
    expect(screen.getByTestId("form-control")).toHaveAttribute(
      "data-slot",
      "field-content"
    );
    expect(screen.getByText("Used for notifications.")).toHaveAttribute(
      "data-slot",
      "field-description"
    );
    expect(screen.getByRole("alert")).toHaveAttribute(
      "data-slot",
      "field-error"
    );
  });

  it("pairs FormLabel htmlFor with control id and surfaces FormMessage as alert", () => {
    render(
      <FormItem state="error">
        <FormLabel htmlFor="form-amount">Amount *</FormLabel>
        <FormControl>
          <Input aria-invalid id="form-amount" state="error" type="number" />
        </FormControl>
        <FormMessage errors={[{ message: "Amount is required" }]} />
      </FormItem>
    );

    expect(screen.getByText("Amount *")).toHaveAttribute("for", "form-amount");
    expect(screen.getByRole("spinbutton")).toHaveAttribute("id", "form-amount");
    expect(screen.getByRole("alert")).toHaveTextContent("Amount is required");
  });

  it("forwards refs through FormItem alias", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <FormItem ref={ref}>
        <FormLabel htmlFor="ref-field">Label</FormLabel>
      </FormItem>
    );

    expect(ref.current).toHaveAttribute("data-slot", "field");
  });

  it("applies governed state on FormItem", () => {
    render(
      <FormItem data-testid="form-item" state="loading">
        <FormLabel htmlFor="loading-field">Label</FormLabel>
      </FormItem>
    );

    expect(screen.getByTestId("form-item")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("sets displayName on Form aliases", () => {
    expect(Form.displayName).toBe("FieldGroup");
    expect(FormItem.displayName).toBe("Field");
    expect(FormLabel.displayName).toBe("FieldLabel");
    expect(FormControl.displayName).toBe("FieldContent");
    expect(FormDescription.displayName).toBe("FieldDescription");
    expect(FormMessage.displayName).toBe("FieldError");
  });
});
