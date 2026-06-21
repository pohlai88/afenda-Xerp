import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { sampleSectionFixture } from "../fixtures/sample-section.fixture.js";

describe("section rendering", () => {
  it("renders section title and description", () => {
    render(sampleSectionFixture.element);

    expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByText("Recent orders")).toBeInTheDocument();
  });
});
