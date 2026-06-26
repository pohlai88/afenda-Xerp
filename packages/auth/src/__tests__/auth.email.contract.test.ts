import { describe, expect, it } from "vitest";

import type {
  AuthEmailDeliveryResult,
  AuthInvitationEmailPayload,
  AuthPasswordResetEmailPayload,
  AuthTransactionalEmailMessage,
  AuthVerificationEmailPayload,
} from "../auth.email.contract.js";

const sampleUser = {
  id: "auth_user_1",
  email: "user@example.com",
  name: "Test User",
} as const;

describe("auth.email.contract", () => {
  it("keeps transactional message shapes JSON-serializable", () => {
    const message: AuthTransactionalEmailMessage = {
      to: sampleUser.email,
      subject: "Verify your Afenda ERP email",
      html: "<p>Verify</p>",
      text: "Verify",
    };

    expect(JSON.parse(JSON.stringify(message))).toEqual(message);
  });

  it("keeps builder payload shapes JSON-serializable", () => {
    const verification: AuthVerificationEmailPayload = {
      token: "abc",
      url: "https://erp.example.com/verify",
      user: sampleUser,
    };
    const reset: AuthPasswordResetEmailPayload = {
      token: "reset",
      url: "https://erp.example.com/reset",
      user: sampleUser,
    };
    const invite: AuthInvitationEmailPayload = {
      token: "invite",
      invitationId: "inv_1",
      tenantId: "tenant_1",
      user: { email: sampleUser.email, name: sampleUser.name },
    };

    expect(JSON.parse(JSON.stringify(verification))).toEqual(verification);
    expect(JSON.parse(JSON.stringify(reset))).toEqual(reset);
    expect(JSON.parse(JSON.stringify(invite))).toEqual(invite);
  });

  it("keeps delivery result discriminated union serializable", () => {
    const disabled: AuthEmailDeliveryResult = {
      delivered: false,
      reason: "email_delivery_disabled",
    };
    const delivered: AuthEmailDeliveryResult = {
      delivered: true,
      messageId: "msg_123",
    };

    expect(JSON.parse(JSON.stringify(disabled))).toEqual(disabled);
    expect(JSON.parse(JSON.stringify(delivered))).toEqual(delivered);
  });
});
