import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Badge,
  Checkbox,
  Input,
  Label,
  Separator,
  Skeleton,
  Switch,
} from "../../index";

describe("shell primitive governance", () => {
  it("renders Input with governed data attributes", () => {
    render(<Input aria-label="Email" placeholder="you@example.com" />);

    const input = screen.getByRole("textbox", { name: "Email" });

    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("data-component", "Input");
    expect(input).toHaveAttribute("data-recipe", "form-control");
  });

  it("renders shell primitives with expected slots and associations", () => {
    render(
      <div>
        <Badge emphasis="soft" tone="info">
          New
        </Badge>
        <Separator aria-hidden />
        <Skeleton aria-hidden data-testid="skeleton" />
        <Label htmlFor="name">Name</Label>
      </div>
    );

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "data-slot",
      "skeleton"
    );
    expect(screen.getByText("Name")).toHaveAttribute("for", "name");
  });

  it("keeps governed data attributes authoritative on Separator", () => {
    render(
      <Separator
        data-recipe="override"
        data-slot="override"
        data-testid="separator"
      />
    );

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveAttribute("data-recipe", "form-control");
  });

  it("keeps governed data attributes authoritative on Switch", () => {
    render(
      <Switch
        aria-label="Notifications"
        data-component="Override"
        data-state="override"
      />
    );

    const switchControl = screen.getByRole("switch", { name: "Notifications" });

    expect(switchControl).toHaveAttribute("data-component", "Switch");
    expect(switchControl).toHaveAttribute("data-state", "ready");
  });

  it("keeps governed data attributes authoritative on Checkbox", () => {
    render(
      <Checkbox
        aria-label="Accept terms"
        data-recipe="override"
        data-slot="override"
      />
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    expect(checkbox).toHaveAttribute("data-recipe", "form-control");
  });
});
