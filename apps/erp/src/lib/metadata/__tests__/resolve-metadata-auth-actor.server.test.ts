import { normalizeAfendaAuthSession } from "@afenda/auth";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";
import {
  resolveMetadataActorUserIdFromAfendaAuthSession,
  resolveMetadataActorUserIdFromOperatingContext,
} from "../resolve-metadata-auth-actor.server";

const AUTH_TEST_PLATFORM_USER_ID = createTestEnterpriseId(
  "user",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);

function createLinkedSession(platformUserId: string) {
  return normalizeAfendaAuthSession(
    {
      session: {
        id: "sess_metadata_actor",
        createdAt: new Date("2026-06-20T00:00:00.000Z"),
        expiresAt: new Date("2026-06-27T00:00:00.000Z"),
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: "auth_user_metadata",
        email: "user@example.com",
        name: "Test User",
        emailVerified: true,
        image: null,
      },
    },
    platformUserId
  );
}

describe("resolve-metadata-auth-actor.server", () => {
  it("resolves metadata actor id from auth session wire ingress", () => {
    const session = createLinkedSession(AUTH_TEST_PLATFORM_USER_ID);

    expect(resolveMetadataActorUserIdFromAfendaAuthSession(session)).toBe(
      AUTH_TEST_PLATFORM_USER_ID
    );
  });

  it("prefers enterprise user id when session has uuid platform pk plus enterprise bridge", () => {
    const platformPk = "018f9f8c-9f1a-7c2b-9c20-000000000003";
    const session = normalizeAfendaAuthSession(
      {
        session: {
          id: "sess_metadata_actor_dual",
          createdAt: new Date("2026-06-20T00:00:00.000Z"),
          expiresAt: new Date("2026-06-27T00:00:00.000Z"),
          ipAddress: null,
          userAgent: null,
        },
        user: {
          id: "auth_user_metadata",
          email: "user@example.com",
          name: "Test User",
          emailVerified: true,
          image: null,
        },
      },
      platformPk,
      AUTH_TEST_PLATFORM_USER_ID
    );

    expect(resolveMetadataActorUserIdFromAfendaAuthSession(session)).toBe(
      AUTH_TEST_PLATFORM_USER_ID
    );
  });

  it("resolves metadata actor id from operating context enterprise user id", () => {
    const operatingContext = createModuleRouteOperatingContext();

    expect(
      resolveMetadataActorUserIdFromOperatingContext(operatingContext)
    ).toBe(operatingContext.actor.userId);
  });
});
