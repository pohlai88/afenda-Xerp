# Authentication Ecosystem

Governed authentication presentation for Afenda ERP — routes, copy, redirects, shell chrome, and security UX.

> **Consolidation (2026-06-26):** Legacy v1 auth shell and `(auth-v2)` parallel stack are **decommissioned**. A single auth presentation track owns all routes: `(auth)` route group, `@afenda/appshell/auth-shell`, `lib/auth/*` registries, canonical URLs without `/v2/` prefix. The `AFENDA_AUTH_SHELL_V2_DEFAULT` env toggle is removed.

## Single auth shell (canonical)

| Concern | Value |
| --- | --- |
| **URLs** | `/sign-in`, `/mfa`, `/verify-email/*`, … — no `/v2/` prefix |
| **Shell package** | `@afenda/appshell/auth-shell` → `packages/appshell/src/auth-shell/` |
| **App segment** | `apps/erp/src/app/(auth)/` |
| **Path registry** | `apps/erp/src/lib/auth/auth-path.registry.ts` — `AUTH_PATHS` |
| **Status** | **Complete** — ARCH-AUTH-002 + consolidation (2026-06-26) |

> Do **not** create `apps/erp/src/features/auth/` — ownership is route-group adapters + `lib/auth/*`.

## Lane model

App route registry (`AUTH_LANES`): `access` · `verify` · `recover` · `invite` · `workspace` · `security`.

Shell visual lanes (`AuthShellLane`): `access` · `verify` · `recover` · `error` — invite/workspace/security status routes map to `error` or dedicated app states.

| Lane | Routes | Purpose |
| --- | --- | --- |
| Access | `/sign-in`, `/sign-up`, `/otp`, `/mfa`, `/mfa/recovery` | Credential and MFA entry |
| Verify | `/verify-email`, `/verify-email/sent`, `/verify-email/expired`, `/verify-email/success` | Email verification journey |
| Recover | `/forgot-password`, `/reset-password`, `/reset-password/success` | Password recovery |
| Invite | `/invite`, `/invite/accept`, `/invite/expired` | Invitation landing and acceptance |
| Workspace | `/workspace/select`, `/organization/select` | Post-auth context selection |
| Security | `/session-expired`, `/access-denied`, `/security/review` | MFA step-up surfaces, session, access |

## Layout model

```text
@afenda/appshell/auth-shell     → lane-aware shell, visual panel, status surface
apps/erp/(auth)/_components     → AuthEntryPage, AuthForm, journey states
apps/erp/(auth)/auth.css        → form rhythm only (erp-auth-*)
packages/appshell/.../auth-shell.css → shell chrome (.af-auth-shell*)
```

Visual language: **Quiet Interfaces, Loud Decisions** — warm operational canvas, constrained form width, enterprise green/graphite accents via design-system tokens. No AI gradients, no cartoon illustrations.

## Route map

| Route | Registry id | Form / state |
| --- | --- | --- |
| `/sign-in` | `signIn` | `AuthSignInForm` |
| `/sign-up` | `signUp` | `AuthSignUpForm` |
| `/otp` | — | redirect → `/mfa?method=otp` |
| `/mfa` | `mfa` | `AuthMfaForm` |
| `/mfa/recovery` | `mfaRecovery` | `AuthMfaForm` (backup code) |
| `/verify-email` | `verifyEmail` | `AuthVerifyEmailState` |
| `/verify-email/sent` | `verifyEmailSent` | verify-email sent state |
| `/verify-email/expired` | `verifyEmailExpired` | verify-email expired state |
| `/verify-email/success` | `verifyEmailSuccess` | verify-email success state |
| `/forgot-password` | `forgotPassword` | `AuthForgotPasswordForm` |
| `/reset-password` | `resetPassword` | `AuthResetPasswordForm` |
| `/reset-password/success` | `resetPasswordSuccess` | reset success state |
| `/invite` | `invite` | invite landing |
| `/invite/accept` | `inviteAccept` | invite acceptance |
| `/invite/expired` | `inviteExpired` | invite expired |
| `/workspace/select` | `workspaceSelect` | workspace select panel |
| `/organization/select` | `organizationSelect` | organization select |
| `/session-expired` | `sessionExpired` | session expired state |
| `/access-denied` | `accessDenied` | access denied state |
| `/security/review` | `securityReview` | security review panel |
| `/auth/complete` | `postAuthComplete` | `AuthPostAuthCompleteClient` (membership redirect) |

## Redirect policy

| Event | Target |
| --- | --- |
| Sign-in success | `resolveSignInSuccessRedirect` |
| Sign-up success | `/verify-email/sent` |
| MFA challenge | `/mfa` |
| OTP alias | `/otp` → `/mfa?method=otp` |
| Password reset success | `/reset-password/success` |
| Unauthenticated protected | `/sign-in?next=` |
| Unlinked session | `/access-denied?reason=unlinked` |

All `next` params pass through `resolveSafeInternalPath` — no open redirects.

## Security UX rules

| Do | Do not |
| --- | --- |
| Use `AUTH_SAFE_ERRORS` for user-facing failures | Expose raw Better Auth/provider messages |
| Use centralized path/copy/link registries | Hardcode routes or legal URLs per page |
| Mark auth pages `noindex` via `internalErpMetadata` | Index functional auth surfaces |
| Preserve safe `next` via `resolveSafeInternalPath` | Allow open redirects |
| Show generic recovery copy on forgot-password | Leak whether an email exists |

## File ownership

| Path | Owns |
| --- | --- |
| `apps/erp/src/lib/auth/*` | Canonical paths, copy, redirects, public routes, tenant brand resolver |
| `apps/erp/(auth)/_components/*` | Form compounds and journey states |
| `packages/appshell/src/auth-shell/` | Visual shell + Storybook fixtures |
| `packages/auth/src/auth.config.ts` | Better Auth verification redirect |

