import { describe, expect, it } from "vitest";

import {
  assertDevAuthBootstrapAllowed,
  DevAuthBootstrapError,
  hasDevViewerLoginCredentials,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
  resolveDevViewerLoginPassword,
} from "../dev-login.env.js";
import {
  DEV_AUTH_BOOTSTRAP_CONFIRM_ENV,
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_EMAIL_ENV,
  DEV_LOGIN_PASSWORD_ENV,
  DEV_VIEWER_LOGIN_PASSWORD_ENV,
} from "../dev-login.fixture.js";

describe("dev auth bootstrap env", () => {
  it("defaults dev login email to the dev workspace fixture", () => {
    expect(resolveDevLoginEmail({})).toBe(DEV_LOGIN_EMAIL);
  });

  it("allows overriding dev login email through env", () => {
    expect(
      resolveDevLoginEmail({
        [DEV_LOGIN_EMAIL_ENV]: "preview-admin@localhost.afenda",
      })
    ).toBe("preview-admin@localhost.afenda");
  });

  it("requires AFENDA_DEV_LOGIN_PASSWORD with minimum length", () => {
    expect(() => resolveDevLoginPassword({})).toThrow(DevAuthBootstrapError);
    expect(() =>
      resolveDevLoginPassword({ [DEV_LOGIN_PASSWORD_ENV]: "short" })
    ).toThrow(DevAuthBootstrapError);
    expect(
      resolveDevLoginPassword({
        [DEV_LOGIN_PASSWORD_ENV]: "DevLocalLogin!23",
      })
    ).toBe("DevLocalLogin!23");
  });

  it("blocks production bootstrap without explicit confirmation", () => {
    expect(() =>
      assertDevAuthBootstrapAllowed({ NODE_ENV: "production" })
    ).toThrow(DevAuthBootstrapError);
  });

  it("allows production bootstrap when explicitly confirmed", () => {
    expect(() =>
      assertDevAuthBootstrapAllowed({
        NODE_ENV: "production",
        [DEV_AUTH_BOOTSTRAP_CONFIRM_ENV]: "yes",
      })
    ).not.toThrow();
  });

  it("derives viewer login password from admin password when viewer env is unset", () => {
    expect(
      resolveDevViewerLoginPassword({
        [DEV_LOGIN_PASSWORD_ENV]: "DevLocalLogin!23",
      })
    ).toBe("DevLocalLogin!23-viewer");
  });

  it("prefers explicit viewer password when configured", () => {
    expect(
      resolveDevViewerLoginPassword({
        [DEV_LOGIN_PASSWORD_ENV]: "DevLocalLogin!23",
        [DEV_VIEWER_LOGIN_PASSWORD_ENV]: "ViewerOnly!99",
      })
    ).toBe("ViewerOnly!99");
  });

  it("detects viewer credentials when admin password is configured", () => {
    expect(hasDevViewerLoginCredentials({})).toBe(false);
    expect(
      hasDevViewerLoginCredentials({
        [DEV_LOGIN_PASSWORD_ENV]: "DevLocalLogin!23",
      })
    ).toBe(true);
    expect(
      hasDevViewerLoginCredentials({
        [DEV_VIEWER_LOGIN_PASSWORD_ENV]: "ViewerOnly!99",
      })
    ).toBe(true);
  });
});
