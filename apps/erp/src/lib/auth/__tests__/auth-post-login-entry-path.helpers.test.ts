import { describe, expect, it } from "vitest";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import {
  isAccessDeniedEntryPath,
  shouldRedirectToPostLoginEntryPath,
} from "@/lib/auth/auth-post-login-entry-path.helpers";

describe("auth post-login entry path helpers", () => {
  it("detects bare and query access-denied entry paths", () => {
    expect(isAccessDeniedEntryPath(AUTH_PATHS.accessDenied)).toBe(true);
    expect(
      isAccessDeniedEntryPath(`${AUTH_PATHS.accessDenied}?reason=unlinked`)
    ).toBe(true);
    expect(isAccessDeniedEntryPath(AUTH_PATHS.workspaceSelect)).toBe(false);
  });

  it("requires redirect for workspace, organization, and access-denied entry paths", () => {
    expect(
      shouldRedirectToPostLoginEntryPath({
        entryPath: AUTH_PATHS.workspaceSelect,
      })
    ).toBe(true);
    expect(
      shouldRedirectToPostLoginEntryPath({
        entryPath: AUTH_PATHS.organizationSelect,
      })
    ).toBe(true);
    expect(
      shouldRedirectToPostLoginEntryPath({
        entryPath: `${AUTH_PATHS.accessDenied}?reason=unlinked`,
      })
    ).toBe(true);
  });

  it("continues resolution for default post-auth destinations", () => {
    expect(
      shouldRedirectToPostLoginEntryPath({
        entryPath: "/workspace",
      })
    ).toBe(false);
    expect(
      shouldRedirectToPostLoginEntryPath({
        entryPath: "/",
      })
    ).toBe(false);
  });
});
