import { render, screen } from "@testing-library/react";
import { createRef, useState } from "react";
import { describe, expect, it } from "vitest";

import { setupUser } from "@afenda/testing/react";

import {
  Checkbox,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Category 2 form primitive governance", () => {
  describe("Label", () => {
    it("renders with governed data-slot and associates via htmlFor", () => {
      render(<Label htmlFor="vendor-code">Vendor code</Label>);

      const label = screen.getByText("Vendor code");

      expect(label).toHaveAttribute("for", "vendor-code");
      expectGovernedPrimitive(label, {
        component: "Label",
        slot: "label",
        recipe: "form-control",
      });
    });

    it("forwards ref to the label element", () => {
      const ref = createRef<HTMLLabelElement>();

      render(
        <Label htmlFor="vendor-code" ref={ref}>
          Vendor code
        </Label>
      );

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it("keeps governed data attributes authoritative", () => {
      render(
        <Label data-slot="override" htmlFor="vendor-code">
          Vendor code
        </Label>
      );

      expectGovernedDataAuthority(screen.getByText("Vendor code"), {
        "data-component": "Label",
        "data-slot": "label",
      });
    });
  });

  describe("Checkbox", () => {
    it("forwards ref and keeps governed data attributes authoritative", () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <Checkbox
          aria-label="Accept terms"
          data-component="Override"
          data-slot="override"
          ref={ref}
        />
      );

      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

      expect(ref.current).toBe(checkbox);
      expectGovernedDataAuthority(checkbox, {
        "data-component": "Checkbox",
        "data-recipe": "form-control",
        "data-slot": "checkbox",
        "data-state": "ready",
      });
    });

    it("renders checkbox-indicator slot when checked", () => {
      render(
        <Checkbox aria-label="Subscribe" defaultChecked id="checkbox-indicator" />
      );

      const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
      const indicator = checkbox.querySelector('[data-slot="checkbox-indicator"]');

      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveAttribute("data-component", "Checkbox");
    });

    it("applies governed state to root", () => {
      render(
        <Checkbox
          aria-label="Loading checkbox"
          data-testid="checkbox-root"
          state="loading"
        />
      );

      expect(screen.getByTestId("checkbox-root")).toHaveAttribute(
        "data-state",
        "loading"
      );
    });

    it("preserves indeterminate accessibility semantics", () => {
      render(
        <Checkbox
          aria-label="Partial selection"
          checked="indeterminate"
          id="checkbox-indeterminate"
        />
      );

      expect(screen.getByRole("checkbox", { name: "Partial selection" })).toHaveAttribute(
        "aria-checked",
        "mixed"
      );
    });

    it("preserves invalid state semantics", () => {
      render(
        <Checkbox
          aria-invalid
          aria-label="Required consent"
          id="checkbox-invalid"
          state="error"
        />
      );

      const checkbox = screen.getByRole("checkbox", { name: "Required consent" });
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
      expect(checkbox).toHaveAttribute("data-state", "error");
    });
  });

  describe("RadioGroup", () => {
    it("supports uncontrolled defaultValue", async () => {
      const user = setupUser();

      render(
        <RadioGroup aria-label="Priority" defaultValue="medium">
          <RadioGroupItem aria-label="Low" value="low" />
          <RadioGroupItem aria-label="Medium" value="medium" />
          <RadioGroupItem aria-label="High" value="high" />
        </RadioGroup>
      );

      expect(screen.getByRole("radio", { name: "Medium" })).toBeChecked();

      await user.click(screen.getByRole("radio", { name: "High" }));
      expect(screen.getByRole("radio", { name: "High" })).toBeChecked();
    });

    it("supports controlled value without internal state drift", async () => {
      const user = setupUser();

      function ControlledRadioGroup() {
        const [value, setValue] = useState("draft");

        return (
          <RadioGroup
            aria-label="Status"
            onValueChange={setValue}
            value={value}
          >
            <RadioGroupItem aria-label="Draft" value="draft" />
            <RadioGroupItem aria-label="Published" value="published" />
          </RadioGroup>
        );
      }

      render(<ControlledRadioGroup />);

      expect(screen.getByRole("radio", { name: "Draft" })).toBeChecked();

      await user.click(screen.getByRole("radio", { name: "Published" }));
      expect(screen.getByRole("radio", { name: "Published" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Draft" })).not.toBeChecked();
    });

    it("forwards ref on RadioGroupItem", () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <RadioGroup aria-label="Priority">
          <RadioGroupItem aria-label="Low" ref={ref} value="low" />
        </RadioGroup>
      );

      expect(ref.current).toBe(screen.getByRole("radio", { name: "Low" }));
    });
  });

  describe("Switch", () => {
    it("forwards ref and applies size data attribute", () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <Switch aria-label="Notifications" ref={ref} size="sm" />
      );

      const switchControl = screen.getByRole("switch", {
        name: "Notifications",
      });

      expect(ref.current).toBe(switchControl);
      expect(switchControl).toHaveAttribute("data-size", "sm");
    });
  });

  describe("Field composition", () => {
    it("pairs FieldLabel htmlFor with control id and aria-invalid", () => {
      render(
        <Field>
          <FieldLabel htmlFor="invoice-amount">Invoice amount</FieldLabel>
          <Input
            aria-invalid="true"
            id="invoice-amount"
            state="error"
          />
          <FieldError errors={[{ message: "Amount is required" }]} />
        </Field>
      );

      const label = screen.getByText("Invoice amount");
      const input = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", "invoice-amount");
      expect(input).toHaveAttribute("id", "invoice-amount");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByRole("alert")).toHaveTextContent("Amount is required");
    });
  });

});
