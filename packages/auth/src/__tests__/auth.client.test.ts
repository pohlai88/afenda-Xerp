import { describe, expect, it } from "vitest";

import {
  authClient,
  signIn,
  signOut,
  signUp,
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
});
