import { describe, expect, it } from "vitest";

import { TEST_USER_ID } from "../../../__tests__/fixtures/enterprise-id.fixtures.js";
import {
  isAuthSubjectId,
  parseAuthSubjectId,
  parseOptionalAuthSubjectId,
  toAuthSubjectId,
} from "../auth-subject-id.contract.js";

const VALID_AUTH_SUBJECT = "auth_user_1";
const VALID_AUTH_SUBJECT_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("auth subject id (PAS-001 §4.1.11)", () => {
  it("accepts valid auth subject text PK", () => {
    const id = parseAuthSubjectId(VALID_AUTH_SUBJECT);

    expect(toAuthSubjectId(id)).toBe(VALID_AUTH_SUBJECT);
    expect(isAuthSubjectId(VALID_AUTH_SUBJECT)).toBe(true);
  });

  it("accepts UUID-shaped Better Auth subject ids", () => {
    const id = parseAuthSubjectId(VALID_AUTH_SUBJECT_UUID);

    expect(toAuthSubjectId(id)).toBe(VALID_AUTH_SUBJECT_UUID);
  });

  it("rejects canonical enterprise ID as auth subject", () => {
    expect(() => parseAuthSubjectId(TEST_USER_ID)).toThrow(
      /must not be a canonical enterprise ID/i
    );
    expect(isAuthSubjectId(TEST_USER_ID)).toBe(false);
  });

  it("rejects tenant human reference as auth subject", () => {
    expect(() => parseAuthSubjectId("EMP-000123")).toThrow(
      /must not be a tenant human reference/i
    );
    expect(isAuthSubjectId("EMP-000123")).toBe(false);
  });

  it("rejects empty auth subject", () => {
    expect(() => parseAuthSubjectId("")).toThrow(/AuthSubjectId is required/i);
    expect(() => parseAuthSubjectId("   ")).toThrow(
      /AuthSubjectId is required/i
    );
  });

  it("returns null for optional empty values", () => {
    expect(parseOptionalAuthSubjectId(null)).toBeNull();
    expect(parseOptionalAuthSubjectId(undefined)).toBeNull();
    expect(parseOptionalAuthSubjectId("")).toBeNull();
  });

  it("parses optional auth subject when present", () => {
    expect(parseOptionalAuthSubjectId(VALID_AUTH_SUBJECT)).toBe(
      VALID_AUTH_SUBJECT
    );
  });
});
