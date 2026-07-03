import { describe, expect, it } from "vitest";

import {
  BLOCK_SLOT_REGISTRY,
  getBlockDataContractForBlockId,
  getBlockSlotsForBlockId,
} from "../meta-registry/block-slot.registry.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "../meta-registry/studio-block-parity.registry.js";

describe("block slot registry (PAS-006B P06-003)", () => {
  it("covers every seeded parity block with at least one slot", () => {
    expect(() => JSON.stringify(BLOCK_SLOT_REGISTRY)).not.toThrow();

    for (const parity of SHADCN_STUDIO_BLOCK_PARITY_REGISTRY) {
      const slots = getBlockSlotsForBlockId(parity.mcpBlockId);
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.every((slot) => slot.blockId === parity.mcpBlockId)).toBe(
        true
      );
    }
  });

  it("applies family slot templates to non-primary MCP blocks", () => {
    expect(
      getBlockSlotsForBlockId("statistics-card-03").map((slot) => slot.slotId)
    ).toEqual(["metric.label", "metric.value", "metric.change"]);
    expect(
      getBlockSlotsForBlockId("widget-total-earning").length
    ).toBeGreaterThanOrEqual(3);
    expect(
      getBlockSlotsForBlockId("chart-earning-report").length
    ).toBeGreaterThanOrEqual(3);
    expect(
      getBlockSlotsForBlockId("account-settings-01").length
    ).toBeGreaterThanOrEqual(4);
  });

  it("uses stable slot ids for login-page-04", () => {
    const slots = getBlockSlotsForBlockId("login-page-04");
    expect(slots.map((slot) => slot.slotId)).toEqual([
      "login-page-04.content",
      "login.branding",
      "login.branding.title",
      "login.branding.lead",
      "login.form.title",
      "login.form.subtitle",
      "login.email",
      "login.password",
      "login.password.help",
      "login.submit",
    ]);
  });

  it("uses stable slot ids for register-page-01", () => {
    const slots = getBlockSlotsForBlockId("register-page-01");
    expect(slots.map((slot) => slot.slotId)).toEqual([
      "register-page-01.content",
      "register.branding",
      "register.branding.eyebrow",
      "register.branding.title",
      "register.branding.lead",
      "register.form.title",
      "register.form.subtitle",
      "register.name",
      "register.email",
      "register.password",
      "register.confirmPassword",
      "register.invitationCode",
      "register.submit",
    ]);
  });

  it("uses stable slot ids for reset-password ingress pages", () => {
    expect(
      getBlockSlotsForBlockId("forgot-password-page-01").map(
        (slot) => slot.slotId
      )
    ).toEqual([
      "forgot-password-page-01.content",
      "forgot-password.form.title",
      "forgot-password.form.subtitle",
      "forgot-password.email",
      "forgot-password.submit",
    ]);
    expect(
      getBlockSlotsForBlockId("forgot-password-success-page-01").map(
        (slot) => slot.slotId
      )
    ).toEqual([
      "forgot-password-success-page-01.content",
      "forgot-password-success.title",
      "forgot-password-success.message",
      "forgot-password-success.cta",
      "forgot-password-success.back",
    ]);
    expect(
      getBlockSlotsForBlockId("reset-password-page-01").map(
        (slot) => slot.slotId
      )
    ).toEqual([
      "reset-password-page-01.content",
      "reset-password.form.title",
      "reset-password.form.subtitle",
      "reset-password.password",
      "reset-password.confirmPassword",
      "reset-password.submit",
    ]);
    expect(
      getBlockSlotsForBlockId("reset-password-success-page-01").map(
        (slot) => slot.slotId
      )
    ).toEqual([
      "reset-password-success-page-01.content",
      "reset-password-success.title",
      "reset-password-success.message",
      "reset-password-success.cta",
    ]);
  });

  it("uses stable slot ids for pre-login ingress pages", () => {
    const expectedSlotsByBlockId = {
      "verify-email-page-01": [
        "verify-email-page-01.content",
        "verify-email.title",
        "verify-email.message",
        "verify-email.cta",
      ],
      "verify-email-sent-page-01": [
        "verify-email-sent-page-01.content",
        "verify-email-sent.title",
        "verify-email-sent.message",
        "verify-email-sent.cta",
      ],
      "verify-email-expired-page-01": [
        "verify-email-expired-page-01.content",
        "verify-email-expired.title",
        "verify-email-expired.message",
        "verify-email-expired.cta",
      ],
      "verify-email-success-page-01": [
        "verify-email-success-page-01.content",
        "verify-email-success.title",
        "verify-email-success.message",
        "verify-email-success.cta",
      ],
      "invite-page-01": [
        "invite-page-01.content",
        "invite.title",
        "invite.message",
        "invite.cta",
      ],
      "invite-accept-page-01": [
        "invite-accept-page-01.content",
        "invite-accept.form.title",
        "invite-accept.form.subtitle",
        "invite-accept.name",
        "invite-accept.email",
        "invite-accept.password",
        "invite-accept.confirmPassword",
        "invite-accept.invitationCode",
        "invite-accept.submit",
      ],
      "invite-expired-page-01": [
        "invite-expired-page-01.content",
        "invite-expired.title",
        "invite-expired.message",
        "invite-expired.cta",
        "invite-expired.back",
      ],
      "invite-invalid-page-01": [
        "invite-invalid-page-01.content",
        "invite-invalid.title",
        "invite-invalid.message",
        "invite-invalid.cta",
        "invite-invalid.back",
      ],
      "invite-consumed-page-01": [
        "invite-consumed-page-01.content",
        "invite-consumed.title",
        "invite-consumed.message",
        "invite-consumed.cta",
        "invite-consumed.back",
      ],
      "invite-email-mismatch-page-01": [
        "invite-email-mismatch-page-01.content",
        "invite-email-mismatch.title",
        "invite-email-mismatch.message",
        "invite-email-mismatch.cta",
        "invite-email-mismatch.back",
      ],
      "passkey-page-01": [
        "passkey-page-01.content",
        "passkey.title",
        "passkey.message",
        "passkey.cta",
        "passkey.fallback",
      ],
      "error-passkey-page-01": [
        "error-passkey-page-01.content",
        "error-passkey.title",
        "error-passkey.message",
        "error-passkey.cta",
      ],
      "sso-page-01": [
        "sso-page-01.content",
        "sso.title",
        "sso.message",
        "sso.cta",
        "sso.fallback",
      ],
      "error-sso-page-01": [
        "error-sso-page-01.content",
        "error-sso.title",
        "error-sso.message",
        "error-sso.cta",
      ],
      "error-oauth-page-01": [
        "error-oauth-page-01.content",
        "error-oauth.title",
        "error-oauth.message",
        "error-oauth.cta",
      ],
      "otp-page-01": [
        "otp-page-01.content",
        "otp.form.title",
        "otp.form.subtitle",
        "otp.code",
        "otp.submit",
      ],
      "mfa-page-01": [
        "mfa-page-01.content",
        "mfa.form.title",
        "mfa.form.subtitle",
        "mfa.code",
        "mfa.submit",
      ],
      "mfa-recovery-page-01": [
        "mfa-recovery-page-01.content",
        "mfa-recovery.form.title",
        "mfa-recovery.form.subtitle",
        "mfa-recovery.code",
        "mfa-recovery.submit",
      ],
      "error-session-expired-page-01": [
        "error-session-expired-page-01.content",
        "error-session-expired.title",
        "error-session-expired.message",
        "error-session-expired.cta",
      ],
      "error-access-denied-page-01": [
        "error-access-denied-page-01.content",
        "error-access-denied.title",
        "error-access-denied.message",
        "error-access-denied.cta",
      ],
      "security-review-page-01": [
        "security-review-page-01.content",
        "security-review.title",
        "security-review.message",
        "security-review.cta",
      ],
      "error-authentication-page-01": [
        "error-authentication-page-01.content",
        "error-authentication.title",
        "error-authentication.message",
        "error-authentication.cta",
      ],
    } as const;

    for (const [blockId, slotIds] of Object.entries(expectedSlotsByBlockId)) {
      expect(
        getBlockSlotsForBlockId(blockId).map((slot) => slot.slotId)
      ).toEqual(slotIds);
    }
  });

  it("links block data contract fields to registered slot ids", () => {
    for (const parity of SHADCN_STUDIO_BLOCK_PARITY_REGISTRY) {
      const contract = getBlockDataContractForBlockId(parity.mcpBlockId);
      expect(contract).toBeDefined();

      const slotIds = new Set(
        getBlockSlotsForBlockId(parity.mcpBlockId).map((slot) => slot.slotId)
      );

      for (const field of contract?.fields ?? []) {
        expect(slotIds.has(field.slotId)).toBe(true);
      }

      for (const action of contract?.actions ?? []) {
        expect(slotIds.has(action.slotId)).toBe(true);
      }
    }
  });
});
