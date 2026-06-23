import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Switch } from "../../components/switch";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Switch governance", () => {
  it("exposes displayName on Switch", () => {
    expect(Switch.displayName).toBe("Switch");
  });

  it("renders root with governed data-slot and recipe", () => {
    render(<Switch aria-label="Notifications" data-testid="switch-root" />);

    expectGovernedPrimitive(screen.getByTestId("switch-root"), {
      component: "Switch",
      slot: "switch",
      recipe: "form-control",
      state: "ready",
    });
  });

  it("does not allow consumer props to override governed data attributes", () => {
    render(
      <Switch
        aria-label="Notifications"
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="switch-root"
        state="ready"
      />
    );

    expectGovernedDataAuthority(screen.getByTestId("switch-root"), {
      "data-component": "Switch",
      "data-recipe": "form-control",
      "data-slot": "switch",
      "data-state": "ready",
    });
  });

  it("forwards ref to the switch control", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Switch aria-label="Notifications" ref={ref} />);

    expect(ref.current).toBe(
      screen.getByRole("switch", { name: "Notifications" })
    );
    expect(ref.current).toHaveAttribute("data-slot", "switch");
  });

  it("renders governed thumb slot inside root", () => {
    render(<Switch aria-label="Notifications" data-testid="switch-root" />);

    const thumb = screen
      .getByTestId("switch-root")
      .querySelector('[data-slot="switch-thumb"]');

    expect(thumb).toBeTruthy();
    expectGovernedPrimitive(thumb as HTMLElement, {
      component: "Switch",
      slot: "switch-thumb",
      recipe: "form-control",
    });
  });

  it("maps size sm to data-size=sm on root", () => {
    render(<Switch aria-label="Compact tables" size="sm" />);

    expect(
      screen.getByRole("switch", { name: "Compact tables" })
    ).toHaveAttribute("data-size", "sm");
  });

  it("maps size md to data-size=default on root", () => {
    render(<Switch aria-label="Email notifications" size="md" />);

    expect(
      screen.getByRole("switch", { name: "Email notifications" })
    ).toHaveAttribute("data-size", "default");
  });

  it("reflects governed loading state on root", () => {
    render(
      <Switch aria-label="Syncing" data-testid="switch-root" state="loading" />
    );

    expect(screen.getByTestId("switch-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("exposes on/off state to assistive technology", async () => {
    const user = setupUser();

    render(<Switch aria-label="Auto-save drafts" defaultChecked={false} />);

    const switchControl = screen.getByRole("switch", {
      name: "Auto-save drafts",
    });

    expect(switchControl).toHaveAttribute("aria-checked", "false");

    await user.click(switchControl);

    expect(switchControl).toHaveAttribute("aria-checked", "true");
  });

  it("preserves disabled semantics", () => {
    render(<Switch aria-label="Locked policy" defaultChecked disabled />);

    const switchControl = screen.getByRole("switch", { name: "Locked policy" });

    expect(switchControl).toBeDisabled();
    expect(switchControl).toHaveAttribute("aria-checked", "true");
  });
});
