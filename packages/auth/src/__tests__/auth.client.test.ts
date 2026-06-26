import { describe, expect, it } from "vitest";

import {
  authClient,
  isAfendaAuthDeviceSession,
  multiSession,
  parseAfendaAuthDeviceSessions,
  signIn,
  signOut,
  signUp,
  twoFactor,
  useSession,
} from "../auth.client.js";

describe("@afenda/auth/client", () => {
  it("exports Better Auth client helpers for browser boundaries", () => {
    expect(typeof signIn.email).toBe("function");
    expect(typeof signOut).toBe("function");
    expect(typeof signUp.email).toBe("function");
    expect(typeof useSession).toBe("function");
    expect(authClient).toBeDefined();
  });

  it("exports twoFactor and multiSession plugin clients", () => {
    expect(twoFactor).toBeDefined();
    expect(typeof twoFactor.enable).toBe("function");
    expect(typeof twoFactor.verifyTotp).toBe("function");
    expect(multiSession).toBeDefined();
    expect(typeof multiSession.listDeviceSessions).toBe("function");
    expect(typeof multiSession.revoke).toBe("function");
  });

  it("exports passkey and SSO sign-in client helpers", () => {
    expect(typeof signIn.passkey).toBe("function");
    expect(typeof signIn.social).toBe("function");
    expect(typeof signIn.sso).toBe("function");
  });

  it("exports canonical device session parsing helpers", () => {
    expect(
      isAfendaAuthDeviceSession({
        session: {
          id: "session-001",
          token: "token-001",
        },
      })
    ).toBe(true);
    expect(parseAfendaAuthDeviceSessions([{ invalid: true }])).toEqual([]);
    expect(authClient).toBeDefined();
  });
});
