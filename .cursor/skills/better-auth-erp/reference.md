# Better Auth Reference — `@afenda/auth`

## Session config defaults

| Setting | Value | Notes |
|---------|-------|-------|
| `expiresIn` | 604800s (7 days) | Session cookie lifetime |
| `updateAge` | 86400s (1 day) | Refresh cookie if session older than this |
| Cookie name | `better-auth.session_token` | Set by nextCookies() plugin |

Better Auth uses cookie-based sessions (not JWT by default). The session token is signed using `BETTER_AUTH_SECRET`.

## Cookie behavior in Next.js

`nextCookies()` plugin intercepts the Better Auth response and applies `Set-Cookie` headers to the Next.js response — required because Next.js App Router uses a separate response object. Without this plugin, sign-in/sign-out cookies will not propagate in RSC contexts.

For cross-subdomain session sharing (e.g., sharing a session between `app.afenda.app` and `api.afenda.app`), configure:

```ts
betterAuth({
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".afenda.app",
    },
  },
})
```

## Database schema (Better Auth tables)

Better Auth manages four tables via its Drizzle adapter (separate from the platform `users` table):

| Table | Purpose |
|-------|---------|
| `user` | Better Auth user record (email, name, emailVerified, image) |
| `session` | Active sessions (token, expiresAt, ipAddress, userAgent) |
| `account` | OAuth/credential account links per user |
| `verification` | Email verification and password reset tokens |

Generate or update schema: `npx @better-auth/cli generate`  
Apply: run your Drizzle migration pipeline.

> The platform `users` table (in `@afenda/database`) is separate. They are bridged via `findPlatformUserIdByAuthUserId()` in `auth-identity.service.ts`.

## Auth user → platform user bridge

```
Better Auth `user.id` (UUID)
  └─ auth_accounts.auth_user_id (FK)
       └─ platform users.auth_user_id
            └─ users.id → platform user UUID

resolvePlatformActorUserId(context)
  → checks in-process LRU cache (max 256)
  → falls back to findPlatformUserIdByAuthUserId(authUserId)
  → result cached as string | null
```

A `null` result means the Better Auth user is not yet linked to a platform user (e.g., invited but not activated). Handle this case in new user onboarding flows.

## Dynamic base URL (preview deployments)

For Vercel preview deployments where `BETTER_AUTH_URL` changes per deployment:

```ts
betterAuth({
  baseURL: process.env["VERCEL_URL"]
    ? `https://${process.env["VERCEL_URL"]}`
    : process.env["BETTER_AUTH_URL"],
  trustedOrigins: [
    process.env["BETTER_AUTH_URL"] ?? "",
    process.env["VERCEL_URL"] ? `https://${process.env["VERCEL_URL"]}` : "",
  ].filter(Boolean),
})
```

See Better Auth dynamic base URL guide: https://better-auth.com/docs/guides/dynamic-base-url

## Auth event contract reference

```ts
export const AUTH_EVENT = {
  sessionCreated:     "auth.session.created",
  sessionInvalidated: "auth.session.invalidated",
  signInFailed:       "auth.sign_in.failed",
  signInSucceeded:    "auth.sign_in.succeeded",
  signOut:            "auth.sign_out",
} as const;
```

Audit records land in `audit_events` table, `module = "auth"`, `source = "auth"`.

## Extending the auth schema

To add fields to the Better Auth `user` table:

```ts
betterAuth({
  user: {
    additionalFields: {
      displayLanguage: {
        type: "string",
        required: false,
        defaultValue: "en",
        input: true,   // allow set on sign-up
      },
    },
  },
})
```

Run `npx @better-auth/cli generate` to produce the migration. Do not add `tenantId` — workspace context is resolved via `@afenda/permissions`, not the session.

## Client plugin setup

When adding Better Auth plugins that have client-side methods:

```ts
// auth.client.ts
import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [twoFactorClient()],
});

export const { signIn, signOut, signUp, useSession, twoFactor } = authClient;
```

## Have I Been Pwned integration

Block compromised passwords at sign-up and password change:

```ts
import { haveIBeenPwned } from "better-auth/plugins";

plugins: [nextCookies(), haveIBeenPwned()],
```

Rejects passwords found in known breach databases.

## Rate limiting configuration

```ts
rateLimit: {
  enabled: true,
  window: 60,
  max: 100,
  storage: "memory",   // or "database" for distributed deployments
  customRules: {
    "/sign-in/email": { window: 60, max: 5 },
    "/forget-password": { window: 60, max: 3 },
  },
},
```

Use `"database"` storage when running multiple Next.js instances (Vercel scale-out).

## Proxy pattern (Vercel Edge)

When deployed behind a proxy, ensure IP detection works:

```ts
betterAuth({
  advanced: {
    useSecureCookies: process.env["NODE_ENV"] === "production",
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },
})
```

The existing `auth.hooks.ts` already reads `x-forwarded-for` via `readAuthRequestMeta()`.

## Auth reset in tests

```ts
import { resetAuthForTests } from "@afenda/auth";
import { resetAuthDbClient } from "@afenda/database";

afterEach(async () => {
  resetAuthForTests();          // clears auth singleton + platform user LRU cache
  await resetAuthDbClient();    // closes auth DB pool (if used in this test)
});
```

Only call `resetAuthDbClient()` in integration tests that open real DB connections.
