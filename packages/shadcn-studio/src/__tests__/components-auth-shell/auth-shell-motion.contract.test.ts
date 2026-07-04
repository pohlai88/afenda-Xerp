import { describe, expect, it } from "vitest";

import {
  AUTH_SHELL_MOTION_VARIANT_BY_BLOCK_ID,
  AUTH_SHELL_PIXEL_IMAGE_PATH,
  AUTH_SHELL_PIXEL_IMAGE_SOURCES,
  AUTH_SHELL_PIXEL_STORYBOOK_IMAGE_PATH,
  resolveAuthShellMotionVariant,
} from "../../components-auth-shell/auth-shell-motion.contract.js";
import {
  resolveAuthShellMotionPalette,
  resolveAuthShellMotionRenderMode,
} from "../../components-auth-shell/auth-shell-motion-scene.client.js";

describe("auth-shell-motion.contract", () => {
  it("tries ERP image path before Storybook mirror", () => {
    expect(AUTH_SHELL_PIXEL_IMAGE_SOURCES).toEqual([
      AUTH_SHELL_PIXEL_IMAGE_PATH,
      AUTH_SHELL_PIXEL_STORYBOOK_IMAGE_PATH,
    ]);
  });

  it("maps access pages to the access variant", () => {
    expect(resolveAuthShellMotionVariant("login-page-04")).toBe("access");
    expect(resolveAuthShellMotionVariant("register-page-01")).toBe("access");
  });

  it("maps non-access pages to calmer shared shell variants", () => {
    expect(resolveAuthShellMotionVariant("forgot-password-page-01")).toBe(
      "recover"
    );
    expect(resolveAuthShellMotionVariant("verify-email-page-01")).toBe(
      "verify"
    );
    expect(resolveAuthShellMotionVariant("invite-page-01")).toBe("invite");
    expect(resolveAuthShellMotionVariant("mfa-page-01")).toBe("security");
    expect(resolveAuthShellMotionVariant("error-authentication-page-01")).toBe(
      "error"
    );
  });

  it("disables continuous animation when reduced motion is requested", () => {
    expect(
      resolveAuthShellMotionRenderMode({
        imageLoaded: true,
        prefersReducedMotion: true,
      })
    ).toEqual({
      animate: false,
      particleSource: "image",
    });
  });

  it("falls back to the atmospheric field when the lynx image is unavailable", () => {
    expect(
      resolveAuthShellMotionRenderMode({
        imageLoaded: false,
        prefersReducedMotion: false,
      })
    ).toEqual({
      animate: true,
      particleSource: "fallback",
    });
  });

  it("keeps access lane presentation stronger than restrained error lanes", () => {
    const accessPalette = resolveAuthShellMotionPalette("access");
    const errorPalette = resolveAuthShellMotionPalette("error");

    expect(accessPalette.driftAmplitude).toBeGreaterThan(
      errorPalette.driftAmplitude
    );
    expect(accessPalette.accentAlpha).toBeGreaterThan(errorPalette.accentAlpha);
  });

  it("covers every governed auth block id in the mapping", () => {
    expect(Object.keys(AUTH_SHELL_MOTION_VARIANT_BY_BLOCK_ID).length).toBe(33);
  });
});
