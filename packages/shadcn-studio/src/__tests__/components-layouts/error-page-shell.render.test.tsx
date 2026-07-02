import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ERROR_PAGE_COPY_REGISTRY } from "../../components-layouts/error-page-shell.contract.js";
import { ErrorPageShell } from "../../components-layouts/error-page-shell.js";

describe("ErrorPageShell layout", () => {
  it("renders governed error page shell", () => {
    render(<ErrorPageShell {...ERROR_PAGE_COPY_REGISTRY["404"]} />);

    expect(screen.getByTestId("error-page-shell")).toBeInTheDocument();
    expect(
      screen.getByText(ERROR_PAGE_COPY_REGISTRY["404"].headline)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: ERROR_PAGE_COPY_REGISTRY["404"].actionLabel,
      })
    ).toHaveAttribute("href", "/");
  });
});
