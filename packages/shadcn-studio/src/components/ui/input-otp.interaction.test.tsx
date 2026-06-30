import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";

describe("input-otp interaction", () => {
  it("renders governed slot elements for root, group, and slots", () => {
    render(
      <InputOTP maxLength={2}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );

    expect(
      document.querySelector('[data-slot="input-otp"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="input-otp-group"]')
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="input-otp-slot"]')
    ).toHaveLength(2);
  });

  it("mounts a hidden otp input for keyboard entry", () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );

    const input = document.querySelector("input");
    expect(input).toBeTruthy();
    expect(input).toHaveAttribute("maxlength", "4");
  });
});
