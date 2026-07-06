import { describe, expect, it } from "vitest";
import { getAuthBlockSlotsForBlockId } from "@/lib/auth/auth-block-slot.registry";
import {
  AUTH_ADJACENT_AUTH_BLOCK_IDS,
  AUTH_ADJACENT_SURFACE_PATHS,
  AUTH_ADJACENT_WCAG_REQUIRED_SLOTS,
} from "@/lib/auth/auth-wcag-adjacent.registry";

describe("auth-adjacent WCAG AA contract (PAS-006C P06-007)", () => {
  it("declares auth-adjacent surface paths", () => {
    expect(AUTH_ADJACENT_SURFACE_PATHS).toEqual(
      expect.arrayContaining([
        "/sign-in",
        "/verify-email",
        "/verify-email/sent",
        "/verify-email/expired",
        "/verify-email/success",
        "/invite",
        "/invite/accept",
        "/invite/expired",
        "/invite/invalid",
        "/invite/consumed",
        "/invite/email-mismatch",
        "/passkey",
        "/passkey/error",
        "/sso",
        "/sso/error",
        "/oauth/error",
        "/otp",
        "/mfa",
        "/mfa/recovery",
        "/session-expired",
        "/access-denied",
        "/auth/complete",
        "/workspace/select",
        "/organization/select",
        "/error",
        "/maintenance",
        "/security/review",
      ])
    );
  });

  it("maps login block slots required for WCAG form labels", () => {
    for (const blockId of AUTH_ADJACENT_AUTH_BLOCK_IDS) {
      const slots = getAuthBlockSlotsForBlockId(blockId);
      expect(slots.length).toBeGreaterThan(0);

      for (const requiredSlotId of AUTH_ADJACENT_WCAG_REQUIRED_SLOTS[blockId] ??
        []) {
        expect(slots.some((slot) => slot.slotId === requiredSlotId)).toBe(true);
      }
    }
  });
});
