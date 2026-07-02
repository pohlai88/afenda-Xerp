import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../../components-ui/button.js";

describe("button render", () => {
  it("renders with governed root slot", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="button"]')).toBeInTheDocument();
  });

  it("keeps governed data-slot when consumer passes override", () => {
    render(<Button data-slot="wrong-button">Save</Button>);

    expect(document.querySelector('[data-slot="button"]')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="wrong-button"]')
    ).not.toBeInTheDocument();
  });

  it("applies variant classes from contract cva", () => {
    render(
      <Button data-testid="destructive-btn" variant="destructive">
        Delete
      </Button>
    );

    const button = screen.getByTestId("destructive-btn");
    expect(button.className).toContain("text-destructive");
  });
});
