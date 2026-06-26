import { describe, expect, it } from "vitest";

import {
  AUTH_FOOTER_LINK_IDS,
  AUTH_SUPPORT_LINKS,
  getAuthSupportLink,
} from "@/lib/auth/auth-link.registry";

describe("auth-link.registry", () => {
  it("defines legal and support footer links", () => {
    expect(AUTH_FOOTER_LINK_IDS).toEqual([
      "privacyPolicy",
      "termsOfService",
      "contactSupport",
      "systemStatus",
    ]);
    expect(AUTH_SUPPORT_LINKS.privacyPolicy.href).toBe("/legal/privacy");
    expect(AUTH_SUPPORT_LINKS.termsOfService.href).toBe("/legal/terms");
    expect(AUTH_SUPPORT_LINKS.contactSupport.href).toMatch(/^mailto:/);
    expect(AUTH_SUPPORT_LINKS.systemStatus.external).toBe(true);
  });

  it("resolves support links by id", () => {
    expect(getAuthSupportLink("backToHome").label).toBe("Back to home");
  });
});
