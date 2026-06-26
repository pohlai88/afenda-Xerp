import { describe, expect, it } from "vitest";

import {
  AUTH_ENUMERATION_FORBIDDEN_PHRASES,
  collectAuthCopyStrings,
} from "@/lib/auth/auth-copy.registry";
import {
  resolveEmailVerifiedRedirect,
  resolveInviteAcceptRedirect,
  resolveOtpEntryRedirect,
  resolvePasswordResetSuccessRedirect,
  resolvePostAuthEntry,
  resolveSessionExpiredRedirect,
  resolveSignInAfterPasswordResetPath,
  resolveSignInSuccessRedirect,
  resolveSignUpSuccessRedirect,
  resolveUnauthenticatedRedirect,
  resolveUnlinkedSessionRedirect,
} from "@/lib/auth/auth-redirect.policy";

describe("auth-redirect.policy", () => {
  it("prefers safe next param after sign-in", () => {
    expect(resolveSignInSuccessRedirect("/reports")).toBe("/reports");
    expect(resolveSignInSuccessRedirect("//evil.com")).toBe("/");
  });

  it("routes sign-up and verification flows to canonical paths", () => {
    expect(resolveSignUpSuccessRedirect()).toBe("/verify-email/sent");
    expect(resolveEmailVerifiedRedirect()).toBe("/verify-email/success");
    expect(resolvePasswordResetSuccessRedirect()).toBe(
      "/reset-password/success"
    );
    expect(resolveSignInAfterPasswordResetPath()).toBe(
      "/sign-in?notice=password-reset"
    );
  });

  it("routes security and session flows safely", () => {
    expect(resolveUnauthenticatedRedirect("/invoices")).toBe(
      "/sign-in?next=%2Finvoices"
    );
    expect(resolveSessionExpiredRedirect("/invoices")).toBe(
      "/session-expired?next=%2Finvoices"
    );
    expect(resolveUnlinkedSessionRedirect()).toBe(
      "/access-denied?reason=unlinked"
    );
    expect(resolveOtpEntryRedirect()).toBe("/mfa?method=otp");
  });

  it("builds invite accept redirect to sign-up", () => {
    expect(resolveInviteAcceptRedirect("token-123", "user@example.com")).toBe(
      "/sign-up?invitationToken=token-123&email=user%40example.com"
    );
  });

  it("stubs post-auth entry to workspace select when multiple workspaces", () => {
    expect(resolvePostAuthEntry(null, { workspaceCount: 2 })).toBe(
      "/workspace/select"
    );
    expect(resolvePostAuthEntry(null, { workspaceCount: 1 })).toBe("/");
  });
});

describe("auth-copy.registry enumeration safety", () => {
  it("does not leak account enumeration phrases in governed copy", () => {
    const strings = collectAuthCopyStrings();
    for (const phrase of strings) {
      for (const pattern of AUTH_ENUMERATION_FORBIDDEN_PHRASES) {
        expect(phrase).not.toMatch(pattern);
      }
    }
  });
});
