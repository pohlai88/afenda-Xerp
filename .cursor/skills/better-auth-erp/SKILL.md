---
name: better-auth-erp
description: >-
  Complete Better Auth integration guide for @afenda/auth (Governed UI). Covers the
  auth/permission boundary, session contract, server-side getAfendaAuthSession /
  requireAfendaAuthSession, client authClient hooks, auth singleton fingerprinting,
  audit hook pattern with createAuthMiddleware, platform actor resolution, env vars,
  adding plugins (OAuth social, email verification, password reset, 2FA, passkey,
  SSO, multi-session), session config, testing with resetAuthForTests, and all
  forbidden patterns. Use when reading a session, adding a social provider, wiring
  email verification, adding a new auth plugin, debugging a missing/stale session,
  or extending the auth audit pipeline.
disable-model-invocation: true
paths:
  - packages/auth/**
  - apps/erp/**
---

# Better Auth — `@afenda/auth` (Governed UI)

## Auth vs permission boundary

| Layer | Package | Question |
|-------|---------|----------|
| Authentication (Governed UI) | `@afenda/auth` | **Who** is this user? (identity, session) |
| Authorization (Foundation phase 05) | `@afenda/permissions` | **May** this actor act in this scope? |

Better Auth confirms identity only. It never stores tenant/company/role fields. The `AfendaAuthSession` contract enforces this boundary.

---

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `BETTER_AUTH_SECRET` | Yes | Min 32 chars. Generate: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Yes | Full base URL — `http://localhost:3000` local, `https://erp.afenda.app` prod |

`hasBetterAuthConfig(env)` returns `false` when either is missing — use in bootstrap guards.

---

## Package structure

```
packages/auth/src/
  auth.config.ts         ← betterAuth() factory; singleton config
  auth.server.ts         ← getAuth(), getAfendaAuthSession(), requireAfendaAuthSession()
  auth.client.ts         ← authClient, signIn, signOut, signUp, useSession
  auth.hooks.ts          ← createAfendaAuthAuditHooks() — after-hook audit writers
  auth.audit.ts          ← buildAuthAuditPayload(), persistAuthAuditEvent()
  auth.actor-resolution.ts ← resolvePlatformActorUserId() — auth user → platform user bridge
  auth.session.ts        ← normalizeAfendaAuthSession(), toAfendaAuthIdentity()
  auth.contract.ts       ← AfendaAuthSession, AUTH_EVENT, extension points
  auth.env.ts            ← getBetterAuthSecret(), getBetterAuthUrl()
  auth.errors.ts         ← UnauthenticatedError, MissingBetterAuthSecretError
  auth.runtime.ts        ← readAuthConfigFingerprint() — env change detection
```

---

## Current config (`auth.config.ts`)

```ts
betterAuth({
  appName: "Afenda ERP",
  baseURL,                           // from BETTER_AUTH_URL
  basePath: "/api/auth",
  secret,                            // from BETTER_AUTH_SECRET (min 32 chars)
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  emailAndPassword: { enabled: true, disableSignUp: false },
  session: {
    expiresIn: 604800,               // 7 days
    updateAge: 86400,                // refresh cookie if age > 1 day
  },
  plugins: [nextCookies()],          // required for Next.js App Router cookie handling
  hooks: { after: createAfendaAuthAuditHooks() },
  trustedOrigins: [baseURL],
})
```

`nextCookies()` must stay in `plugins` — it handles `Set-Cookie` on server-rendered requests.

---

## Session access — server

```ts
import { getAfendaAuthSession, requireAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";

// Returns AfendaAuthSession | null
const session = await getAfendaAuthSession(await headers());

// Returns AfendaAuthSession or throws UnauthenticatedError
const session = await requireAfendaAuthSession(await headers());
```

`AfendaAuthSession` fields:

```ts
{
  sessionId: string;
  user: { userId, email, name, emailVerified };
  metadata: { issuedAt, expiresAt, ipAddress, userAgent, image };
}
```

Never add `tenantId`, `companyId`, or `roleId` to this contract — those belong in `@afenda/permissions` context.

---

## Session access — client

```ts
import { signIn, signOut, useSession } from "@afenda/auth/client";
// or
import { authClient } from "@afenda/auth/client";

// React hook
const { data: session, isPending } = useSession();

// Sign in
await signIn.email({ email, password, callbackURL: "/dashboard" });

// Sign out
await signOut();
```

---

## Auth singleton and fingerprinting

`getAuth()` returns a stable singleton. It rebuilds automatically when `BETTER_AUTH_SECRET` or `BETTER_AUTH_URL` changes — detected via `readAuthConfigFingerprint()`. In tests, call `resetAuthForTests()` between cases to clear the singleton and platform user cache.

---

## Auth route handler (`apps/erp/src/app/api/auth/[...all]/route.ts`)

```ts
import { getAuth } from "@afenda/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(getAuth());
export const { GET, POST } = handler;
```

The route at `/api/auth/[...all]` handles all Better Auth endpoints (sign-in, sign-out, session, OAuth callbacks, etc.).

---

## Audit hooks

`createAfendaAuthAuditHooks()` attaches an `after` hook via `createAuthMiddleware`. Currently audited events:

| Path | Events emitted |
|------|---------------|
| `/sign-in/email` success | `auth.sign_in.succeeded` + `auth.session.created` |
| `/sign-in/email` failure | `auth.sign_in.failed` |
| `/sign-out` | `auth.sign_out` + `auth.session.invalidated` |

**Audit failures are swallowed** — they must not block auth flows. This is intentional (`persistAuthAuditEvent` wraps writes in try-catch).

**Adding a new audited event:**

```ts
// auth.hooks.ts — extend handleAfendaAuthAuditHook()
if (ctx.path === "/update-password" && ctx.context.session) {
  await persist({
    event: AUTH_EVENT.sessionCreated,   // reuse or add to AUTH_EVENT
    result: "success",
    context: { authUserId: ctx.context.session.user.id, correlationId },
  });
}
```

---

## Platform actor resolution

Better Auth uses its own `user.id` (UUID). The platform `users` table has its own UUID (`users.id`). They are linked in `@afenda/database` via `findPlatformUserIdByAuthUserId()`.

`resolvePlatformActorUserId(context)` resolves auth user → platform user ID with an in-process LRU cache (max 256 entries). Use `actorFromAuthSession(session)` in `@afenda/permissions` to get the authorization actor — it reads `session.user.userId` which is the platform user ID after normalization.

---

## Adding plugins

### Social provider (OAuth)

```ts
// auth.config.ts
betterAuth({
  // ...
  socialProviders: {
    google: {
      clientId: env["GOOGLE_CLIENT_ID"]!,
      clientSecret: env["GOOGLE_CLIENT_SECRET"]!,
    },
  },
})
```

Add env vars to `.env.local`, `.env.production`, and `server-env.ts` validation.

### Email verification

```ts
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
},
emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    // Send via your transactional email service
  },
},
```

### Password reset

```ts
emailAndPassword: {
  enabled: true,
  revokeSessionsOnPasswordReset: true,
  sendResetPassword: async ({ user, url }) => {
    // Send via your transactional email service
  },
},
```

### Two-factor authentication (planned — `AFENDA_AUTH_EXTENSION_POINTS.mfa`)

```ts
import { twoFactor } from "better-auth/plugins";

plugins: [nextCookies(), twoFactor()],
```

Add `twoFactorClient()` to `authClient` in `auth.client.ts`. Run `npx @better-auth/cli generate` to get new schema migrations.

### Passkey (planned — `AFENDA_AUTH_EXTENSION_POINTS.passkey`)

```ts
import { passkey } from "@better-auth/passkey";

plugins: [nextCookies(), passkey()],
```

Requires HTTPS in production. Works with `passkey.signIn()` on the client.

### Multi-session

```ts
import { multiSession } from "better-auth/plugins";

plugins: [nextCookies(), multiSession()],
```

Allows users to maintain multiple active sessions. Use `authClient.multiSession.listDeviceSessions()`.

### Rate limiting

```ts
betterAuth({
  rateLimit: {
    window: 60,      // seconds
    max: 10,         // max requests per window
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
})
```

### SSO (planned — `AFENDA_AUTH_EXTENSION_POINTS.enterpriseSso`)

```ts
import { sso } from "better-auth/plugins";

plugins: [nextCookies(), sso()],
```

Supports SAML and OIDC providers. Initiate with `authClient.signIn.sso({ organizationSlug, callbackURL })`.

---

## Adding a new AUTH_EVENT

```ts
// auth.contract.ts — extend AUTH_EVENT
export const AUTH_EVENT = {
  // existing...
  passwordReset: "auth.password.reset",
  emailVerified: "auth.email.verified",
} as const;
```

Reference in hooks and audit writers via `AUTH_EVENT.passwordReset` — never inline strings.

---

## Testing

```ts
import { resetAuthForTests } from "@afenda/auth";

afterEach(async () => {
  resetAuthForTests();  // clears singleton + platform user cache
});
```

For integration tests, use Better Auth's `testClient` from `better-auth/test-utils` to stub auth state without real HTTP.

---

## Planned extension points (`AFENDA_AUTH_EXTENSION_POINTS`)

| Key | Status | Plugin |
|-----|--------|--------|
| `mfa` | planned | `twoFactor()` |
| `passkey` | planned | `passkey()` |
| `enterpriseSso` | planned | `sso()` |
| `invitation` | planned | custom hook |
| `organization` | planned | Better Auth `organization()` plugin or custom |

Do not add these plugins without running `npx @better-auth/cli generate` — each adds DB schema.

---

## Forbidden patterns

```ts
// ❌ Store tenant/role data on the session
const session = await requireAfendaAuthSession(headers);
const tenantId = session.tenantId;   // field doesn't exist — use permissions context

// ❌ Call requirePermission inside auth hooks
hooks: { after: createAuthMiddleware(async (ctx) => {
  await requirePermission(...);   // permissions never import auth hooks
})}

// ❌ Direct Better Auth API call from Server Components (use getAfendaAuthSession)
const result = await auth.api.getSession({ headers: rawHeaders });

// ❌ Import auth.client.ts in Server Components
import { useSession } from "@afenda/auth/client"; // "use client" only

// ❌ Generate BETTER_AUTH_SECRET shorter than 32 chars or commit it to source
```

---

## Additional resources

- Auth ADR: `packages/auth/docs/auth-provider-decision.md`
- Config: `packages/auth/src/auth.config.ts`
- Public API: `packages/auth/src/index.ts`
- Audit pipeline: `packages/auth/src/auth.audit.ts`
- Better Auth docs: https://better-auth.com/docs
- Better Auth plugins: https://better-auth.com/docs/plugins
- Next.js integration: https://better-auth.com/docs/integrations/next
- [reference.md](reference.md) — session config, cookie behavior, DB schema
