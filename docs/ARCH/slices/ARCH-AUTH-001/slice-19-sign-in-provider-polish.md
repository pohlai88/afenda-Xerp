# ARCH-AUTH-001 · Slice 19 — Sign-in OAuth / passkey / SSO polish

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 17 ✓ · Phase 3 (13a–13c) ✓ |
| **Slice** | 19 |
| **Status** | **Delivered** 2026-06-26 |
| **Type** | Implementation |
| **Risk** | Medium · **Clean Core:** B |
| **Closes** | Carry-forward — sign-in OAuth/passkey/SAML polish |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-19-sign-in-provider-polish.md

1. Objective    — Add governed sign-in surface options (social OAuth, passkey, SSO email) to ERP sign-in page using serializable server-resolved provider surface from @afenda/auth.
2. Allowed layer— packages/auth/src/ · apps/erp/src/app/(auth)/sign-in/ · apps/erp/src/lib/auth/
3. Files        —
                  packages/auth/src/auth.sign-in-surface.ts
                  packages/auth/src/__tests__/auth.sign-in-surface.test.ts
                  packages/auth/src/index.ts
                  apps/erp/src/lib/auth/resolve-sign-in-surface.server.ts
                  apps/erp/src/lib/auth/__tests__/resolve-sign-in-surface.server.test.ts
                  apps/erp/src/app/(auth)/sign-in/page.tsx
                  apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx
                  apps/erp/src/app/(auth)/sign-in/__tests__/sign-in-form.test.tsx
                  apps/erp/src/app/globals.css
                  docs/ARCH/slices/ARCH-AUTH-001/slice-19-sign-in-provider-polish.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md
                  docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/ui primitives; shadcn login blocks; @afenda/accounting; tenant secrets in client props
5. Authority    — ARCH-AUTH-001 carry-forward · FR-A06 · better-auth-erp skill · TIP-004 consumer
6. Gates        —
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:documentation-drift
7. Closes       — sign-in OAuth/passkey/SAML polish carry-forward debt
8. Evidence     — auth.sign-in-surface.ts · sign-in-form.tsx provider buttons · resolve-sign-in-surface.server.ts
9. Attestation  — Contract · Security · UI governance · Test
```

---

## Delivery evidence (2026-06-26)

- `resolveSignInProviderSurface()` in `@afenda/auth` — serializable `SignInProviderSurface` (passkey, social OAuth, SSO flags).
- `resolveSignInSurface()` server wrapper; sign-in page passes surface to client form.
- `SignInForm` alternate methods: social OAuth buttons, passkey, SSO email form; TIP-004 consumer (layout on plain HTML / `erp-sign-in-form__*` CSS).
- `@afenda/auth/client` exports surface types + `ssoClient()` plugin for `signIn.sso`.
- Tests: `auth.sign-in-surface.test.ts`, `resolve-sign-in-surface.server.test.ts`, `sign-in-form.test.tsx`.
