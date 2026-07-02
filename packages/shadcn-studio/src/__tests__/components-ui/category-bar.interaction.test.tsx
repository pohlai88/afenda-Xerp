import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryBar } from "../../components-ui/category-bar";
import { TooltipProvider } from "../../components-ui/tooltip";

describe("category-bar interaction", () => {
  it("renders governed root, labels, track, and segment slots", () => {
    render(
      <CategoryBar colors={["bg-blue-500", "bg-green-500"]} values={[40, 60]} />
    );

    expect(
      document.querySelector('[data-slot="category-bar"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="category-bar-labels"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="category-bar-track"]')
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="category-bar-segment"]')
    ).toHaveLength(2);
  });

  it("renders marker slot when marker is provided", () => {
    render(<CategoryBar marker={{ value: 50 }} values={[50, 50]} />);

    expect(
      document.querySelector('[data-slot="category-bar-marker"]')
    ).toBeInTheDocument();
  });

  it("hides labels slot when showLabels is false", () => {
    render(<CategoryBar showLabels={false} values={[100]} />);

    expect(
      document.querySelector('[data-slot="category-bar-labels"]')
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="category-bar-track"]')
    ).toBeInTheDocument();
  });

  it("keeps governed root data-slot when consumer passes override", () => {
    render(<CategoryBar data-slot="wrong-root" values={[100]} />);

    expect(
      document.querySelector('[data-slot="category-bar"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="wrong-root"]')
    ).not.toBeInTheDocument();
  });

  it("opens marker tooltip on hover when tooltip text is provided", async () => {
    const user = setupUser();

    render(
      <TooltipProvider delay={0}>
        <CategoryBar
          marker={{ tooltip: "Target value", value: 50 }}
          values={[50, 50]}
        />
      </TooltipProvider>
    );

    expect(screen.queryByText("Target value")).not.toBeInTheDocument();

    const trigger = document.querySelector('[data-slot="tooltip-trigger"]');
    expect(trigger).toBeInTheDocument();

    await user.hover(trigger as Element);
    expect(await screen.findByText("Target value")).toBeVisible();
  });
});
