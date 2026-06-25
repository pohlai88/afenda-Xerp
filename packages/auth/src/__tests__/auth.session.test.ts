import { describe, expect, it } from "vitest";

import type { AfendaAuthSession } from "../auth.contract.js";
import { UnlinkedPlatformUserError } from "../auth.errors.js";
import {
  isAfendaAuthSessionLinked,
  normalizeAfendaAuthSession,
  toAfendaAuthIdentity,
} from "../auth.session.js";

function createSession(
  platformUserId: string | null,
  linkStatus?: "linked" | "unlinked"
): AfendaAuthSession {
  const normalized = normalizeAfendaAuthSession(
    {
      session: {
        id: "sess_test",
        createdAt: new Date("2026-06-20T00:00:00.000Z"),
        expiresAt: new Date("2026-06-27T00:00:00.000Z"),
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: "auth_user_test",
        email: "user@example.com",
        name: "Test User",
        emailVerified: true,
        image: null,
      },
    },
    platformUserId
  );

  if (linkStatus === undefined) {
    return normalized;
  }

  return {
    ...normalized,
    user: {
      ...normalized.user,
      linkStatus,
    },
  };
}

describe("normalizeAfendaAuthSession activeWorkspaceId", () => {
  const baseSession = {
    session: {
      id: "sess_workspace",
      createdAt: new Date("2026-06-20T00:00:00.000Z"),
      expiresAt: new Date("2026-06-27T00:00:00.000Z"),
      ipAddress: null,
      userAgent: null,
    },
    user: {
      id: "auth_user_test",
      email: "user@example.com",
      name: "Test User",
      emailVerified: true,
      image: null,
    },
  };

  it("defaults activeWorkspaceId to null when absent", () => {
    const normalized = normalizeAfendaAuthSession(
      baseSession,
      "platform_user_1"
    );
    expect(normalized.metadata.activeWorkspaceId).toBeNull();
  });

  it("passes through activeWorkspaceId when set", () => {
    const normalized = normalizeAfendaAuthSession(
      {
        ...baseSession,
        session: {
          ...baseSession.session,
          activeWorkspaceId: "workspace_abc",
        },
      },
      "platform_user_1"
    );
    expect(normalized.metadata.activeWorkspaceId).toBe("workspace_abc");
  });

  it("treats whitespace-only activeWorkspaceId as null", () => {
    const normalized = normalizeAfendaAuthSession(
      {
        ...baseSession,
        session: {
          ...baseSession.session,
          activeWorkspaceId: "   ",
        },
      },
      "platform_user_1"
    );
    expect(normalized.metadata.activeWorkspaceId).toBeNull();
  });

  it("round-trips activeWorkspaceId through JSON", () => {
    const normalized = normalizeAfendaAuthSession(
      {
        ...baseSession,
        session: {
          ...baseSession.session,
          activeWorkspaceId: "workspace_json",
        },
      },
      "platform_user_1"
    );
    expect(JSON.parse(JSON.stringify(normalized))).toEqual(normalized);
  });
});

describe("isAfendaAuthSessionLinked", () => {
  it("returns true when linkStatus is linked and userId is non-empty", () => {
    expect(isAfendaAuthSessionLinked(createSession("platform_user_1"))).toBe(
      true
    );
  });

  it("returns false when platform userId is null", () => {
    expect(isAfendaAuthSessionLinked(createSession(null))).toBe(false);
  });

  it("returns false when platform userId is whitespace only", () => {
    expect(isAfendaAuthSessionLinked(createSession("   "))).toBe(false);
  });

  it("returns false when linkStatus is unlinked despite userId present", () => {
    expect(
      isAfendaAuthSessionLinked(createSession("platform_user_1", "unlinked"))
    ).toBe(false);
  });

  it("returns false when linkStatus is linked but userId is null", () => {
    expect(isAfendaAuthSessionLinked(createSession(null, "linked"))).toBe(
      false
    );
  });
});

describe("toAfendaAuthIdentity", () => {
  it("throws UnlinkedPlatformUserError for unlinked session", () => {
    expect(() => toAfendaAuthIdentity(createSession(null))).toThrow(
      UnlinkedPlatformUserError
    );
  });

  it("returns branded userId for linked session", () => {
    const identity = toAfendaAuthIdentity(createSession("platform_user_1"));
    expect(identity.userId).toBe("platform_user_1");
    expect(identity.email).toBe("user@example.com");
  });
});