## Test evidence

```bash
pnpm check:auth-shell-boundary
pnpm ui:guard:scan
pnpm vitest run "apps/erp/src/lib/auth" "apps/erp/src/app/(auth)" "packages/appshell/src/auth-shell"
pnpm --filter @afenda/appshell test:run
pnpm --filter @afenda/erp exec vitest run "src/lib/auth" "src/app/(auth)"
```

## OAuth

Platform OAuth uses Better Auth social providers. Set `AFENDA_OAUTH_*_CLIENT_ID` in `.env.config` or `.env.secret` and matching `AFENDA_OAUTH_*_CLIENT_SECRET` in `.env.secret`, then run `pnpm env:sync`.

## Better Auth + Next.js (ERP wiring)

Afenda follows [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next-js):

| Better Auth doc | Afenda location |
|-----------------|-----------------|
| `api/auth/[...all]/route.ts` + `toNextJsHandler(auth)` | `apps/erp/src/app/api/auth/[...all]/route.ts` → `toNextJsHandler(getAuth())` |
| `createAuthClient` from `better-auth/react` | `packages/auth/src/auth.client.ts` → `authClient` / `signIn` exports |
| `basePath: "/api/auth"` | `packages/auth/src/auth.config.ts` |
| `nextCookies()` plugin **last** in `plugins` | `packages/auth/src/auth.config.ts` |
| `auth.api.getSession({ headers })` in RSC / server actions | `getAfendaAuthSession()` / `requireAfendaAuthSession()` in `@afenda/auth` |
| Next.js 16 `proxy.ts` + cookie check | `apps/erp/src/proxy.ts` uses `getSessionCookie()` for optimistic redirects only |
| Per-route session validation | `apps/erp/src/lib/auth/require-session.ts` → full DB session via `requireAfendaAuthSession()` |

**Proxy vs page guards:** `proxy.ts` intentionally uses cookie presence only (Better Auth recommendation) for fast redirects. Protected ERP surfaces must still call `requireAfendaAuthSession()` (or membership APIs) — never trust the proxy cookie check alone.

**Server actions:** Sign-in forms use the React client (`authClient.signIn.*`). Server actions that mutate auth cookies rely on `nextCookies()` being registered on the auth instance.

## Better Auth + PostgreSQL (ERP wiring)

