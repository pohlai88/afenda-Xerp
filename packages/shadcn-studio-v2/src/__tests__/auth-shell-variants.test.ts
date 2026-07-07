import { describe, expect, it } from "vitest";

import {
  AUTH_SHELL_CANONICAL_VARIANT_IDS,
  AUTH_SHELL_VARIANT_PRESETS,
  getAuthShellVariantPreset,
} from "../views/auth/auth-shell-variants";

describe("AuthShell variant presets", () => {
  it("exposes five canonical ingress presets aligned to block IDs", () => {
    expect(AUTH_SHELL_CANONICAL_VARIANT_IDS).toEqual([
      "sign-in",
      "otp",
      "mfa",
      "invite",
      "error",
    ]);

    for (const variantId of AUTH_SHELL_CANONICAL_VARIANT_IDS) {
      const preset = getAuthShellVariantPreset(variantId);
      expect(preset.id).toBe(variantId);
      expect(preset.blockId).toMatch(/-page-01$/);
      expect(preset.title).toBeTruthy();
      expect(AUTH_SHELL_VARIANT_PRESETS[variantId]).toEqual(preset);
    }
  });
});
