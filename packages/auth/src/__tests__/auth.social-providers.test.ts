import { describe, expect, it } from "vitest";

import {
  AFENDA_AUTH_SOCIAL_PROVIDER_IDS,
  AFENDA_OAUTH_PROVIDER_IDS,
  isAfendaAuthSocialProviderId,
  SIGN_IN_SOCIAL_PROVIDER_IDS,
} from "../auth.social-providers.js";

describe("auth.social-providers", () => {
  it("exposes a single canonical social provider id list", () => {
    expect(AFENDA_AUTH_SOCIAL_PROVIDER_IDS).toEqual(["google", "github"]);
    expect(AFENDA_OAUTH_PROVIDER_IDS).toBe(AFENDA_AUTH_SOCIAL_PROVIDER_IDS);
    expect(SIGN_IN_SOCIAL_PROVIDER_IDS).toBe(AFENDA_AUTH_SOCIAL_PROVIDER_IDS);
  });

  it("narrows known provider ids with isAfendaAuthSocialProviderId", () => {
    expect(isAfendaAuthSocialProviderId("google")).toBe(true);
    expect(isAfendaAuthSocialProviderId("github")).toBe(true);
    expect(isAfendaAuthSocialProviderId("discord")).toBe(false);
  });
});
