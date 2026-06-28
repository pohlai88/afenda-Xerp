import { render, screen } from "@testing-library/react";
import { SearchIcon } from "lucide-react";
import { describe, expect, it } from "vitest";
import {
  Badge,
  Checkbox,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
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

  it("uses afenda form-field token classes for Input border and placeholder", () => {
    render(<Input aria-label="Email" placeholder="you@example.com" />);

    const input = screen.getByRole("textbox", { name: "Email" });

    expect(input.className).toContain("--afenda-form-field-border");
    expect(input.className).toContain("--afenda-form-field-placeholder");
    expect(input.className).toContain("--afenda-form-field-border-focus");
    expect(input.className).toContain(
      "--afenda-form-field-disabled-background"
    );
    expect(input.className).toContain("--afenda-form-field-invalid-border");
  });

  it("uses afenda form-field token classes for Badge success/warning/info tones", () => {
    render(
      <div>
        <Badge emphasis="solid" tone="success">
          Success
        </Badge>
        <Badge emphasis="solid" tone="warning">
          Warning
        </Badge>
        <Badge emphasis="solid" tone="info">
          Info
        </Badge>
      </div>
    );

    const successBadge = screen.getByText("Success");
    const warningBadge = screen.getByText("Warning");
    const infoBadge = screen.getByText("Info");

    expect(successBadge.className).toContain("bg-success");
    expect(warningBadge.className).toContain("bg-warning");
    expect(infoBadge.className).toContain("bg-info");
    // Ensure old proxy classes are gone
    expect(successBadge.className).not.toContain("bg-accent");
    expect(warningBadge.className).not.toContain("bg-chart-3");
    expect(infoBadge.className).not.toContain("bg-primary/");
  });

  it("renders InputGroupInput without Governed UI className policy violations", () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Search tokens"
          placeholder="Search tokens"
          type="search"
        />
      </InputGroup>
    );

    const input = screen.getByRole("searchbox", { name: "Search tokens" });

    expect(input).toHaveAttribute("data-slot", "input-group-control");
    expect(input).toHaveAttribute("data-component", "InputGroup");
    expect(input.className).toContain("border-0");
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
