import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MorphingText } from "../../components-layouts/morphing-text.js";

describe("MorphingText layout", () => {
  it("renders morphing text container when texts are provided", () => {
    render(<MorphingText texts={["404", "Error Page"]} />);

    expect(screen.getByTestId("morphing-text")).toBeInTheDocument();
  });

  it("renders nothing when texts array is empty", () => {
    const { container } = render(<MorphingText texts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
