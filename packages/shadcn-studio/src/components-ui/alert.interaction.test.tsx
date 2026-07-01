import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("alert interaction", () => {
  it('exposes role="alert" with governed root, title, and description slots', () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something needs your attention.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert"]')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="alert-title"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="alert-description"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(
      screen.getByText("Something needs your attention.")
    ).toBeInTheDocument();
  });
});
