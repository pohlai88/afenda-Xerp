import { describe, expect, it } from "vitest";

import { TEST_USER_ID } from "../../../__tests__/fixtures/enterprise-id.fixtures.js";
import {
  parseAuthActorIdentity,
  serializeAuthActorIdentity,
} from "../auth-actor-identity.contract.js";

const AUTH_SUBJECT_ID = "auth_user_1";
const USER_PK = "018f9f8c-9f1a-7c2b-9c20-000000000003";

describe("auth actor identity (PAS-001 §4.1.11)", () => {
  it("parses authSubjectId, userPk, and userId separately", () => {
    const identity = parseAuthActorIdentity({
      authSubjectId: AUTH_SUBJECT_ID,
      userPk: USER_PK,
      userId: TEST_USER_ID,
    });

    expect(serializeAuthActorIdentity(identity)).toEqual({
      authSubjectId: AUTH_SUBJECT_ID,
      userPk: USER_PK,
      userId: TEST_USER_ID,
    });
  });

  it("accepts auth subject only when bridge fields are absent", () => {
    const identity = parseAuthActorIdentity({
      authSubjectId: AUTH_SUBJECT_ID,
    });

    expect(serializeAuthActorIdentity(identity)).toEqual({
      authSubjectId: AUTH_SUBJECT_ID,
    });
  });

  it("rejects usr_* in authSubjectId field", () => {
    expect(() =>
      parseAuthActorIdentity({
        authSubjectId: TEST_USER_ID,
        userPk: USER_PK,
        userId: TEST_USER_ID,
      })
    ).toThrow(/must not be a canonical enterprise ID/i);
  });

  it("rejects tenant human reference in authSubjectId field", () => {
    expect(() =>
      parseAuthActorIdentity({
        authSubjectId: "EMP-000123",
      })
    ).toThrow(/must not be a tenant human reference/i);
  });

  it("rejects canonical enterprise ID in userPk field", () => {
    expect(() =>
      parseAuthActorIdentity({
        authSubjectId: AUTH_SUBJECT_ID,
        userPk: TEST_USER_ID,
      })
    ).toThrow(/EntityPk must not be a canonical enterprise ID/i);
  });

  it("rejects malformed userId enterprise ID", () => {
    expect(() =>
      parseAuthActorIdentity({
        authSubjectId: AUTH_SUBJECT_ID,
        userId: "usr_invalid",
      })
    ).toThrow();
  });

  it("serializes trusted identity back to plain strings", () => {
    const wire = serializeAuthActorIdentity(
      parseAuthActorIdentity({
        authSubjectId: AUTH_SUBJECT_ID,
        userPk: USER_PK,
        userId: TEST_USER_ID,
      })
    );

    expect(JSON.parse(JSON.stringify(wire))).toEqual(wire);
  });

  it("parses human actorKind without integrationIdentity", () => {
    const identity = parseAuthActorIdentity({
      actorKind: "human",
      authSubjectId: AUTH_SUBJECT_ID,
      userId: TEST_USER_ID,
    });

    expect(identity.actorKind).toBe("human");
    expect(serializeAuthActorIdentity(identity).actorKind).toBe("human");
  });

  it("parses service actorKind with integrationIdentity", () => {
    const identity = parseAuthActorIdentity({
      actorKind: "service",
      authSubjectId: AUTH_SUBJECT_ID,
      integrationIdentity: {
        provider: "trigger",
        externalId: "job-run-abc",
      },
    });

    expect(identity.actorKind).toBe("service");
    expect(identity.integrationIdentity).toEqual({
      provider: "trigger",
      externalId: "job-run-abc",
    });
  });

  it("rejects human actorKind with integrationIdentity", () => {
    expect(() =>
      parseAuthActorIdentity({
        actorKind: "human",
        authSubjectId: AUTH_SUBJECT_ID,
        integrationIdentity: {
          provider: "partner",
          externalId: "ext-1",
        },
      })
    ).toThrow(/human actorKind must not carry integrationIdentity/i);
  });

  it("rejects service actorKind with userId", () => {
    expect(() =>
      parseAuthActorIdentity({
        actorKind: "service",
        authSubjectId: AUTH_SUBJECT_ID,
        userId: TEST_USER_ID,
      })
    ).toThrow(
      /service and delegated_application actorKind must not carry userId/i
    );
  });
});
