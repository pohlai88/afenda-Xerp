import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { nextCookies } from "better-auth/next-js";
import {
  multiSession,
  type TestHelpers,
  testUtils,
  twoFactor,
} from "better-auth/plugins";
import type { BetterAuthPlugin } from "better-auth/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthAuditRecordInput } from "../auth.contract.js";
import { AFENDA_AUTH_EXTENSION_POINTS, AUTH_EVENT } from "../auth.contract.js";
import {
  createAfendaAuthAuditHooks,
  createAfendaAuthInvitationBeforeHook,
} from "../auth.hooks.js";
import {
  registerAuthInvitation,
  resetAuthInvitationStoreForTests,
} from "../auth.invitation.js";
import {
  assertTenantMfaPolicySatisfied,
  isAuthUserMfaEnabled,
} from "../auth.mfa-policy.js";

/** Mirrors `auth.config.ts` rate-limit constants (Slice 7 config attestation). */
const AUTH_RATE_LIMIT_WINDOW_SECONDS = 60;
const AUTH_RATE_LIMIT_MAX_GLOBAL = 10;
const AUTH_RATE_LIMIT_MAX_SIGN_IN = 5;

const INTEGRATION_TEST_PASSWORD = "K9#mP2vL8xQ4nR7wT6yU5zA1bC0dE3f";

const INTEGRATION_TEST_ENV = {
  BETTER_AUTH_SECRET: "integration-test-secret-32-chars!!",
  BETTER_AUTH_URL: "http://localhost:3000",
  AFENDA_AUTH_INVITATION_GATE: "enabled",
} satisfies NodeJS.ProcessEnv;

const capturedAuditEvents: AuthAuditRecordInput[] = [];

/** Captured by integration `sendVerificationEmail` — keyed by user email. */
const capturedVerificationTokens = new Map<string, string>();

vi.mock("../auth.audit.js", () => ({
  persistAuthAuditEvent: (record: AuthAuditRecordInput) => {
    capturedAuditEvents.push(record);
    return Promise.resolve();
  },
}));

const mockPlatformDb = {
  select: vi.fn(),
};

const mockAuthDb = {
  select: vi.fn(),
};

const integrationInvitationStore = new Map<
  string,
  {
    consumedAt?: number;
    email: string;
    expiresAt: number;
    invitationId: string;
    platformUserId?: string;
    tenantId?: string;
    token: string;
  }
>();

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  const { randomUUID } = await import("node:crypto");

  return {
    ...actual,
    getAuthDb: () => mockAuthDb,
    getDb: () => mockPlatformDb,
    resetMemberInvitationsForTests: async () => {
      integrationInvitationStore.clear();
    },
    registerMemberInvitation: async (input: {
      email: string;
      expiresAt?: Date;
      invitationId?: string;
      platformUserId?: string;
      tenantId?: string;
      token?: string;
    }) => {
      const email = input.email.trim().toLowerCase();
      const token = input.token?.trim() || randomUUID();
      const record = {
        email,
        expiresAt:
          input.expiresAt?.getTime() ?? Date.now() + 7 * 24 * 60 * 60 * 1000,
        invitationId: input.invitationId ?? randomUUID(),
        token,
        ...(input.platformUserId === undefined
          ? {}
          : { platformUserId: input.platformUserId }),
        ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
      };
      integrationInvitationStore.set(token, record);
      return record;
    },
    validateMemberInvitation: async (input: {
      email: string;
      token: string;
    }) => {
      const email = input.email.trim().toLowerCase();
      const token = input.token.trim();
      const record = integrationInvitationStore.get(token);

      if (!record) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token is invalid."
        );
      }

      if (record.consumedAt !== undefined) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token has already been used."
        );
      }

      if (record.expiresAt < Date.now()) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token has expired."
        );
      }

      if (record.email !== email) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token does not match the sign-up email."
        );
      }

      return { status: "valid" as const, invitation: record };
    },
    consumeMemberInvitation: async (token: string) => {
      const record = integrationInvitationStore.get(token.trim());
      if (!record || record.consumedAt !== undefined) {
        return null;
      }

      const consumed = { ...record, consumedAt: Date.now() };
      integrationInvitationStore.set(token.trim(), consumed);
      return consumed;
    },
  };
});

