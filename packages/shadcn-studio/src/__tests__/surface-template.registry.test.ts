import { describe, expect, it } from "vitest";

import {
  assertSurfaceTemplateContractWire,
  isSurfaceTemplateContractWire,
} from "../meta-contracts/surface-template.contract.js";
import {
  assertSurfaceTemplateBlockDataCoverage,
  assertSurfaceTemplateMetadataBinding,
  getSurfaceTemplateById,
  SURFACE_TEMPLATE_REGISTRY,
} from "../meta-registry/surface-template.registry.js";

describe("surface template registry (PAS-006D P06-009)", () => {
  it("registry templates are JSON-serializable", () => {
    expect(() => JSON.stringify(SURFACE_TEMPLATE_REGISTRY)).not.toThrow();

    for (const template of SURFACE_TEMPLATE_REGISTRY) {
      const parsed: unknown = JSON.parse(JSON.stringify(template));
      expect(isSurfaceTemplateContractWire(parsed)).toBe(true);
    }
  });

  it("templates reference metadata binding ids", () => {
    for (const template of SURFACE_TEMPLATE_REGISTRY) {
      expect(assertSurfaceTemplateMetadataBinding(template)).toBe(true);
      expect(template.metadataBindingId.startsWith("metadata-binding.")).toBe(
        true
      );
    }
  });

  it("resolves templates by id with block data contract coverage", () => {
    const template = getSurfaceTemplateById("surface-template.auth-sign-in");
    expect(template).toBeDefined();
    expect(template?.templateClass).toBe("form");
    expect(template && assertSurfaceTemplateBlockDataCoverage(template)).toBe(
      true
    );

    const registerTemplate = getSurfaceTemplateById(
      "surface-template.auth-sign-up"
    );
    expect(registerTemplate?.blockBindings[0]?.blockId).toBe(
      "register-page-01"
    );
    expect(
      registerTemplate &&
        assertSurfaceTemplateBlockDataCoverage(registerTemplate)
    ).toBe(true);

    const forgotPasswordTemplate = getSurfaceTemplateById(
      "surface-template.auth-forgot-password"
    );
    expect(forgotPasswordTemplate?.blockBindings[0]?.blockId).toBe(
      "forgot-password-page-01"
    );
    expect(
      forgotPasswordTemplate &&
        assertSurfaceTemplateBlockDataCoverage(forgotPasswordTemplate)
    ).toBe(true);

    const forgotPasswordSuccessTemplate = getSurfaceTemplateById(
      "surface-template.auth-forgot-password-success"
    );
    expect(forgotPasswordSuccessTemplate?.blockBindings[0]?.blockId).toBe(
      "forgot-password-success-page-01"
    );
    expect(
      forgotPasswordSuccessTemplate &&
        assertSurfaceTemplateBlockDataCoverage(forgotPasswordSuccessTemplate)
    ).toBe(true);

    const resetPasswordTemplate = getSurfaceTemplateById(
      "surface-template.auth-reset-password"
    );
    expect(resetPasswordTemplate?.blockBindings[0]?.blockId).toBe(
      "reset-password-page-01"
    );
    expect(
      resetPasswordTemplate &&
        assertSurfaceTemplateBlockDataCoverage(resetPasswordTemplate)
    ).toBe(true);

    const resetPasswordSuccessTemplate = getSurfaceTemplateById(
      "surface-template.auth-reset-password-success"
    );
    expect(resetPasswordSuccessTemplate?.blockBindings[0]?.blockId).toBe(
      "reset-password-success-page-01"
    );
    expect(
      resetPasswordSuccessTemplate &&
        assertSurfaceTemplateBlockDataCoverage(resetPasswordSuccessTemplate)
    ).toBe(true);

    const preLoginTemplates = [
      {
        blockId: "verify-email-page-01",
        surfaceTemplateId: "surface-template.auth-verify-email",
      },
      {
        blockId: "verify-email-sent-page-01",
        surfaceTemplateId: "surface-template.auth-verify-email-sent",
      },
      {
        blockId: "verify-email-expired-page-01",
        surfaceTemplateId: "surface-template.auth-verify-email-expired",
      },
      {
        blockId: "verify-email-success-page-01",
        surfaceTemplateId: "surface-template.auth-verify-email-success",
      },
      {
        blockId: "invite-page-01",
        surfaceTemplateId: "surface-template.auth-invite",
      },
      {
        blockId: "invite-accept-page-01",
        surfaceTemplateId: "surface-template.auth-invite-accept",
      },
      {
        blockId: "invite-expired-page-01",
        surfaceTemplateId: "surface-template.auth-invite-expired",
      },
      {
        blockId: "invite-invalid-page-01",
        surfaceTemplateId: "surface-template.auth-invite-invalid",
      },
      {
        blockId: "invite-consumed-page-01",
        surfaceTemplateId: "surface-template.auth-invite-consumed",
      },
      {
        blockId: "invite-email-mismatch-page-01",
        surfaceTemplateId: "surface-template.auth-invite-email-mismatch",
      },
      {
        blockId: "passkey-page-01",
        surfaceTemplateId: "surface-template.auth-passkey",
      },
      {
        blockId: "error-passkey-page-01",
        surfaceTemplateId: "surface-template.error-auth-passkey",
      },
      {
        blockId: "sso-page-01",
        surfaceTemplateId: "surface-template.auth-sso",
      },
      {
        blockId: "error-sso-page-01",
        surfaceTemplateId: "surface-template.error-auth-sso",
      },
      {
        blockId: "error-oauth-page-01",
        surfaceTemplateId: "surface-template.error-auth-oauth",
      },
      {
        blockId: "otp-page-01",
        surfaceTemplateId: "surface-template.auth-otp",
      },
      {
        blockId: "mfa-page-01",
        surfaceTemplateId: "surface-template.auth-mfa",
      },
      {
        blockId: "mfa-recovery-page-01",
        surfaceTemplateId: "surface-template.auth-mfa-recovery",
      },
      {
        blockId: "error-session-expired-page-01",
        surfaceTemplateId: "surface-template.error-auth-session-expired",
      },
      {
        blockId: "error-access-denied-page-01",
        surfaceTemplateId: "surface-template.error-auth-access-denied",
      },
      {
        blockId: "security-review-page-01",
        surfaceTemplateId: "surface-template.auth-security-review",
      },
      {
        blockId: "error-authentication-page-01",
        surfaceTemplateId: "surface-template.error-authentication",
      },
    ] as const;

    for (const expectedTemplate of preLoginTemplates) {
      const template = getSurfaceTemplateById(
        expectedTemplate.surfaceTemplateId
      );
      expect(template?.blockBindings[0]?.blockId).toBe(
        expectedTemplate.blockId
      );
      expect(template && assertSurfaceTemplateBlockDataCoverage(template)).toBe(
        true
      );
    }

    const errorTemplate = getSurfaceTemplateById("surface-template.error-page");
    expect(errorTemplate?.blockBindings[0]?.blockId).toBe("error-page-shell");
    expect(
      errorTemplate && assertSurfaceTemplateBlockDataCoverage(errorTemplate)
    ).toBe(true);
  });

  it("rejects surface templates with empty slotFills keys", () => {
    const sample = SURFACE_TEMPLATE_REGISTRY[0];
    expect(sample).toBeDefined();
    if (!sample) {
      return;
    }

    expect(
      isSurfaceTemplateContractWire({
        ...sample,
        blockBindings: [
          {
            blockId: sample.blockBindings[0]?.blockId ?? "login-page-04",
            slotFills: { "": "hero.title" },
          },
        ],
      })
    ).toBe(false);
  });

  it("assertSurfaceTemplateContractWire throws on invalid payload", () => {
    const sample = SURFACE_TEMPLATE_REGISTRY[0];
    expect(sample).toBeDefined();
    if (!sample) {
      return;
    }

    expect(() => assertSurfaceTemplateContractWire(sample)).not.toThrow();
    expect(() => assertSurfaceTemplateContractWire(null)).toThrow(
      "Invalid surface template contract wire payload."
    );
  });
});
