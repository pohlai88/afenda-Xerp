import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SPINNER_SLOTS } from "../spinner.contract.js";
import { Spinner } from "../spinner.js";

describe("spinner render", () => {
  it("renders governed spinner root slot with status role", () => {
    render(<Spinner />);

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${SPINNER_SLOTS.root}"]`)
    ).toBeInTheDocument();
  });
});
