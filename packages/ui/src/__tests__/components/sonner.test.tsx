import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import { Toaster } from "../../components/sonner";
import { getGovernedStates } from "../../governance/state";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "system",
    setTheme: vi.fn(),
    resolvedTheme: "light",
  }),
}));

async function findToasterRoot() {
  return waitFor(() => {
    const governedRoot = document.querySelector('[data-slot="toaster"]');
    if (governedRoot) {
      return governedRoot;
    }

    throw new Error("Toaster root not mounted");
  });
}

async function findToasterLiveRegion() {
  return waitFor(() => {
    const liveRegion = document.querySelector(
      'section[aria-label="Notifications alt+T"]'
    );
    if (liveRegion) {
      return liveRegion;
    }

    throw new Error("Toaster live region not mounted");
  });
}

describe("Toaster governance", () => {
  it("exposes displayName on Toaster", () => {
    expect(Toaster.displayName).toBe("Toaster");
  });

  it("renders root with governed data-slot and recipe", async () => {
    render(<Toaster />);

    const root = await findToasterRoot();

    expectGovernedPrimitive(root as HTMLElement, {
      component: "Toaster",
      slot: "toaster",
      recipe: "surface",
      state: "ready",
    });
    expect(root).toHaveClass("contents");

    await expect(findToasterLiveRegion()).resolves.toBeTruthy();
  });

  it("keeps governed data attributes authoritative on root", async () => {
    render(
      <Toaster
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        state="ready"
      />
    );

    const root = await findToasterRoot();

    expectGovernedDataAuthority(root as HTMLElement, {
      "data-component": "Toaster",
      "data-recipe": "surface",
      "data-slot": "toaster",
      "data-state": "ready",
    });
  });

  it("reflects governed loading state on root", async () => {
    render(<Toaster state="loading" />);

    const root = await findToasterRoot();

    expect(root).toHaveAttribute("data-state", "loading");
  });

  it.each(getGovernedStates())("renders governed state %s on root", async (state) => {
    render(<Toaster state={state} />);

    const root = await findToasterRoot();

    expect(root).toHaveAttribute("data-state", state);
  });

  it("forwards ref to the governed wrapper element", async () => {
    const ref = createRef<HTMLDivElement>();

    render(<Toaster ref={ref} />);

    const root = await findToasterRoot();

    expect(ref.current).toBe(root);
    expect(ref.current).toHaveAttribute("data-slot", "toaster");
  });

  it("exposes an accessible live region for toast announcements", async () => {
    render(<Toaster />);

    const liveRegion = await findToasterLiveRegion();

    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toHaveAttribute("aria-label", "Notifications alt+T");
  });

  it("renders governed severity icons with decorative semantics when toasts mount", async () => {
    render(<Toaster />);

    toast.success("Customer saved");

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="toaster-success-icon"]')
      ).toBeTruthy();
    });

    const icon = document.querySelector('[data-slot="toaster-success-icon"]');

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("data-component", "Toaster");
    expect(icon).toHaveAttribute("data-recipe", "surface");
  });

  it("applies loading icon slot when loading toast is shown", async () => {
    render(<Toaster />);

    toast.loading("Syncing bank transactions…");

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="toaster-loading-icon"]')
      ).toBeTruthy();
    });

    const icon = document.querySelector('[data-slot="toaster-loading-icon"]');

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("animate-spin");
  });

  it.each([
    ["info", "toaster-info-icon", () => toast.info("Maintenance scheduled")],
    ["warning", "toaster-warning-icon", () => toast.warning("Duplicate rows skipped")],
    ["error", "toaster-error-icon", () => toast.error("Payment gateway unreachable")],
  ] as const)(
    "renders governed %s icon slot when toast is shown",
    async (_severity, slot, trigger) => {
      render(<Toaster />);

      trigger();

      await waitFor(() => {
        expect(document.querySelector(`[data-slot="${slot}"]`)).toBeTruthy();
      });

      const icon = document.querySelector(`[data-slot="${slot}"]`);

      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon).toHaveAttribute("data-component", "Toaster");
      expect(icon).toHaveAttribute("data-recipe", "surface");
    }
  );
});
