import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../components/input-otp";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

afterEach(() => {
  cleanup();
});

describe("InputOTP governance", () => {
  it("keeps governed data attributes authoritative on InputOTP root", () => {
    render(
      <InputOTP
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-testid="input-otp-root"
        maxLength={2}
        state="ready"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );

    const root = screen.getByTestId("input-otp-root");

    expectGovernedDataAuthority(root, {
      "data-component": "InputOTP",
      "data-recipe": "form-control",
      "data-slot": "input-otp",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "InputOTP",
      recipe: "form-control",
      slot: "input-otp",
      state: "ready",
    });
  });

  it("applies governed state and form-control axes on InputOTP root", () => {
    render(
      <InputOTP
        data-testid="input-otp-root"
        density="compact"
        maxLength={2}
        size="sm"
        state="loading"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );

    const root = screen.getByTestId("input-otp-root");

    expect(root).toHaveAttribute("data-state", "loading");
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root).toHaveAttribute("data-size", "sm");
  });

  it("renders slot cells with governed data-slot", () => {
    render(
      <InputOTP maxLength={2}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );

    const slots = document.querySelectorAll('[data-slot="input-otp-slot"]');

    expect(slots).toHaveLength(2);
    expect(slots[0]).toHaveAttribute("data-component", "InputOTP");
    expect(slots[0]).toHaveAttribute("data-recipe", "form-control");
  });

  it("renders group shell and separator slots", () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup data-testid="otp-group">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator data-testid="otp-separator" />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );

    expect(screen.getByTestId("otp-group")).toHaveAttribute(
      "data-slot",
      "input-otp-group"
    );
    expect(screen.getByTestId("otp-separator")).toHaveAttribute(
      "data-slot",
      "input-otp-separator"
    );
    expect(screen.getByTestId("otp-separator")).toHaveAttribute(
      "role",
      "separator"
    );
    expect(
      screen.getByTestId("otp-separator").querySelector("svg")
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref to InputOTP root input", () => {
    const inputRef = createRef<HTMLInputElement>();

    render(
      <InputOTP maxLength={2} ref={inputRef}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it("exposes displayName on input OTP parts", () => {
    expect(InputOTP.displayName).toBe("InputOTP");
    expect(InputOTPGroup.displayName).toBe("InputOTPGroup");
    expect(InputOTPSlot.displayName).toBe("InputOTPSlot");
    expect(InputOTPSeparator.displayName).toBe("InputOTPSeparator");
  });
});
