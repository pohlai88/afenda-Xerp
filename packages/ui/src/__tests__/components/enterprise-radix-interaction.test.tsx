import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Checkbox, Input, Switch } from "../../index";

describe("enterprise Radix interaction contracts", () => {
  describe("controlled and uncontrolled form primitives", () => {
    it("supports uncontrolled Checkbox with defaultChecked", async () => {
      const user = setupUser();

      render(<Checkbox aria-label="Terms" defaultChecked={false} />);

      const checkbox = screen.getByRole("checkbox", { name: "Terms" });
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("supports controlled Checkbox without internal state drift", async () => {
      const user = setupUser();

      function ControlledCheckbox() {
        const [checked, setChecked] = useState(false);

        return (
          <Checkbox
            aria-label="Subscribe"
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          />
        );
      }

      render(<ControlledCheckbox />);

      const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("supports uncontrolled Switch with defaultChecked", async () => {
      const user = setupUser();

      render(<Switch aria-label="Notifications" defaultChecked={false} />);

      const switchControl = screen.getByRole("switch", {
        name: "Notifications",
      });
      expect(switchControl).toHaveAttribute("aria-checked", "false");

      await user.click(switchControl);
      expect(switchControl).toHaveAttribute("aria-checked", "true");
    });

    it("supports controlled Switch", async () => {
      const user = setupUser();

      function ControlledSwitch() {
        const [enabled, setEnabled] = useState(true);

        return (
          <Switch
            aria-label="Dark mode"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        );
      }

      render(<ControlledSwitch />);

      const switchControl = screen.getByRole("switch", { name: "Dark mode" });
      expect(switchControl).toHaveAttribute("aria-checked", "true");

      await user.click(switchControl);
      expect(switchControl).toHaveAttribute("aria-checked", "false");
    });
  });

  describe("validation semantics", () => {
    it("forwards aria-invalid on Input for ERP form error states", () => {
      render(<Input aria-invalid="true" aria-label="Amount" />);

      const input = screen.getByRole("textbox", { name: "Amount" });
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input.className).toContain("--afenda-form-field-invalid-border");
    });
  });
});
