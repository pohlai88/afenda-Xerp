import { describe, expect, it } from "vitest";
import {
  parseAuthActorIdentityFromAfendaAuthSession,
  resolveEnterpriseUserIdFromAfendaAuthSession,
  resolveWireActorUserIdFromAfendaAuthSession,
  toWireAuthActorIdentityFromAfendaAuthSession,
} from "../auth.actor-wire.js";
import { normalizeAfendaAuthSession } from "../auth.session.js";
import { AUTH_TEST_PLATFORM_USER_ID } from "./auth-id-test-fixtures.js";

const PLATFORM_USER_PK = "018f9f8c-9f1a-7c2b-9c20-000000000003";
const AUTH_SUBJECT_ID = "auth_user_1";

function createLinkedSession(platformUserId: string) {
  return normalizeAfendaAuthSession(
    {
      session: {
        id: "sess_wire",
        createdAt: new Date("2026-06-20T00:00:00.000Z"),
        expiresAt: new Date("2026-06-27T00:00:00.000Z"),
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: AUTH_SUBJECT_ID,
        email: "user@example.com",
        name: "Test User",
        emailVerified: true,
        image: null,
      },
    },
    platformUserId
  );
}

describe("auth.actor-wire (PAS-001 §4.1.11)", () => {
  it("maps enterprise user id into wire userId — not authSubjectId", () => {
    const session = createLinkedSession(AUTH_TEST_PLATFORM_USER_ID);
    const wire = toWireAuthActorIdentityFromAfendaAuthSession(session);

    expect(wire).toEqual({
      authSubjectId: AUTH_SUBJECT_ID,
      userId: AUTH_TEST_PLATFORM_USER_ID,
    });
  });

  it("maps platform uuid pk into wire userPk when enterprise id is absent", () => {
    const session = createLinkedSession(PLATFORM_USER_PK);
    const wire = toWireAuthActorIdentityFromAfendaAuthSession(session);

    expect(wire).toEqual({
      authSubjectId: AUTH_SUBJECT_ID,
      userPk: PLATFORM_USER_PK,
    });
  });

  it("parses trusted auth actor identity at session ingress", () => {
    const session = createLinkedSession(AUTH_TEST_PLATFORM_USER_ID);
    const identity = parseAuthActorIdentityFromAfendaAuthSession(session);

    expect(identity.authSubjectId).toBe(AUTH_SUBJECT_ID);
    expect(identity.userId).toBe(AUTH_TEST_PLATFORM_USER_ID);
  });

  it("resolves wire actor user id for metadata ingress", () => {
    const session = createLinkedSession(AUTH_TEST_PLATFORM_USER_ID);

    expect(resolveWireActorUserIdFromAfendaAuthSession(session)).toBe(
      AUTH_TEST_PLATFORM_USER_ID
    );
    expect(resolveEnterpriseUserIdFromAfendaAuthSession(session)).toBe(
      AUTH_TEST_PLATFORM_USER_ID
    );
  });

  it("rejects usr_* as authSubjectId at parse boundary", () => {
    const session = createLinkedSession(AUTH_TEST_PLATFORM_USER_ID);

    expect(() =>
      parseAuthActorIdentityFromAfendaAuthSession({
        ...session,
        user: {
          ...session.user,
          authUserId: AUTH_TEST_PLATFORM_USER_ID,
        },
      })
    ).toThrow(/must not be a canonical enterprise ID/i);
  });
});
