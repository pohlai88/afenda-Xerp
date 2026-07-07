import { describe, expect, it } from "vitest";

import {
  AUTH_SHELL_ERP_BLOCK_IDS,
  resolveAuthShellBlockPreset,
  resolveAuthShellBlockPresetOrSignIn,
} from "../views/auth/auth-shell-block-map";

describe("AuthShell ERP block map", () => {
  it("maps login-page-04 to sign-in copy", () => {
    const preset = resolveAuthShellBlockPreset("login-page-04");

    expect(preset).toEqual({
      blockId: "login-page-04",
      variantId: "sign-in",
      title: "Sign in to Afenda",
      description:
        "Use your workspace credentials to access operator surfaces.",
    });
  });

  it("falls back to sign-in preset for unknown block ids", () => {
    const preset = resolveAuthShellBlockPresetOrSignIn("unknown-block");

    expect(preset.blockId).toBe("login-page-04");
    expect(preset.variantId).toBe("sign-in");
    expect(preset.title).toBeTruthy();
  });

  it("covers every ERP auth block id", () => {
    for (const blockId of AUTH_SHELL_ERP_BLOCK_IDS) {
      expect(resolveAuthShellBlockPreset(blockId)).toBeDefined();
    }
  });
});
