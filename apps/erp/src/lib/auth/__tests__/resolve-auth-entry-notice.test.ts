import { describe, expect, it } from "vitest";

import {
  AUTH_ENTRY_NOTICE_HINTS,
  AUTH_ENTRY_NOTICE_MESSAGES,
  resolveAuthEntryNotice,
} from "@/lib/auth/resolve-auth-entry-notice";

describe("resolveAuthEntryNotice", () => {
  it("returns null for empty or unknown notice values", () => {
    expect(resolveAuthEntryNotice(null)).toBeNull();
    expect(resolveAuthEntryNotice("")).toBeNull();
    expect(resolveAuthEntryNotice("unknown")).toBeNull();
  });

  it("returns supported notice keys", () => {
    expect(resolveAuthEntryNotice("verify-email")).toBe("verify-email");
    expect(resolveAuthEntryNotice("password-reset")).toBe("password-reset");
  });

  it("maps notices to user-facing copy", () => {
    expect(AUTH_ENTRY_NOTICE_MESSAGES["verify-email"]).toMatch(/email/i);
    expect(AUTH_ENTRY_NOTICE_MESSAGES["password-reset"]).toMatch(/password/i);
    expect(AUTH_ENTRY_NOTICE_HINTS["verify-email"]).toMatch(
      /verification link/i
    );
    expect(AUTH_ENTRY_NOTICE_HINTS["password-reset"]).toMatch(
      /updated password/i
    );
  });
});
