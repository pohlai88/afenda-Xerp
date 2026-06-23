import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Progress } from "../../components/progress";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Progress governance", () => {
  it("exposes displayName on Progress", () => {
    expect(Progress.displayName).toBe("Progress");
  });

  it("renders root and indicator with governed data-slots", () => {
    render(<Progress data-testid="progress-root" value={42} />);

    const root = screen.getByTestId("progress-root");

    expectGovernedPrimitive(root, {
      component: "Progress",
      slot: "progress",
      recipe: "form-control",
    });
    expect(root.querySelector('[data-slot="progress-indicator"]')).toBeTruthy();
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Progress
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="progress-root"
        state="ready"
        value={60}
      />
    );

    expectGovernedDataAuthority(screen.getByTestId("progress-root"), {
      "data-component": "Progress",
      "data-recipe": "form-control",
      "data-slot": "progress",
      "data-state": "ready",
    });
  });

  it("keeps governed data attributes authoritative on indicator", () => {
    render(<Progress data-testid="progress-root" value={50} />);

    const indicator = screen
      .getByTestId("progress-root")
      .querySelector('[data-slot="progress-indicator"]');

    expect(indicator).toBeTruthy();
    expectGovernedDataAuthority(indicator as HTMLElement, {
      "data-component": "Progress",
      "data-recipe": "form-control",
      "data-slot": "progress-indicator",
    });
  });

  it("propagates loading state on root", () => {
    render(<Progress data-testid="progress-root" state="loading" value={30} />);

    expectGovernedPrimitive(screen.getByTestId("progress-root"), {
      component: "Progress",
      slot: "progress",
      recipe: "form-control",
      state: "loading",
    });
  });

  it("drives indicator position via CSS custom property", () => {
    render(<Progress data-testid="progress-root" value={75} />);

    const indicator = screen
      .getByTestId("progress-root")
      .querySelector('[data-slot="progress-indicator"]');

    expect(indicator).toHaveStyle({ "--progress-value": "75" });
  });

  it("forwards value to the root for progressbar semantics", () => {
    render(<Progress aria-label="Upload" value={68} />);

    const progressbar = screen.getByRole("progressbar", { name: "Upload" });

    expect(progressbar).toHaveAttribute("aria-valuenow", "68");
    expect(progressbar).toHaveAttribute("data-slot", "progress");
  });

  it("forwards ref to Progress root", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Progress ref={ref} value={25} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "progress");
  });
});
