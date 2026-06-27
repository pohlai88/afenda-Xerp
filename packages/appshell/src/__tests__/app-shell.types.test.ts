import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  ApplicationShellIdentity,
  ApplicationShellProps,
} from "../app-shell.types";
import {
  DEFAULT_APPLICATION_SHELL_PROPS,
  resolveApplicationShellAvatarFallback,
  resolveApplicationShellChrome,
} from "../app-shell.types";
import { createAppShellTestUserId } from "./app-shell-test-user-id.js";

/** ERP passes `toAfendaAuthIdentity(session)` — keep shapes aligned without a runtime dep on auth. */
type AfendaAuthIdentityBoundary = {
  readonly displayName: string;
  readonly email: string;
  readonly userId: ApplicationShellIdentity["userId"];
};

describe("ApplicationShell contracts", () => {
  it("accepts auth identity at the ERP boundary without structural drift", () => {
    expectTypeOf<AfendaAuthIdentityBoundary>().toEqualTypeOf<ApplicationShellIdentity>();
  });

  it("allows identity-driven shell props without session fields", () => {
    const userId = createAppShellTestUserId();

    const props: ApplicationShellProps = {
      identity: {
        displayName: "Alex Morgan",
        email: "alex@example.com",
        userId,
      },
    };

    expectTypeOf(props.identity).toMatchTypeOf<
      ApplicationShellIdentity | undefined
    >();
  });

  it("exposes satisfies-checked shell defaults", () => {
    expect(DEFAULT_APPLICATION_SHELL_PROPS.brandName).toBe("Afenda ERP");
    expect(DEFAULT_APPLICATION_SHELL_PROPS.navigationLabel).toBe("Navigation");
  });

  it("resolves chrome from identity when userName is omitted", () => {
    const userId = createAppShellTestUserId();

    const chrome = resolveApplicationShellChrome({
      identity: {
        displayName: "Alex Morgan",
        email: "alex@example.com",
        userId,
      },
    });

    expect(chrome.userName).toBe("Alex Morgan");
    expect(chrome.email).toBe("alex@example.com");
    expect(chrome.avatarFallback).toBe("AM");
    expect(chrome.brandName).toBe(DEFAULT_APPLICATION_SHELL_PROPS.brandName);
    expect(chrome.roleLabel).toBe("Operations admin");
    expect(chrome.searchTriggerLabel).toBe("Search modules…");
    expect(chrome.density).toBe("standard");
  });

  it("derives avatar initials from display name", () => {
    expect(resolveApplicationShellAvatarFallback("Alex Morgan")).toBe("AM");
    expect(resolveApplicationShellAvatarFallback("User")).toBe("U");
  });
});
