import { describe, expect, it } from "vitest";

import {
  assertDevAuthBootstrapAllowed,
  DevAuthBootstrapError,
  hasDevLoginCredentials,
  hasDevViewerLoginCredentials,
  isDevLoginPanelEnabled,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
  resolveDevViewerLoginPassword,
} from "../dev-login.env.js";
import {
  DEV_AUTH_BOOTSTRAP_CONFIRM_ENV,
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_EMAIL_ENV,
  DEV_LOGIN_PANEL_ENV,
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

  it("detects configured dev login credentials without throwing", () => {
    expect(hasDevLoginCredentials({})).toBe(false);
    expect(hasDevLoginCredentials({ [DEV_LOGIN_PASSWORD_ENV]: "short" })).toBe(
      false
    );
    expect(
      hasDevLoginCredentials({
        [DEV_LOGIN_PASSWORD_ENV]: "DevLocalLogin!23",
      })
    ).toBe(true);
  });

  it("enables the dev login panel outside production unless explicitly disabled", () => {
    expect(isDevLoginPanelEnabled({ NODE_ENV: "production" })).toBe(false);
    expect(isDevLoginPanelEnabled({ NODE_ENV: "development" })).toBe(true);
    expect(
      isDevLoginPanelEnabled({
        NODE_ENV: "development",
        [DEV_LOGIN_PANEL_ENV]: "false",
      })
    ).toBe(false);
    expect(
      isDevLoginPanelEnabled({
        NODE_ENV: "development",
        [DEV_LOGIN_PANEL_ENV]: "0",
      })
    ).toBe(false);
  });
});
