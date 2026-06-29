import type { AfendaAuthSession } from "@afenda/auth";
import { describe, expect, it, vi } from "vitest";

const authWireMocks = vi.hoisted(() => ({
  resolveWireActorUserIdFromAfendaAuthSession: vi.fn(() => "user_wire_actor_1"),
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();

  return {
    ...actual,
    resolveWireActorUserIdFromAfendaAuthSession:
      authWireMocks.resolveWireActorUserIdFromAfendaAuthSession,
  };
});

import { resolveProtectedPathActorUserIdFromSession } from "../resolve-protected-path-actor.server";

function createTestSession(): AfendaAuthSession {
  return {
    metadata: {
      activeWorkspaceId: null,
      expiresAt: "2026-06-27T00:00:00.000Z",
      image: null,
      ipAddress: "127.0.0.1",
      issuedAt: "2026-06-20T00:00:00.000Z",
      userAgent: "vitest",
    },
    sessionId: "sess_1",
    user: {
      authUserId: "auth_user_1",
      email: "user@example.com",
      emailVerified: true,
      enterpriseUserId: null,
      linkStatus: "linked",
      name: "User",
      userId: "user_1",
    },
  };
}

describe("resolveProtectedPathActorUserIdFromSession", () => {
  it("delegates to governed @afenda/auth wire ingress", () => {
    const session = createTestSession();

    expect(resolveProtectedPathActorUserIdFromSession(session)).toBe(
      "user_wire_actor_1"
    );
    expect(
      authWireMocks.resolveWireActorUserIdFromAfendaAuthSession
    ).toHaveBeenCalledWith(session);
  });
});
