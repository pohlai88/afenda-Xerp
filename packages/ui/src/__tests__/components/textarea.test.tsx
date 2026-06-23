import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Textarea } from "../../components/textarea";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Textarea governance", () => {
  it("exposes displayName on Textarea", () => {
    expect(Textarea.displayName).toBe("Textarea");
  });

  it("renders with governed data-slot and recipe", () => {
    render(<Textarea aria-label="Notes" />);

    expectGovernedPrimitive(screen.getByRole("textbox", { name: "Notes" }), {
      component: "Textarea",
      slot: "textarea",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("keeps governed data attributes authoritative on Textarea root", () => {
    render(
      <Textarea
        aria-label="Notes"
        data-component="Override"
        data-density="compact"
        data-recipe="override"
        data-size="lg"
        data-slot="override"
        data-state="fake"
        density="standard"
        size="md"
        state="ready"
      />
    );

    expectGovernedDataAuthority(screen.getByRole("textbox", { name: "Notes" }), {
      "data-component": "Textarea",
      "data-density": "standard",
      "data-recipe": "form-control",
      "data-size": "md",
      "data-slot": "textarea",
      "data-state": "ready",
    });
  });

  it("applies governed state and form-control axes on Textarea root", () => {
    render(
      <Textarea
        aria-label="Notes"
        density="compact"
        size="sm"
        state="loading"
      />
    );

    const textarea = screen.getByRole("textbox", { name: "Notes" });

    expect(textarea).toHaveAttribute("data-state", "loading");
    expect(textarea).toHaveAttribute("data-density", "compact");
    expect(textarea).toHaveAttribute("data-size", "sm");
  });

  it("forwards ref to the native textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<Textarea aria-label="Notes" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Notes" }));
  });

  it("forwards aria-invalid for ERP error states", () => {
    render(
      <Textarea aria-invalid="true" aria-label="Notes" state="error" />
    );

    const textarea = screen.getByRole("textbox", { name: "Notes" });

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("data-state", "error");
    expect(textarea.className).toContain("--afenda-form-field-invalid-border");
  });

  it("preserves native rows attribute", () => {
    render(<Textarea aria-label="Notes" rows={5} />);

    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAttribute(
      "rows",
      "5"
    );
  });

  it("preserves disabled state for read-only ERP notes", () => {
    render(
      <Textarea
        aria-label="System note"
        disabled
        value="Posted by system — cannot edit."
      />
    );

    expect(screen.getByRole("textbox", { name: "System note" })).toBeDisabled();
  });
});