function chainSelect(
  db: { select: ReturnType<typeof vi.fn> },
  rows: unknown[]
): void {
  const limit = vi.fn().mockResolvedValue(rows);
  const where = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ where });
  db.select.mockReturnValueOnce({ from });
}

type IntegrationAuth = ReturnType<typeof createIntegrationTestAuth>;

interface AuthContextWithTest {
  readonly test: TestHelpers;
}

interface IntegrationFixture {
  readonly auth: IntegrationAuth;
  readonly test: TestHelpers;
}

type PluginAwareAuthApi = IntegrationAuth["api"] & {
  readonly deletePasskey?: (...args: never) => unknown;
  readonly disableTwoFactor?: (...args: never) => unknown;
  readonly enableTwoFactor?: (...args: never) => unknown;
  readonly generatePasskeyRegistrationOptions?: (...args: never) => unknown;
  readonly listDeviceSessions?: (...args: never) => unknown;
  readonly listPasskeys?: (...args: never) => unknown;
  readonly revokeDeviceSession?: (...args: never) => unknown;
  readonly verifyPasskeyRegistration?: (...args: never) => unknown;
};

function createIntegrationTestAuth() {
  return betterAuth({
    appName: "Afenda ERP",
    baseURL: INTEGRATION_TEST_ENV.BETTER_AUTH_URL,
    basePath: "/api/auth",
    secret: INTEGRATION_TEST_ENV.BETTER_AUTH_SECRET,
    database: memoryAdapter({}),
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async () => undefined,
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, token }) => {
        capturedVerificationTokens.set(user.email, token);
      },
    },
    rateLimit: {
      window: AUTH_RATE_LIMIT_WINDOW_SECONDS,
      max: AUTH_RATE_LIMIT_MAX_GLOBAL,
      customRules: {
        "/sign-in/email": {
          window: AUTH_RATE_LIMIT_WINDOW_SECONDS,
          max: AUTH_RATE_LIMIT_MAX_SIGN_IN,
        },
      },
    },
    plugins: [
      twoFactor({ backupCodeOptions: { amount: 10 } }),
      multiSession(),
      passkey({
        origin: INTEGRATION_TEST_ENV.BETTER_AUTH_URL,
        rpID: "localhost",
        rpName: "Afenda ERP",
        registration: {
          requireSession: true,
        },
      }),
      testUtils({ captureOTP: true }) as BetterAuthPlugin,
      nextCookies(),
    ],
    hooks: {
      before: createAfendaAuthInvitationBeforeHook(INTEGRATION_TEST_ENV),
      after: createAfendaAuthAuditHooks(),
    },
    trustedOrigins: [INTEGRATION_TEST_ENV.BETTER_AUTH_URL],
  });
}

async function createIntegrationFixture(): Promise<IntegrationFixture> {
  const auth = createIntegrationTestAuth();
  const ctx = await auth.$context;
  const test = (ctx as unknown as AuthContextWithTest).test;

  await test.saveUser(
    test.createUser({
      email: "_seed@internal.afenda",
      emailVerified: true,
    })
  );

  return { auth, test };
}

