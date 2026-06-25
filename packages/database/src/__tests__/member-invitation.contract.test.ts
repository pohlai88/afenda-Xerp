import { describe, expect, it } from "vitest";

import {
  hashMemberInvitationToken,
  verifyMemberInvitationToken,
} from "../membership/member-invitation.contract.js";

describe("member-invitation.contract", () => {
  it("hashes tokens deterministically", () => {
    const hash = hashMemberInvitationToken(" invite_token ");

    expect(hash).toHaveLength(64);
    expect(hash).toBe(hashMemberInvitationToken("invite_token"));
  });

  it("verifies matching tokens with constant-time helper", () => {
    const token = "secret-invite";
    const hash = hashMemberInvitationToken(token);

    expect(verifyMemberInvitationToken(token, hash)).toBe(true);
    expect(verifyMemberInvitationToken("other", hash)).toBe(false);
  });
});
