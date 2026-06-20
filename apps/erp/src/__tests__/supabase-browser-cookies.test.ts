import { beforeEach, describe, expect, it } from "vitest";

import {
  __readBrowserCookiesForTests,
  __writeBrowserCookiesForTests,
} from "../lib/supabase/client";

describe("Supabase browser cookie adapter", () => {
  beforeEach(() => {
    __writeBrowserCookiesForTests([
      { name: "existing", value: "1", options: { path: "/" } },
    ]);
  });

  it("reads cookies via parseCookieHeader", () => {
    expect(__readBrowserCookiesForTests()).toEqual(
      expect.arrayContaining([{ name: "existing", value: "1" }])
    );
  });

  it("writes cookies via serializeCookieHeader", () => {
    __writeBrowserCookiesForTests([
      {
        name: "sb-test-auth-token",
        value: "session-value",
        options: { path: "/", sameSite: "lax" },
      },
    ]);

    expect(document.cookie).toContain("sb-test-auth-token=");
  });
});
