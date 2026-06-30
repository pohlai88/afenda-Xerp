import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Slider } from "./slider";

describe("slider interaction", () => {
  it("exposes labeled slider group with range input and thumb slot", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[50]} max={100} min={0} />
    );

    expect(screen.getByRole("group", { name: "Volume" })).toHaveAttribute(
      "data-slot",
      "slider"
    );
    expect(
      container.querySelector('[data-slot="slider-thumb"]')
    ).toBeInTheDocument();
    expect(container.querySelector('input[type="range"]')).toHaveValue("50");
  });
});
