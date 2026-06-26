# ARCH-AUTH-002 · Slice 4 — App route consumption

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-002`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-002-auth-shell-v2.md) |
| **Prerequisite** | Slices 2–3 ✓ |
| **Slice** | 4 |
| **Status** | Not started |
| **Type** | Implementation |
| **Risk** | Medium · **Clean Core:** B |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-002/slice-04-app-route-consumption.md

1. Objective    — Build apps/erp/(auth-v2) pages as thin composition wrappers under /v2/*:
                  pass lane prop; centralize copy via lib/auth-v2 registries;
                  adopt AuthShellV2StatusSurface on verify/recover routes;
                  preserve auth provider flows without touching legacy (auth).
2. Allowed layer— apps/erp/src/app/(auth-v2)/** · apps/erp/src/lib/auth-v2/**
3. Files        —
                  apps/erp/src/app/(auth-v2)/_components/auth-v2-entry-page.tsx
                  apps/erp/src/app/(auth-v2)/_components/auth-v2-error-surface.client.tsx
                  apps/erp/src/app/(auth-v2)/v2/sign-in/page.tsx
                  apps/erp/src/app/(auth-v2)/v2/sign-up/page.tsx
                  apps/erp/src/app/(auth-v2)/v2/verify-email/page.tsx
                  apps/erp/src/app/(auth-v2)/v2/verify-email/sent/page.tsx
                  apps/erp/src/app/(auth-v2)/v2/forgot-password/page.tsx
                  apps/erp/src/app/(auth-v2)/v2/reset-password/page.tsx
                  apps/erp/src/app/(auth-v2)/error.tsx
                  apps/erp/src/app/(auth-v2)/auth-v2.css (form rhythm only)
                  apps/erp/src/app/(auth-v2)/__tests__/**
                  apps/erp/src/lib/auth-v2/auth-v2-route.registry.ts
                  docs/ARCH/slices/ARCH-AUTH-002/slice-index.md
4. Prohibited   — packages/appshell/src/auth-shell/** (legacy) · apps/erp/src/app/(auth)/**
                  · packages/ui/** · new auth provider behavior
                  · shell layout CSS in app beyond auth-v2.css form rhythm
5. Authority    — ARCH-AUTH-002 §6.4 · ARCH-AUTH-001 identity · TIP-004 consumer
6. Gates        —
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
7. Closes       — P0 app thin composition
8. Evidence     — /v2/* pages use @afenda/appshell/auth-shell-v2 only · no legacy (auth) imports
9. Attestation  — Consumer · UI governance · Regression
```

---

## Route → lane mapping (`/v2/*` — isolated from legacy `(auth)`)

| Route | Lane |
| --- | --- |
| `/v2/sign-in`, `/v2/sign-up`, `/v2/otp`, `/v2/mfa` | `access` |
| `/v2/verify-email`, `/v2/verify-email/sent`, `/v2/verify-email/success`, `/v2/verify-email/expired` | `verify` |
| `/v2/forgot-password`, `/v2/reset-password`, `/v2/reset-password/success` | `recover` |
| `/v2/error`, `error.tsx`, `/v2/access-denied`, `/v2/session-expired` | `error` |

---

## Acceptance

```text
[ ] V2 app pages do not import from apps/erp/src/app/(auth)/**
[ ] V2 pages consume @afenda/appshell/auth-shell-v2 only
[ ] AuthV2EntryPage passes lane to package shell
[ ] Copy not duplicated across page files
[ ] typecheck + erp (auth-v2) tests exit 0
```
