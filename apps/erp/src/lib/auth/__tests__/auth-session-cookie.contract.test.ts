import { describe, expect, it } from "vitest";

import {
  AFENDA_AUTH_SESSION_COOKIE_NAME,
  hasAfendaAuthSessionCookie,
} from "../auth-session-cookie.contract";

describe("auth-session-cookie.contract", () => {
  it("detects primary session cookie", () => {
    expect(
      hasAfendaAuthSessionCookie(
        `${AFENDA_AUTH_SESSION_COOKIE_NAME}=signed-token; other=1`
      )
    ).toBe(true);
  });

  it("detects multi-session cookie variants", () => {
    expect(
      hasAfendaAuthSessionCookie(
        `${AFENDA_AUTH_SESSION_COOKIE_NAME}_multi-abc=signed; other=1`
      )
    ).toBe(true);
  });

  it("returns false when cookie header is absent", () => {
    expect(hasAfendaAuthSessionCookie(null)).toBe(false);
    expect(hasAfendaAuthSessionCookie("")).toBe(false);
  });
});