Afenda uses [Better Auth with PostgreSQL](https://better-auth.com/docs/adapters/postgresql) via the **Drizzle adapter**, not a raw `pg.Pool` in `auth.ts`:

| Better Auth doc | Afenda location |
|-----------------|-----------------|
| `database: new Pool({ connectionString })` | `drizzleAdapter(getAuthDb(), { provider: "pg", schema: authSchema })` in `packages/auth/src/auth.config.ts` |
| Postgres connection | `packages/database/src/auth-db.ts` → `createPgPool()` → Supabase URL via `resolveDatabaseUrlForConsumer("auth-db-pool")` |
| Auth tables schema | `packages/database/src/schema/auth.schema.ts` — `auth_user`, `auth_session`, `auth_account`, … in **`public`** (prefixed table names) |
| Platform identity bridge | `auth_identity_links` — never use `auth_user.id` as platform `actorUserId` |
| `npx auth migrate` / `generate` | **Do not use for production schema** — Afenda uses Drizzle Kit: `pnpm db:generate` + governed journal (`migration-governance.contract.ts`) |
| Non-default Postgres schema (`search_path=auth`) | **Not used** — auth tables live in `public` with `auth_*` prefixes; Drizzle `schemaFilter: ["public"]` |
| `experimental: { joins: true }` | **Not enabled** — optional future performance tuning for `/get-session` |

**Schema changes:** edit `auth.schema.ts` → `pnpm db:generate` → add governance rule → `pnpm --filter @afenda/database test:run`. Never hand-edit `.sql` migrations or run `drizzle-kit push`.

## Better Auth + Drizzle adapter (ERP wiring)

Afenda follows [Better Auth Drizzle ORM adapter](https://better-auth.com/docs/adapters/drizzle) patterns with governed schema ownership:

| Better Auth Drizzle doc | Afenda |
|-------------------------|--------|
| `@better-auth/drizzle-adapter` / `drizzleAdapter(db, …)` | `import { drizzleAdapter } from "better-auth/adapters/drizzle"` in `auth.config.ts` (bundled with `better-auth`) |
| `provider: "pg"` | `provider: "pg"` on Supabase Postgres |
| Pass `schema` object to adapter | `authSchema` in `packages/database/src/schema/auth.schema.ts` |
| Modify table names (`user: schema.users`) | Manual map: `user → authUser` (`auth_user` table), `session → authSession`, … — see `authSchema` export |
| Modify field names in Drizzle columns | Snake_case SQL columns (`email_verified`, `created_at`) with camelCase TS properties — no `user.fields` override needed |
| `usePlural: true` | **Not used** — explicit `auth_*` table prefix instead |
| `npx auth generate` then `drizzle-kit generate` | **`pnpm db:generate`** only (repo Drizzle Kit + migration governance); `@better-auth/cli` is reference/dev only |
| `experimental: { joins: true }` | **Not enabled** — requires Drizzle `relations()` on auth tables (not defined today) |
| Session `additionalFields` | `activeWorkspaceId` → `auth_session.active_workspace_id` (operating context, not tenant RBAC) |

**Adapter schema registry** (keys are Better Auth model names; SQL tables are prefixed):

```ts
export const authSchema = {
  user: authUser,           // table auth_user
  session: authSession,     // table auth_session
  account: authAccount,
  verification: authVerification,
  passkey: authPasskey,     // table passkey
  twoFactor: authTwoFactor,
  ssoProvider: authSsoProvider,
} as const;
```

OAuth/SSO `callbackURL` points at `/auth/complete` (not `/` directly) so membership validation runs before ERP entry.

Provider redirect URIs (local): `http://localhost:3000/api/auth/callback/google` and `.../github`. Microsoft social OAuth is not supported — enterprise SSO may still use Microsoft IdP separately.

### Google (Better Auth)

Afenda maps [Better Auth Google OAuth](https://better-auth.com/docs/authentication/google) to platform env — not `GOOGLE_CLIENT_ID`:

| Better Auth doc | Afenda env / config |
|-----------------|---------------------|
| `baseURL` / `BETTER_AUTH_URL` | `BETTER_AUTH_URL` in `.env.config` → `resolveBetterAuthBaseUrl()` |
| `clientId` | `AFENDA_OAUTH_GOOGLE_CLIENT_ID` |
| `clientSecret` | `AFENDA_OAUTH_GOOGLE_CLIENT_SECRET` |
| Redirect `…/api/auth/callback/google` | Same (Better Auth default; must match Google Cloud Console) |
| `signIn.social({ provider: "google" })` | ERP sign-in forms with `callbackURL` → post-auth complete |

**Google Cloud Console**

1. **APIs & Services → Credentials → Create OAuth client ID** (Web application).
2. **Authorized redirect URIs:**
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
3. Copy Client ID and Client Secret into Afenda env, then `pnpm env:sync`.

**Runtime wiring**

- `BETTER_AUTH_URL` must match the ERP public origin — Better Auth uses it to build the callback URL sent to Google (`redirect_uri_mismatch` if wrong).
- `socialProviders.google` uses `prompt: "select_account"` (Better Auth account-picker guidance) and `disableImplicitSignUp: true`.
- Tenant must enable Google under System Admin → Integrations → Social OAuth.
- OAuth sign-up requires a pending invitation when the invitation gate is enabled; Google email must match the invite.

**Optional Better Auth options (not enabled by default)**

- **Google Workspace only:** set `hd: "company.com"` on the provider (future tenant setting).
- **Refresh tokens:** `accessType: "offline"` + `prompt: "select_account consent"` (only if ERP needs long-lived Google API access).
- **Cross-platform ID tokens:** pass `clientId` as an array for web + iOS + Android (mobile not in ERP scope today).

### GitHub (Better Auth)

Afenda maps [Better Auth GitHub OAuth](https://better-auth.com/docs/authentication/github) to platform env — not `GITHUB_CLIENT_ID`:

| Better Auth doc | Afenda env |
|-----------------|------------|
| `clientId` | `AFENDA_OAUTH_GITHUB_CLIENT_ID` |
| `clientSecret` | `AFENDA_OAUTH_GITHUB_CLIENT_SECRET` |
| Redirect `…/api/auth/callback/github` | Same (Better Auth default) |
| `signIn.social({ provider: "github" })` | ERP sign-in forms (legacy + V2) |

**GitHub Developer Portal**

1. Create an OAuth App or GitHub App at [github.com/settings/developers](https://github.com/settings/developers).
2. Authorization callback URL: `http://localhost:3000/api/auth/callback/github` (production: your ERP origin + same path).
3. **GitHub Apps only:** enable *Permissions → Account → Email addresses → Read-only* (OAuth Apps rely on Better Auth’s default `user:email` scope).

**Runtime wiring**

- `resolveBetterAuthSocialProviders()` registers `socialProviders.github` with `scope: ["read:user", "user:email"]` and `mapProfileToUser` fallback per [Handling Providers Without Email](https://better-auth.com/docs/concepts/oauth#handling-providers-without-email).
- Tenant must enable GitHub under System Admin → Integrations → Social OAuth.
- OAuth sign-up still requires a pending invitation when the invitation gate is enabled; the GitHub email must match the invite (private-primary-email users need `user:email` / GitHub App email permission).

**Troubleshooting `email_not_found`**

- GitHub App missing email read permission, or user’s primary email is private and no verified address was returned — fix permissions or use an invited email visible to GitHub OAuth.
- GitHub OAuth apps do not issue refresh tokens (Better Auth documents this); access tokens remain valid until revoked or unused for a year.

## Better Auth + Two-Factor Authentication (ERP wiring)

Afenda implements [Better Auth 2FA](https://better-auth.com/docs/plugins/2fa) end-to-end:

| Better Auth 2FA doc | Afenda |
|---------------------|--------|
| `twoFactor()` server plugin | `packages/auth/src/auth.config.ts` — `allowPasswordless: true`, `backupCodeOptions: { amount: 10 }`, `otpOptions.sendOTP` → Resend |
| TOTP issuer / `appName` | `appName: "Afenda ERP"` in `auth.config.ts` |
| `twoFactorClient()` | `packages/auth/src/auth.client.ts` |
| `twoFactorRedirect` + `twoFactorMethods` on sign-in | `readSignInTwoFactorChallenge()` in `apps/erp/src/lib/auth/is-sign-in-two-factor-redirect.ts` |
| Redirect to 2FA page (`onTwoFactorRedirect` / `twoFactorPage`) | **Custom:** `signIn.email` `onSuccess` → `persistMfaChallengeAction` → `/mfa` (no full-page `twoFactorPage` reload) |
| `twoFactor.verifyTotp` / `verifyOtp` / `verifyBackupCode` | `SignInMfaStep` in `(auth)` — all use `trustDevice: true` |
| `twoFactor.sendOtp` | Auto-sent when OTP mode selected; Resend email via `createAuthTwoFactorOtpSender` |
| Enable / disable 2FA | User settings → `twoFactor.enable` / `twoFactor.disable` (`user-security-settings-panel.tsx`) |
| Schema: `user.twoFactorEnabled` + `twoFactor` table | `auth_user.two_factor_enabled` + `auth_two_factor` (`authSchema.twoFactor`) |
| `npx auth migrate` / `generate` | **`pnpm db:generate`** + Drizzle governance (same as other auth tables) |

**Sign-in flow (credential + 2FA)**

1. User submits email/password on sign-in form.
2. Better Auth returns `twoFactorRedirect: true` and `twoFactorMethods` (e.g. `["totp","otp"]`) — no session until verification.
3. ERP persists allowed methods in an HttpOnly signed cookie (`afenda-mfa-challenge`, 5 min).
4. User lands on `/mfa` → TOTP, email OTP, or backup code.
5. On success → membership API → workspace/home.

**2FA scope (Better Auth defaults + Afenda policy)**

- **Email/password sign-in:** 2FA enforced when `twoFactorEnabled` is true (Better Auth credential endpoints).
- **OAuth / passkey / SSO:** gated when `AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR=enforce-all` — post-auth complete redirects to MFA step-up if `twoFactorEnabled`
- **Tenant MFA policy:** `assertTenantMfaPolicySatisfied()` can require 2FA enrollment before ERP access (separate from sign-in challenge).

## Better Auth + Multi Session (ERP wiring)

Afenda implements [Better Auth Multi Session](https://better-auth.com/docs/plugins/multi-session) for **same-user, multi-device session management** — not a multi-account switcher in the shell.

| Better Auth Multi Session doc | Afenda |
|-------------------------------|--------|
| `multiSession()` server plugin | `packages/auth/src/auth.config.ts` — default options (no `maximumSessions` override → Better Auth default **5** sessions per device) |
| `multiSessionClient()` | `packages/auth/src/auth.client.ts` — exports `multiSession` |
| `multiSession.listDeviceSessions()` | User settings → `user-security-settings-panel.tsx` — lists sessions with IP, user-agent, created time |
| `multiSession.revoke({ sessionToken })` | Same panel — revoke one session; “Sign out other devices” revokes all non-current tokens in a loop |
| `multiSession.setActive({ sessionToken })` | **Not used in UI** — no in-browser account/session switcher |
| `signOut()` revokes all sessions | **Yes** — `SignOutButton` calls `signOut()` from `@afenda/auth/client` |
| `changePassword({ revokeOtherSessions: true })` | **Yes** — `user-profile-settings-panel.tsx` revokes other sessions on password change |
| Device session contract | `AfendaAuthDeviceSession` + `parseAfendaAuthDeviceSessions()` in `auth.client.contract.ts` |
| ERP audit on revoke | `recordUserSessionRevokedAction` → `user.session.revoked` (settings audit registry) |
| Integration test | `auth.integration.test.ts` — repeated sign-in with distinct user-agents → `listDeviceSessions` ≥ 2 |

**User settings flow (Security tab)**

1. On load, panel calls `authClient.getSession()` + `multiSession.listDeviceSessions()`.
2. Current session is highlighted; other rows show revoke actions.
3. “Sign out other devices” revokes every session token except the active one.
4. Passkeys and MFA enrollment live in the same panel (separate from multi-session cookies).

**Sign-out flow**

1. App shell / security review uses `SignOutButton` → `signOut()`.
2. Better Auth multi-session plugin clears/revokes sessions per plugin rules; ERP redirects to `/sign-in`.

**Afenda scope vs Better Auth doc**

- Better Auth describes switching between **different accounts** in one browser via extra session cookies. Afenda product use is **security self-service**: see where you are signed in and revoke stale devices.
- No ERP UI calls `setActive` — users do not pick among parallel signed-in accounts from the shell.
- Session cap is the plugin default unless product later sets `multiSession({ maximumSessions: N })` in `auth.config.ts`.

## Better Auth + Passkey (ERP wiring)

Afenda implements [Better Auth Passkey](https://better-auth.com/docs/plugins/passkey) (SimpleWebAuthn) for passwordless sign-in and authenticated enrollment:

| Better Auth Passkey doc | Afenda |
|-------------------------|--------|
| `@better-auth/passkey` server plugin | `packages/auth/src/auth.config.ts` — `origin`, `rpID`, `rpName` from `BETTER_AUTH_URL` / `resolveBetterAuthWebAuthn*` |
| `registration.requireSession: true` | **Yes** — passkeys are added only while signed in (user settings), not passkey-first onboarding |
| `registration.resolveUser` / `context` | **Not used** — no pre-auth passkey registration |
| `passkeyClient()` | `packages/auth/src/auth.client.ts` — exports `passkey`, `signIn.passkey` |
| `passkey.addPasskey` | User settings → `user-security-settings-panel.tsx` (`passkey.addPasskey({})`) |
| `passkey.listUserPasskeys` / `deletePasskey` | Same panel — list + delete with `resolvePasskeyDisplayLabel()` (`auth.passkey-label.ts`, `getAuthenticatorName`) |
| `passkey.updatePasskey` (rename) | **Not exposed in UI** — API available via Better Auth client if product adds rename later |
| `signIn.passkey` | `(auth)` sign-in form — button when `AFENDA_AUTH_PASSKEY !== "disabled"` |
| Post-auth redirect | `router.replace(postAuthCompletePath)` → `/auth/complete` → membership API (same as OAuth/SSO) |
| Conditional UI (`autoFill: true`, `autocomplete="… webauthn"`) | **Enabled** — `(auth)` sign-in form preloads passkeys when supported |
| Schema: `passkey` table | `authSchema.passkey` in `packages/database/src/schema/auth.schema.ts` — migration `20260625152759_passkey` |
| `npx auth migrate` / `generate` | **`pnpm db:generate`** + Drizzle governance (same as other auth tables) |
| Audit events | `auth.hooks.audit.ts` — `passkeyRegistered`, `passkeyDeleted`, `passkeySignInSucceeded` / `passkeySignInFailed` |
| 2FA interaction | Passkey/OAuth/SSO gated when `AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR=enforce-all` via post-auth MFA step-up |

**Sign-in flow (passkey)**

1. User clicks “Sign in with passkey” on `/sign-in` (when enabled).
2. Browser WebAuthn ceremony via `signIn.passkey()` (no `autoFill` preload).
3. On success → `/auth/complete` → workspace/home via membership API.

**Enrollment flow (session required)**

1. User opens ERP user settings → Security.
2. While authenticated, `passkey.addPasskey({})` registers a platform or cross-platform credential.
3. List shows friendly labels via stored `name`, else `getAuthenticatorName(aaguid)`, else `"Passkey"`.

**Configuration**

| Variable / option | Role |
|-------------------|------|
| `BETTER_AUTH_URL` | Drives WebAuthn `origin` and `rpID` (hostname) |
| `AFENDA_AUTH_PASSKEY=disabled` | Hides passkey button on sign-in surfaces (plugin remains on server) |
| `rpName` | `"Afenda ERP"` (`resolveBetterAuthWebAuthnRpName`) |

**Not implemented (Better Auth doc features)**

- Passkey-first registration (`requireSession: false`, `generatePasskeyRegistrationOptions` + `context`)
- Server `registration.afterVerification` default naming (client empty name → UI fallback only)
- Custom `authenticatorSelection`, `webAuthnChallengeCookie`, or WebAuthn extensions (`credProps`, PRF)

## Better Auth Username plugin — not enabled

Afenda does **not** use the [Better Auth Username plugin](https://better-auth.com/docs/plugins/username). ERP sign-in is **email + password** only (`signIn.email`), with invitation-gated sign-up.

| Better Auth Username doc | Afenda status |
|--------------------------|---------------|
| `username()` server plugin | **Not installed** |
| `usernameClient()` | **Not installed** |
| `auth_user.username` / `displayUsername` columns | **Not in schema** — `auth.schema.ts` has email only |
| `signIn.username` | **Not used** — sign-in forms collect work email |
| `signUp.email` + `username` field | **Not used** — sign-up uses email + display name |
| `/sign-in/username` 2FA gating | N/A — credential 2FA applies to `/sign-in/email` only today |

**Why:** Enterprise ERP identity is email-centric (invitations, membership matching, audit, Resend delivery). Adding usernames would require schema migration, plugin wiring, sign-in/sign-up UI, and a product decision on enumeration (`/is-username-available`).

## Better Auth Magic link plugin — not enabled

Afenda does **not** use the [Better Auth Magic link plugin](https://better-auth.com/docs/plugins/magic-link). Passwordless entry uses **OAuth, passkey, and SSO** — not email magic links.

| Better Auth Magic link doc | Afenda status |
|----------------------------|---------------|
| `magicLink({ sendMagicLink })` server plugin | **Not installed** |
| `magicLinkClient()` | **Not installed** |
| `signIn.magicLink({ email, callbackURL })` | **Not used** |
| `/sign-in/magic-link`, `/magic-link/verify` | **Not exposed** |
| Auto sign-up on magic link (unless `disableSignUp`) | **N/A** — Afenda uses invitation gate for new users |

**What Afenda uses instead for email-based auth**

- **Sign-in:** email + password (`signIn.email`) with optional 2FA challenge
- **Sign-up:** email + password with verification email (`requireEmailVerification: true`)
- **Passwordless:** Google / GitHub OAuth, passkey, enterprise SSO — all land on `/auth/complete` for membership routing
- **Transactional email:** Resend for verification, password reset, 2FA OTP, and invitations — not magic-link login URLs

**Why magic link is off:** Invitation-gated onboarding and tenant membership validation assume explicit credential or federated sign-in flows. Magic link auto-sign-up would bypass the invitation before-hook unless custom `disableSignUp` + hook wiring were added.

## Better Auth Email OTP plugin — not enabled (2FA OTP is separate)

Afenda does **not** use the [Better Auth Email OTP plugin](https://better-auth.com/docs/plugins/email-otp) (`emailOTP` / `emailOTPClient`). Do not confuse it with **two-factor email OTP**, which is part of the `twoFactor()` plugin.

| Better Auth Email OTP doc | Afenda status |
|---------------------------|---------------|
| `emailOTP({ sendVerificationOTP })` | **Not installed** |
| `emailOTPClient()` | **Not installed** |
| `signIn.emailOtp` (passwordless sign-in) | **Not used** |
| OTP types `sign-in` / `email-verification` / `forget-password` | **Not used** |
| `/email-otp/*` endpoints | **Not exposed** |

**What Afenda uses instead**

| Flow | Mechanism |
|------|-----------|
| Sign-in | Email + password (`signIn.email`) — not OTP-only sign-in |
| Email verification | **Link** via `emailVerification.sendVerificationEmail` (Resend) |
| Password reset | **Link/token** via `emailAndPassword.sendResetPassword` (Resend) |
| 2FA email code | **`twoFactor()` `otpOptions.sendOTP`** — sent only during MFA step after password sign-in (`twoFactor.sendOtp` / `verifyOtp`) |
| `/otp` route | **Alias** → `/mfa?method=otp` (2FA entry), not passwordless Email OTP plugin |

**Why Email OTP plugin is off:** Passwordless `signIn.emailOtp` auto-sign-up conflicts with invitation gate. Verification and reset already use link-based email flows; adding `emailOTP` would duplicate Resend delivery paths unless product replaces links with OTP codes.

## Better Auth Last login method — Afenda-native (cookie)

Afenda does **not** use the [Better Auth Last login method plugin](https://better-auth.com/docs/plugins/last-login-method) on the pinned Better Auth version. Sign-in UX uses an Afenda client cookie instead:

| Concern | Afenda |
|---------|--------|
| Cookie | `afenda-last-used-login-method` (30 days) |
| Set on success | `(auth)` via `setLastUsedLoginMethod()` |
| UI | `formatSignInMethodLabel()` appends `· Last used` on matching buttons |
| Methods | `email`, `google`, `github`, `passkey`, `sso` |
| Better Auth `lastLoginMethod()` plugin | **Not installed** — Afenda-native cookie only (no DB field) |

## Better Auth One-Time Token plugin — not enabled

Afenda does **not** use the [Better Auth One-Time Token (OTT) plugin](https://better-auth.com/docs/plugins/one-time-token) (`oneTimeToken` / `oneTimeTokenClient`). There is no generate/verify OTT flow for cross-domain session handoff.

| Better Auth OTT doc | Afenda status |
|---------------------|---------------|
| `oneTimeToken()` server plugin | **Not installed** — not in `packages/auth/src/auth.config.ts` `plugins[]` |
| `oneTimeTokenClient()` | **Not installed** — not in `packages/auth/src/auth.client.ts` |
| `GET /one-time-token/generate` (requires session) | **Not exposed** |
| `POST /one-time-token/verify` → returns attached session | **Not exposed** |
| `expiresIn`, `storeToken` (plain/hashed/custom) | **N/A** |
| `disableClientRequest` (server-only generation) | **N/A** |
| Cross-domain auth via OTT link | **Not implemented** |

**What Afenda uses instead**

| Need | Mechanism |
|------|-----------|
| Same-origin session after sign-in | Better Auth session cookies + `nextCookies()` on `/api/auth/*` — ERP and auth share the app origin (`BETTER_AUTH_URL`) |
| Post-auth routing | `/auth/complete` + membership API (OAuth, passkey, SSO, email) |
| MFA step without full session | HttpOnly HMAC-signed `afenda-mfa-challenge` cookie (5 min) with optional Upstash Redis store — not an OTT |
| Email verification / password reset | Better Auth **`auth_verification`** table + link tokens (`/verify-email`, reset flows) — not OTT |
| Invitation-gated sign-up | `invitationToken` query param + `auth.hooks.invitation` before-hook — not OTT |
| Trusted cross-origin callers | `trustedOrigins` in `auth.config.ts` — not session export via OTT |

**Why OTT is off:** Afenda ERP runs Better Auth on the same Next.js app as the UI (`basePath: /api/auth`). Cross-domain “export session to another origin” is not a current product requirement. Adding OTT would introduce a second single-use token channel alongside verification, reset, invitation, and MFA challenge cookies unless scoped to a specific subdomain/mobile handoff slice.

**If product wants this later**

1. Add `oneTimeToken()` before `nextCookies()` and `oneTimeTokenClient()` to `auth.client.ts`.
2. Prefer `storeToken: "hashed"` for production; set `expiresIn` to the minimum viable handoff window.
3. Restrict verify to a dedicated server route with origin checks — do not expose raw session export to arbitrary client origins without an ADR.

## Better Auth Open API plugin — not enabled

Afenda does **not** use the [Better Auth Open API plugin](https://better-auth.com/docs/plugins/open-api) (`openAPI()`). There is no Scalar reference UI or machine-generated OpenAPI schema for `/api/auth/*` endpoints.

| Better Auth Open API doc | Afenda status |
|--------------------------|---------------|
| `openAPI()` server plugin | **Not installed** — not in `packages/auth/src/auth.config.ts` `plugins[]` |
| Scalar UI at `/api/auth/reference` (default) | **Not served** — `apps/erp/src/app/api/auth/[...all]/route.ts` forwards only to Better Auth handlers |
| `auth.api.generateOpenAPISchema()` | **Not available** — no `/api/auth/open-api/generate-schema` |
| `path`, `theme`, `disableDefaultReference` | **N/A** |
| `nonce` for CSP inline scripts | **N/A** — plugin not wired; ERP enforces nonce CSP in production (`apps/erp/src/proxy.ts`) |
| Scalar multi-source docs (`sources: [{ url: "…/generate-schema" }]`) | **Not integrated** |

**What Afenda uses instead**

| Need | Mechanism |
|------|-----------|
| Auth endpoint contract evidence | `@afenda/auth` integration tests — `auth.integration.test.ts`, `auth.client.test.ts`, plugin surface checks |
| ERP ↔ auth wiring map | [`authentication-ecosystem.md`](authentication-ecosystem.md) — Better Auth plugin sections (2FA, passkey, multi-session, OAuth, etc.) |
| Extension point registry | `AFENDA_AUTH_EXTENSION_POINTS` in `packages/auth/src/auth.contract.ts` |
| Governed ERP REST OpenAPI | **P2 / blocked** — ARCH-API-001 + TIP-031; separate from Better Auth; not in current release |
| Public API docs site | Fumadocs (`apps/docs`) — architecture/governance MDX, not live Better Auth Scalar |

**Why Open API plugin is off**

- **Security:** Interactive “Try it out” against production auth endpoints is undesirable on ERP without environment gating; Scalar loads third-party UI scripts that must align with CSP allowlist + nonce pipeline.
- **Authority:** Afenda documents auth behavior through ARCH/FDR slices, integration tests, and `authentication-ecosystem.md` — not an auto-generated catalog that can drift from invitation/MFA/OAuth policy.
- **Scope:** ERP public OpenAPI (Kong/catalog) is explicitly deferred P2; Better Auth schema generation is a separate decision.

**If product wants this later**

1. Enable **dev/staging only** (env flag) — never expose Scalar reference on production without security review.
2. Add `openAPI({ nonce: getCspNonce() })` when wiring into ERP so inline Scalar scripts pass CSP.
3. Prefer `disableDefaultReference: true` + export JSON schema to internal docs if interactive testing is not required.

## Better Auth JWT plugin — not enabled

Afenda does **not** use the [Better Auth JWT plugin](https://better-auth.com/docs/plugins/jwt) (`jwt()` / `jwtClient()`). ERP authentication is **session-cookie first** — not JWT tokens for browser or internal API auth.

| Better Auth JWT doc | Afenda status |
|---------------------|---------------|
| `jwt()` server plugin | **Not installed** — not in `packages/auth/src/auth.config.ts` `plugins[]` |
| `jwtClient()` + `authClient.token()` | **Not installed** — not in `packages/auth/src/auth.client.ts` |
| `GET /api/auth/token` | **Not exposed** |
| `GET /api/auth/jwks` | **Not exposed** |
| `set-auth-jwt` header on `getSession` | **Not used** |
| Schema: `jwks` table | **Not in schema** — no `jwks` table in `auth.schema.ts` |
| `definePayload`, key rotation, custom adapter | **N/A** |
| [Bearer plugin](/docs/plugins/bearer) (JWT-as-Authorization) | **Not installed** — no `bearer()` in auth config |

**What Afenda uses instead**

| Need | Mechanism |
|------|-----------|
| Browser / ERP session | Better Auth **session cookies** + `nextCookies()` — proxy checks `getSessionCookie()` (`apps/erp/src/proxy.ts`) |
| Server Components / Route Handlers | `getAfendaAuthSession(requestHeaders)` → `auth.api.getSession({ headers })` (`packages/auth/src/auth.server.ts`) |
| Governed internal REST APIs | `createApiHandler` resolves session from request headers — no Bearer JWT (`apps/erp/src/server/api/runtime/create-api-handler.ts`) |
| Client session reads | `authClient.getSession()` / `useSession()` from `@afenda/auth/client` |
| Postgres RLS tenant context | **`app.tenant_id` / `app.platform_user_id` session variables** + optional `auth.jwt()` fallback in migrations — **Supabase/Postgres JWT claims**, not Better Auth JWT plugin tokens |
| Enterprise SSO JWKS | SSO provider metadata `jwksEndpoint` for **federated IdP verification** (`auth.sso-sync.ts`) — unrelated to issuing Afenda JWTs |

**Why JWT plugin is off**

Better Auth documents JWT for **services that cannot use session cookies** (microservices, mobile backends, MCP/OIDC token exchange). Afenda ERP is a **monolithic Next.js app**: auth and UI share origin; internal APIs authenticate via cookie-backed `getSession`. Adding `/token` + `/jwks` would introduce a parallel auth surface unless a specific external service integration requires it.

**Do not confuse:** PostgreSQL policies referencing `auth.jwt() ->> 'tenant_id'` are **database RLS helpers** for Supabase-compatible claim injection — not evidence that Better Auth JWT plugin is enabled.

**If product wants this later**

1. Prefer the [Bearer plugin](https://better-auth.com/docs/plugins/bearer) when the goal is **API authentication**; use JWT plugin only when downstream services need JWKS-verifiable tokens.
2. Add `jwt()` before `nextCookies()`, migrate `jwks` table via `pnpm db:generate`, wire `jwtClient()` for any client that must call `/api/auth/token`.
3. Scope `definePayload` to platform identity fields only — do not embed tenant/workspace authorization in JWT without matching ERP permission resolver rules.
4. If OIDC/MCP plugins are added later, follow Better Auth guidance to `disabledPaths: ["/token"]` and `disableSettingJwtHeader: true` to avoid conflicting OAuth token endpoints.

## Better Auth Test Utils plugin — test-only (not in production)

Afenda follows Better Auth guidance: [`testUtils()`](https://better-auth.com/docs/plugins/test-utils) is **not** in production `packages/auth/src/auth.config.ts`. It is wired only in the **`@afenda/auth` integration test harness**.

| Better Auth Test Utils doc | Afenda |
|----------------------------|--------|
| `testUtils()` in production auth | **Not installed** — production uses `createAuthConfig()` without `testUtils` |
| Separate test-only auth instance | **Yes** — `createIntegrationTestAuth()` in `packages/auth/src/__tests__/auth.integration.test.ts` |
| `auth.$context` → `ctx.test` | **Yes** — `createIntegrationFixture()` exposes `test` helpers |
| `test.createUser` / `test.saveUser` | **Used** — seeds `_seed@internal.afenda` before scenarios |
| `test.deleteUser`, `test.login`, `getAuthHeaders`, `getCookies` | **Not used** in current suite — flows use `postAuth()` + `set-cookie` headers instead |
| `testUtils({ captureOTP: true })` | **Enabled in test auth** — `getOTP` unused today (no `emailOTP` plugin) |
| Organization factories (`createOrganization`, `addMember`) | **N/A** — Better Auth organization plugin not installed |
| Playwright E2E cookie injection | **Not wired** — no ERP E2E usage of `test.getCookies()` yet |

**Afenda test harness (beyond Better Auth defaults)**

| Concern | Mechanism |
|---------|-----------|
| Database | `memoryAdapter({})` in integration auth — not production Drizzle |
| Invitation gate | `registerAuthInvitation` + `createAfendaAuthInvitationBeforeHook(INTEGRATION_TEST_ENV)` |
| Email verification tokens | Custom `capturedVerificationTokens` map in `sendVerificationEmail` test hook — not `test.getOTP` |
| HTTP calls | `postAuth(auth, path, body, headers)` → `auth.handler(Request)` |
| Audit assertions | `createAfendaAuthAuditHooks()` with `capturedAuditEvents` spy |
| MFA / mirror / policy unit tests | Separate files with mocked `@afenda/database` — not `testUtils` |

**Production safety**

- `testUtils` adds privileged `ctx.test` helpers (direct user/session DB writes). Keeping it out of `createAuthConfig()` matches Better Auth’s recommendation and Afenda’s security posture.
- Do **not** conditionally spread `testUtils()` into production `plugins[]` for TypeScript convenience.

**If extending tests**

1. Prefer `test.login` / `getAuthHeaders` for new integration scenarios instead of hand-rolled cookie parsing when session setup gets repetitive.
2. Use `test.getCookies({ domain })` when adding Playwright auth E2E against the ERP dev server.
3. Enable `getOTP` only if Email OTP or 2FA OTP capture is needed — today 2FA OTP goes through Resend in production and is not captured via `testUtils`.

## Known gaps

None for auth shell post-login routing.

## Post-login membership

`GET /api/internal/v1/auth/memberships` validates active platform memberships after sign-in and returns `entryPath` plus workspace switch targets.

**All sign-in methods** (email, MFA, OAuth, SSO, passkey) land on `/auth/complete` when no explicit `next` path is set. That page calls the memberships API and redirects.

**MFA challenges** are stored in an HttpOnly signed cookie (`afenda-mfa-challenge`, 5-minute TTL) with optional **Upstash Redis** backing when `UPSTASH_REDIS_REST_*` is configured — not `sessionStorage`.

Workspace and organization select pages render real `ApplicationShellContextSwitchTarget` options and call `switchOperatingContextAction`.

## Security review

`/security/review` provides a checklist, support contact, sign-out, and an acknowledge action that audits `auth.security_review.acknowledged` before continuing through membership validation.

## Auth feature inventory (runtime)

| Feature | Backend | Frontend | Admin settings | Status |
| --- | --- | --- | --- | --- |
| Email/password + verification | `@afenda/auth` | `(auth)` sign-in | — | **Production** |
| OAuth (Google/GitHub) | Platform env → Better Auth | Sign-in social buttons | Integrations → OAuth allowlist | **Production** — tenant toggles gate sign-in on tenant host |
| Enterprise SSO | `sso()` + tenant provider sync | SSO email form | Integrations → SSO providers | **Production** — SSO shown only when tenant has enabled provider |
| Passkeys | `passkey()` plugin | Sign-in + `/settings/security` | Env `AFENDA_AUTH_PASSKEY` | **Production** |
| MFA (TOTP/OTP/backup) | `twoFactor()` plugin | Sign-in MFA + `/mfa` | User Security + admin Security policy | **Production** |
| Tenant MFA policy | `assertTenantMfaPolicySatisfied` | Protected layout gate → `/settings/security?notice=mfa-required` | System Admin → Security | **Production** |
| Passwordless 2FA (`enforce-all`) | `gatePasswordlessTwoFactorBeforePostAuth` | Post-auth complete → MFA step-up | Env `AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR` | **Production** — set `enforce-all` in staging to validate OAuth/passkey step-up |
| Multi-session revoke | `multiSession()` | User Security panel | — | **Production** |
| Post-auth membership routing | Memberships API | Complete page + workspace select | — | **Production** |
| Tenant auth branding | `tenant_settings.appearance` + R2 | `(auth)` layout brand panel | System Admin → Appearance | **Production** |
| Last-used login method | Client cookie | Sign-in method labels | — | **Production** |
| Passkey conditional UI | `usePasskeyConditionalUi` | Sign-in surface | — | **Production** |
| MFA challenge store | Signed cookie + optional Upstash Redis | MFA step routes | — | **Production** |
| Security review (passwordless) | Post-auth method cookie + ack cookie | `/security/review` after OAuth/passkey/SSO | Env `AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS` | **Production** — enable on staging |
| Company MFA override | `companies.mfa_required_override` | System Admin → Security company override | Same Security panel | **Production** |

### Staging validation checklist

1. Set `AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR=enforce-all` on staging.
2. Set `AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS=true` on staging (optional but recommended).
3. Sign in with Google or passkey as a user with MFA enrolled → expect redirect to `/mfa` before workspace entry.
4. Complete MFA step-up → proceed to membership/workspace; with security review enabled, acknowledge `/security/review` first.
5. Enable tenant OAuth/SSO in System Admin → Integrations → confirm sign-in surface on tenant host matches toggles.
6. Enable **Require MFA** in System Admin → Security → confirm non-MFA users redirect to `/settings/security?notice=mfa-required`.
7. Set company MFA override to **Require MFA for this company** → confirm effective enforcement updates without tenant toggle.
8. Enable Appearance branding → confirm logo/headline on `/sign-in` for tenant host (requires R2 storage env).

Automated contract coverage: `apps/erp/src/lib/auth/__tests__/auth-production-readiness.test.ts`.

## Future enhancements

- Email template branding (ARCH-EMAIL-001)
- Per-tenant OAuth client credentials (platform env owns Better Auth clients in v1)
- Deployed R2 logo smoke in preview (manual ops gate)

## Related authority

- ARCH-AUTH-002 — auth shell (consolidated 2026-06-26)
- ARCH-AUTH-003 — tenant auth branding
- ARCH-AUTH-001 — identity, mirror sync
- FDR fdr-002-auth — `PKG002_AUTH` boundaries
