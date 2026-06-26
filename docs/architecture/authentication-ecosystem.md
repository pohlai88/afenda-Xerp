# Authentication Ecosystem

Governed authentication presentation for Afenda ERP — routes, copy, redirects, shell chrome, and security UX.

## Lane model

| Lane | Routes | Purpose |
|------|--------|---------|
| Access | `/sign-in`, `/sign-up`, `/otp` | Credential and alternate sign-in entry |
| Verify | `/verify-email`, `/verify-email/sent`, `/verify-email/expired`, `/verify-email/success` | Email verification journey |
| Recover | `/forgot-password`, `/reset-password`, `/reset-password/success` | Password recovery |
| Invite | `/invite`, `/invite/accept`, `/invite/expired` | Invitation landing and acceptance |
| Workspace | `/workspace/select`, `/organization/select` | Post-auth context selection (stub) |
| Security | `/mfa`, `/mfa/recovery`, `/session-expired`, `/access-denied`, `/security/review` | MFA, session, and access surfaces |

## Layout model

```
@afenda/appshell/auth-shell     → split layout, brand artifact, form column, footer slot
apps/erp/(auth)/_components     → AuthEntryPage, AuthForm, journey states, chrome
apps/erp/src/lib/auth           → path/copy/link/redirect registries
packages/auth                   → Better Auth config, email URL builders, session contracts
```

## Redirect policy

| Event | Destination |
|-------|-------------|
| Sign-in success | Safe `?next=` or `/` (workspace selector when multiple workspaces — stub) |
| Sign-up success | `/verify-email/sent` |
| Email verified (Better Auth) | `/verify-email/success` |
| Password reset success | `/reset-password/success` → sign-in with `?notice=password-reset` |
| Unauthenticated protected | `/sign-in?next=` |
| Unlinked session | `/access-denied?reason=unlinked` |
| MFA challenge | `/mfa` (challenge in `sessionStorage`) |
| OTP alias | `/otp` → `/mfa?method=otp` |
| Invite accept | `/sign-up?invitationToken=` |

## Security UX rules

| Do | Do not |
|----|--------|
| Use `AUTH_SAFE_ERRORS` for user-facing failures | Expose raw Better Auth/provider messages |
| Use centralized path/copy/link registries | Hardcode routes or legal URLs per page |
| Mark auth pages `noindex` via `internalErpMetadata` | Index functional auth surfaces |
| Preserve safe `next` via `resolveSafeInternalPath` | Allow open redirects |
| Show generic recovery copy on forgot-password | Leak whether an email exists |

## File ownership

| Path | Owns |
|------|------|
| `apps/erp/src/lib/auth/auth-path.registry.ts` | Canonical paths and lanes |
| `apps/erp/src/lib/auth/auth-route.registry.ts` | Page headings, metadata, skeleton labels |
| `apps/erp/src/lib/auth/auth-copy.registry.ts` | User-facing copy and safe errors |
| `apps/erp/src/lib/auth/auth-link.registry.ts` | Legal and support links |
| `apps/erp/src/lib/auth/auth-redirect.policy.ts` | Post-auth and security redirects |
| `apps/erp/src/lib/auth/public-routes.ts` | Proxy public route prefixes |
| `packages/appshell/src/auth-shell/` | Visual shell and footer slot |
| `packages/auth/src/auth.config.ts` | Better Auth verification redirect |

## Test evidence

```bash
pnpm sync:package-css-dist -- --package @afenda/appshell
pnpm --filter @afenda/appshell test auth-shell
pnpm --filter @afenda/erp exec vitest run "src/lib/auth" "src/app/(auth)"
pnpm --filter @afenda/auth test:run auth.email auth.config
```

## Known gaps

1. **Workspace/org selector** — `/workspace/select` and `/organization/select` are governed stubs; real selection remains `WorkspaceContextSwitcher` until operating-context slice.
2. **Organization plugin** — `organization: planned` in `@afenda/auth` contract.
3. **Post-auth membership routing** — `resolvePostAuthEntry` defaults to `/` until membership resolver exists.
4. **MFA challenge transport** — `sessionStorage` handoff; server-side short-lived flag preferred for production hardening.
5. **`/security/review`** — stub until security review product spec exists.
6. **Legal pages** — `/legal/privacy` and `/legal/terms` linked but may not exist yet.

## Future enhancements

- Wire `resolvePostAuthEntry` to membership/workspace count API
- Replace MFA `sessionStorage` with server-stored challenge token
- Full workspace selector page (ARCH-AUTH / operating-context FDR)
- Organization Better Auth plugin when `organization` extension point activates

## Related authority

- [ARCH-AUTH-001](../ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md) — identity, mirror sync, admin policy (not duplicated here)
- [FDR fdr-002-auth](../../delivery/FDR/[Complete] fdr-002-auth-disposition.md) — `PKG002_AUTH` package boundaries