async function postAuth(
  auth: IntegrationAuth,
  path: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
): Promise<Response> {
  return auth.handler(
    new Request(`${INTEGRATION_TEST_ENV.BETTER_AUTH_URL}/api/auth${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: INTEGRATION_TEST_ENV.BETTER_AUTH_URL,
        ...headers,
      },
      body: JSON.stringify(body),
    })
  );
}

function readSetCookie(response: Response): string {
  return response.headers.get("set-cookie") ?? "";
}

describe("auth.integration (Better Auth testUtils + Afenda hooks)", () => {
  beforeEach(async () => {
    capturedAuditEvents.length = 0;
    capturedVerificationTokens.clear();
    await resetAuthInvitationStoreForTests();
    vi.clearAllMocks();
  });

  it("attests production rate-limit configuration on the integration auth instance", async () => {
    const { auth } = await createIntegrationFixture();

    expect(auth.options.rateLimit).toEqual({
      window: AUTH_RATE_LIMIT_WINDOW_SECONDS,
      max: AUTH_RATE_LIMIT_MAX_GLOBAL,
      customRules: {
        "/sign-in/email": {
          window: AUTH_RATE_LIMIT_WINDOW_SECONDS,
          max: AUTH_RATE_LIMIT_MAX_SIGN_IN,
        },
      },
    });
  });

  it("registers Better Auth twoFactor, multiSession, and passkey plugin API surfaces", async () => {
    const { auth } = await createIntegrationFixture();
    const api = auth.api as PluginAwareAuthApi;

    expect(typeof api.enableTwoFactor).toBe("function");
    expect(typeof api.disableTwoFactor).toBe("function");
    expect(typeof api.listDeviceSessions).toBe("function");
    expect(typeof api.revokeDeviceSession).toBe("function");
    expect(typeof api.listPasskeys).toBe("function");
    expect(typeof api.deletePasskey).toBe("function");
    expect(typeof api.generatePasskeyRegistrationOptions).toBe("function");
    expect(typeof api.verifyPasskeyRegistration).toBe("function");
    expect(typeof auth.api.listSessions).toBe("function");
  });

  it("rejects invite-only sign-up without token and audits auth.invitation.rejected", async () => {
    const { auth } = await createIntegrationFixture();

    const response = await postAuth(auth, "/sign-up/email", {
      email: "blocked@example.com",
      password: INTEGRATION_TEST_PASSWORD,
      name: "Blocked",
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(capturedAuditEvents).toContainEqual(
      expect.objectContaining({
        event: AUTH_EVENT.invitationRejected,
        result: "denied",
        context: expect.objectContaining({
          email: "blocked@example.com",
        }),
      })
    );
  });

  it("accepts sign-up with a valid invitation token and audits auth.invitation.accepted", async () => {
    const { auth } = await createIntegrationFixture();
    const invitation = await registerAuthInvitation({
      email: "invited@example.com",
      token: "invite_integration_ok",
    });

    const response = await postAuth(auth, "/sign-up/email", {
      email: "invited@example.com",
      invitationToken: "invite_integration_ok",
      password: INTEGRATION_TEST_PASSWORD,
      name: "Invited User",
    });

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      user?: { id?: string; email?: string; twoFactorEnabled?: boolean };
    };

    expect(payload.user?.email).toBe("invited@example.com");
    expect(payload.user?.twoFactorEnabled).toBe(false);

    expect(capturedAuditEvents).toContainEqual(
      expect.objectContaining({
        event: AUTH_EVENT.invitationAccepted,
        result: "success",
        context: expect.objectContaining({
          authUserId: payload.user?.id,
          email: "invited@example.com",
          invitationId: invitation.invitationId,
        }),
      })
    );
  });

  it("records email verification and password-reset lifecycle audit events via hooks", async () => {
    const { auth } = await createIntegrationFixture();

    const lifecycleInvite = await registerAuthInvitation({
      email: "lifecycle@example.com",
      token: "lifecycle_invite",
    });

    const signUpResponse = await postAuth(auth, "/sign-up/email", {
      email: "lifecycle@example.com",
      invitationToken: lifecycleInvite.token,
      password: INTEGRATION_TEST_PASSWORD,
      name: "Lifecycle User",
    });
    expect(signUpResponse.status).toBe(200);

    const verificationResponse = await postAuth(
      auth,
      "/send-verification-email",
      {
        email: "lifecycle@example.com",
      }
    );
    expect(verificationResponse.status).toBe(200);
    expect(capturedAuditEvents).toContainEqual(
      expect.objectContaining({
        event: AUTH_EVENT.emailVerificationSent,
        result: "success",
        context: expect.objectContaining({
          email: "lifecycle@example.com",
        }),
      })
    );

    const resetRequestResponse = await postAuth(
      auth,
      "/request-password-reset",
      {
        email: "lifecycle@example.com",
      }
    );
    expect(resetRequestResponse.status).toBe(200);
    expect(capturedAuditEvents).toContainEqual(
      expect.objectContaining({
        event: AUTH_EVENT.passwordResetRequested,
        result: "success",
        context: expect.objectContaining({
          email: "lifecycle@example.com",
        }),
      })
    );
  });

  it("lists multiple concurrent sessions after repeated sign-in (multiSession)", async () => {
    const { auth } = await createIntegrationFixture();
    await registerAuthInvitation({
      email: "multi@example.com",
      token: "multi_invite",
    });

    const signUpResponse = await postAuth(auth, "/sign-up/email", {
      email: "multi@example.com",
      invitationToken: "multi_invite",
      password: INTEGRATION_TEST_PASSWORD,
      name: "Multi Session",
    });
    expect(signUpResponse.status).toBe(200);

    const sendVerificationResponse = await postAuth(
      auth,
      "/send-verification-email",
      { email: "multi@example.com" }
    );
    expect(sendVerificationResponse.status).toBe(200);

    const verificationToken =
      capturedVerificationTokens.get("multi@example.com");
    expect(verificationToken).toBeDefined();

    const verifyEmailResponse = await auth.handler(
      new Request(
        `${INTEGRATION_TEST_ENV.BETTER_AUTH_URL}/api/auth/verify-email?token=${verificationToken}`,
        {
          method: "GET",
          headers: { origin: INTEGRATION_TEST_ENV.BETTER_AUTH_URL },
        }
      )
    );
    expect(verifyEmailResponse.status).toBeLessThan(400);

    const signInA = await postAuth(
      auth,
      "/sign-in/email",
      { email: "multi@example.com", password: INTEGRATION_TEST_PASSWORD },
      { "user-agent": "device-a" }
    );
    expect(signInA.status).toBe(200);
    const cookieA = readSetCookie(signInA);

    const signInB = await postAuth(
      auth,
      "/sign-in/email",
      { email: "multi@example.com", password: INTEGRATION_TEST_PASSWORD },
      { "user-agent": "device-b" }
    );
    expect(signInB.status).toBe(200);

    const sessions = await auth.api.listSessions({
      headers: new Headers({ cookie: cookieA }),
    });

    expect(sessions.length).toBeGreaterThanOrEqual(2);
    expect(sessions.some((session) => session.userAgent === "device-a")).toBe(
      true
    );
    expect(sessions.some((session) => session.userAgent === "device-b")).toBe(
      true
    );
  });

  it("integrates tenant MFA policy helpers with Better Auth two_factor_enabled reads", async () => {
    chainSelect(mockAuthDb, [{ twoFactorEnabled: true }]);
    await expect(
      isAuthUserMfaEnabled("auth_integration_1", mockAuthDb as never)
    ).resolves.toBe(true);

    chainSelect(mockPlatformDb, [{ mfaRequired: true }]);
    chainSelect(mockAuthDb, [{ twoFactorEnabled: true }]);

    await expect(
      assertTenantMfaPolicySatisfied(
        { authUserId: "auth_integration_1", tenantId: "tenant_mfa" },
        { authDb: mockAuthDb as never, platformDb: mockPlatformDb as never }
      )
    ).resolves.toBeUndefined();
  });

  it("blocks workspace access when tenant MFA is required but Better Auth MFA is disabled", async () => {
    chainSelect(mockPlatformDb, [{ mfaRequired: true }]);
    chainSelect(mockAuthDb, [{ twoFactorEnabled: false }]);

    await expect(
      assertTenantMfaPolicySatisfied(
        { authUserId: "auth_integration_2", tenantId: "tenant_mfa_strict" },
        { authDb: mockAuthDb as never, platformDb: mockPlatformDb as never }
      )
    ).rejects.toMatchObject({ name: "MfaPolicyBypassBlockedError" });

    expect(capturedAuditEvents).toContainEqual(
      expect.objectContaining({
        event: AUTH_EVENT.mfaBypassBlocked,
        result: "failure",
      })
    );
  });

  it("marks invitation, MFA, SSO, and passkey extension points active only where integration-tested", () => {
    expect(AFENDA_AUTH_EXTENSION_POINTS.invitation).toBe("active");
    expect(AFENDA_AUTH_EXTENSION_POINTS.mfa).toBe("active");
    expect(AFENDA_AUTH_EXTENSION_POINTS.enterpriseSso).toBe("active");
    expect(AFENDA_AUTH_EXTENSION_POINTS.organization).toBe("planned");
    expect(AFENDA_AUTH_EXTENSION_POINTS.passkey).toBe("active");
  });
});
