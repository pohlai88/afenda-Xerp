import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SKELETON_SLOTS } from "../skeleton.contract.js";
import { Skeleton } from "../skeleton.js";

describe("skeleton render", () => {
  it("renders governed skeleton root slot", () => {
    render(<Skeleton aria-hidden className="h-4 w-24" />);

    expect(
      document.querySelector(`[data-slot="${SKELETON_SLOTS.root}"]`)
    ).toBeInTheDocument();
  });
});
