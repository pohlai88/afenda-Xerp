import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { AspectRatio } from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("AspectRatio governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <AspectRatio
        data-component="Override"
        data-slot="override"
        data-state="fake"
        data-testid="aspect-ratio-root"
        ratio={16 / 9}
      >
        <div>Media</div>
      </AspectRatio>
    );

    const root = screen.getByTestId("aspect-ratio-root");

    expectGovernedDataAuthority(root, {
      "data-component": "AspectRatio",
      "data-recipe": "surface",
      "data-slot": "aspect-ratio",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "AspectRatio",
      slot: "aspect-ratio",
      recipe: "surface",
      state: "ready",
    });
  });

  it("forwards ref to the aspect ratio root element", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <AspectRatio ratio={1} ref={ref}>
        <div>Thumbnail</div>
      </AspectRatio>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("accepts ratio prop while preserving governed presentation", () => {
    render(
      <AspectRatio data-testid="aspect-ratio-root" ratio={4 / 3}>
        <div data-testid="media">Preview</div>
      </AspectRatio>
    );

    const root = screen.getByTestId("aspect-ratio-root");
    expect(root).toHaveAttribute("data-slot", "aspect-ratio");
    expect(screen.getByTestId("media")).toBeInTheDocument();
  });

  it("applies governed state to root", () => {
    render(
      <AspectRatio data-testid="aspect-ratio-root" ratio={1} state="loading">
        <div>Preview</div>
      </AspectRatio>
    );

    expect(screen.getByTestId("aspect-ratio-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("renders child media content inside the governed container", () => {
    render(
      <AspectRatio ratio={4 / 3}>
        <img alt="Warehouse item" src="/example.jpg" />
      </AspectRatio>
    );

    expect(
      screen.getByRole("img", { name: "Warehouse item" })
    ).toBeInTheDocument();
  });
});
