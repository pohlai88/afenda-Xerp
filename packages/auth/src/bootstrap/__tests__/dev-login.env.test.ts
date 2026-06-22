import { describe, expect, it } from "vitest";

import {
  assertDevAuthBootstrapAllowed,
  DevAuthBootstrapError,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
} from "../dev-login.env.js";
import {
  DEV_AUTH_BOOTSTRAP_CONFIRM_ENV,
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_EMAIL_ENV,
  DEV_LOGIN_PASSWORD_ENV,
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
});
