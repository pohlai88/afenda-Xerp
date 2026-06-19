import { describe, expect, it } from "vitest";

import {
  assertEmail,
  buildUserInsertRow,
  buildUserUpdatePatch,
  InvalidEmailError,
  isPlatformUserActive,
  normalizeEmail,
} from "../user/user.contract.js";

describe("user contract", () => {
  it("normalizes email to lowercase trimmed form", () => {
    expect(normalizeEmail(" Jack@Email.com ")).toBe("jack@email.com");
    expect(assertEmail(" Jack@Email.com ")).toBe("jack@email.com");
  });

  it("rejects invalid emails", () => {
    expect(() => assertEmail("")).toThrow(InvalidEmailError);
    expect(() => assertEmail("not-an-email")).toThrow(InvalidEmailError);
  });

  it("builds normalized insert rows", () => {
    const row = buildUserInsertRow({
      email: " Jack@Email.com ",
      displayName: "  Jack  ",
    });

    expect(row).toEqual({
      email: "jack@email.com",
      displayName: "Jack",
      status: "active",
    });
  });

  it("normalizes email on update patches", () => {
    expect(buildUserUpdatePatch({ email: " NEW@Example.com " })).toEqual({
      email: "new@example.com",
    });
  });

  it("allows only active users to act", () => {
    expect(isPlatformUserActive({ status: "active" })).toBe(true);
    expect(isPlatformUserActive({ status: "invited" })).toBe(false);
    expect(isPlatformUserActive({ status: "suspended" })).toBe(false);
    expect(isPlatformUserActive({ status: "deactivated" })).toBe(false);
  });
});
