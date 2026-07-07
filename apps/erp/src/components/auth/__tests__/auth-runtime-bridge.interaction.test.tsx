// @vitest-environment jsdom

import { render, screen, setupUser, waitFor } from "@afenda/testing/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthBlockFormPreview } from "@/components/auth/auth-block-form-preview.client";
import { AuthRuntimeBridge } from "@/components/auth/auth-runtime-bridge.client";
import type { AuthSurfaceConfig } from "@/lib/auth/auth-surface-config.server";

const runtimeConfig: AuthSurfaceConfig = {
  nextPath: "/workspace",
  passkeyEnabled: false,
  socialProviderIds: [],
  ssoEnabled: false,
};

describe("AuthRuntimeBridge interaction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("submits sign-in credentials to the auth API and redirects on success", async () => {
    const user = setupUser();
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ url: "/auth/complete" }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })
    );
    const assignSpy = vi.fn();
    const originalLocation = window.location;

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        assign: assignSpy,
      },
    });

    render(
      <>
        <AuthBlockFormPreview blockId="login-page-04" />
        <AuthRuntimeBridge config={runtimeConfig} path="/sign-in" />
      </>
    );

    await user.type(screen.getByLabelText(/email/i), "operator@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/auth/sign-in/email",
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    const [, requestInit] = fetchSpy.mock.calls[0] ?? [];
    const body =
      requestInit?.body !== undefined && typeof requestInit.body === "string"
        ? (JSON.parse(requestInit.body) as Record<string, unknown>)
        : {};

    expect(body).toMatchObject({
      callbackURL: "/workspace",
      email: "operator@example.com",
      password: "secret",
    });

    await waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith("/auth/complete");
    });

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("surfaces API error message when sign-in POST fails", async () => {
    const user = setupUser();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Invalid credentials" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      })
    );

    render(
      <>
        <AuthBlockFormPreview blockId="login-page-04" />
        <AuthRuntimeBridge config={runtimeConfig} path="/sign-in" />
      </>
    );

    await user.type(screen.getByLabelText(/email/i), "operator@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid credentials"
    );
  });
});
