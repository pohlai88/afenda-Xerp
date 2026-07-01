import { describe, expect, expectTypeOf, it } from "vitest";
import {
  INPUT_OTP_PRIMITIVE_ID,
  INPUT_OTP_SLOTS,
  inputOtpContainerClassName,
  inputOtpPrimitiveMetadata,
  inputOtpSlotClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./input-otp.contract.js";
import type { InputOTPSlotProps, InputOtpSlot } from "./input-otp.js";

describe("input-otp primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports INPUT_OTP_PRIMITIVE_ID for metadata registries", () => {
    expect(INPUT_OTP_PRIMITIVE_ID).toBe("shadcn-studio.ui.input-otp");
  });

  it("exports INPUT_OTP_SLOTS", () => {
    expect(INPUT_OTP_SLOTS).toEqual({
      root: "input-otp",
      group: "input-otp-group",
      slot: "input-otp-slot",
      separator: "input-otp-separator",
    });
  });

  it("exports governed class constants", () => {
    expect(inputOtpContainerClassName).toContain("cn-input-otp");
    expect(inputOtpSlotClassName).toContain("border-input");
  });

  it("inputOtpPrimitiveMetadata is JSON-serializable", () => {
    const payload = inputOtpPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("InputOtpSlot is a governed slot literal union", () => {
    expectTypeOf<InputOtpSlot>().toEqualTypeOf<
      "input-otp" | "input-otp-group" | "input-otp-slot" | "input-otp-separator"
    >();
  });

  it("InputOTPSlotProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof InputOTPSlotProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
