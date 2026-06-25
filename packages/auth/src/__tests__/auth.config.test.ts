import { beforeEach, describe, expect, it, vi } from "vitest";

const betterAuthState = vi.hoisted(() => ({
  lastOptions: null as Record<string, unknown> | null,
}));

vi.mock("better-auth", () => ({
  betterAuth: (options: Record<string, unknown>) => {
    betterAuthState.lastOptions = options;
    return { api: {} };
  },
}));

vi.mock("better-auth/adapters/drizzle", () => ({
  drizzleAdapter: () => ({}),
}));

vi.mock("better-auth/next-js", () => ({
  nextCookies: () => ({}),
}));

vi.mock("better-auth/plugins", () => ({
  haveIBeenPwned: () => ({}),
  multiSession: () => ({}),
  twoFactor: () => ({}),
}));

vi.mock("@better-auth/sso", () => ({
  sso: () => ({ id: "sso" }),
}));

vi.mock("../auth.sso-policy.js", () => ({
  createAfendaSsoPluginOptions: () => ({
    disableImplicitSignUp: true,
    provisionUser: vi.fn(),
  }),
}));

vi.mock("@afenda/database", () => ({
  authSchema: {},
  getAuthDb: () => ({}),
}));

vi.mock("../auth.hooks.js", () => ({
  createAfendaAuthAuditHooks: () => ({}),
  createAfendaAuthInvitationBeforeHook: () => ({}),
}));

vi.mock("../auth.email.js", () => ({
  createAuthPasswordResetEmailSender: () => vi.fn(),
  createAuthVerificationEmailSender: () => vi.fn(),
}));

const TEST_ENV = {
  BETTER_AUTH_SECRET: "x".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
} satisfies NodeJS.ProcessEnv;

describe("auth.config", () => {
  beforeEach(() => {
    betterAuthState.lastOptions = null;
  });

  it("enables user.changeEmail in Better Auth options", async () => {
    const { createAuthConfig } = await import("../auth.config.js");

    createAuthConfig({ env: TEST_ENV });

    expect(betterAuthState.lastOptions?.["user"]).toEqual({
      changeEmail: { enabled: true },
    });
  }, 30_000);

  it("wires emailVerification.sendVerificationEmail for change-email flow", async () => {
    const { createAuthConfig } = await import("../auth.config.js");

    createAuthConfig({ env: TEST_ENV });

    expect(betterAuthState.lastOptions?.["emailVerification"]).toMatchObject({
      sendVerificationEmail: expect.any(Function),
    });
  }, 30_000);
});
