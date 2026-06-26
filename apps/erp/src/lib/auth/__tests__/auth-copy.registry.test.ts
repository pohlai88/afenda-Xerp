import { describe, expect, it } from "vitest";

import {
  AUTH_ENUMERATION_FORBIDDEN_PHRASES,
  AUTH_SAFE_ERRORS,
  collectAuthCopyStrings,
} from "@/lib/auth/auth-copy.registry";

describe("auth-copy.registry", () => {
  it("uses non-enumerating safe error messages", () => {
    expect(AUTH_SAFE_ERRORS.signInFailed).toContain("check your details");
    expect(AUTH_SAFE_ERRORS.signInFailed).not.toMatch(/email not found/i);
  });

  it("audits governed copy for forbidden enumeration phrases", () => {
    const strings = [
      ...collectAuthCopyStrings(),
      ...Object.values(AUTH_SAFE_ERRORS),
    ];

    for (const phrase of strings) {
      for (const pattern of AUTH_ENUMERATION_FORBIDDEN_PHRASES) {
        expect(phrase).not.toMatch(pattern);
      }
    }
  });
});
