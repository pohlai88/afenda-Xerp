// @vitest-environment jsdom

import { render, screen } from "@afenda/testing/react";
import { describe, expect, it, vi } from "vitest";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import type { AuthSurfaceConfig } from "@/lib/auth/auth-surface-config.server";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";

vi.mock("@/components/auth/auth-pixel-motion-shell", () => ({
  AuthPixelMotionShell: () => null,
}));

vi.mock("@/components/auth/auth-runtime-bridge.client", () => ({
  AuthRuntimeBridge: () => null,
}));

const runtimeConfig: AuthSurfaceConfig = {
  nextPath: "/workspace",
  passkeyEnabled: false,
  socialProviderIds: [],
  ssoEnabled: false,
};

describe("AuthIngressSurfacePage interaction", () => {
  it("renders sign-in ingress with login form bridge target", () => {
    const data = loadAuthIngressSurfacePage("/sign-in");
    render(
      <AuthIngressSurfacePage data={data} runtimeConfig={runtimeConfig} />
    );

    expect(screen.getByRole("main", { name: "Sign in" })).toBeInTheDocument();
    expect(document.getElementById("login-form-v1")).toBeInTheDocument();
  });

  it("renders AuthIngressChrome for loader errors", () => {
    render(
      <AuthIngressSurfacePage
        data={{
          kind: "error",
          message: "Surface unavailable.",
          title: "Auth ingress unavailable",
        }}
        runtimeConfig={runtimeConfig}
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Auth ingress unavailable",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Surface unavailable.");
  });
});
