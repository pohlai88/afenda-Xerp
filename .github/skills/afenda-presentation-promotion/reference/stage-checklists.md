# Promotion stage checklists

## Stage A — Lab only

**Paths:** `packages/shadcn-studio/src/storybook/**` · `apps/storybook/stories/**` · `packages/shadcn-studio/docs/**`

**Allowed:** visual exploration · Storybook proof · comparison stories

**Forbidden:** ERP `/sign-in` · production auth registry · global ERP CSS

Default ERP sign-in remains `login-page-04`.

## Stage B — Auth shell candidate

**Paths:** `components-auth-shell/**` · `storybook/**`

**Required:** flat `components-auth-shell/{pattern-id}.tsx` · no `@afenda/auth` in studio · pattern id from auth-pattern-lab registry · contract + CSS ref · Storybook story

ERP `/sign-in` still untouched.

## Stage C — ERP promotion

Explicit user request only. Inspect `apps/erp/**` · `components-auth-shell/**` · `apps/erp/src/lib/auth/**`.

1. Flat `components-auth-shell/{pattern-id}.tsx`
2. Map in `resolve-auth-shell.tsx` / `AUTH_SHELL_MAP`
3. Update `auth-ingress-surface.registry.ts`
4. Document `AFENDA_AUTH_SIGN_IN_PATTERN` env — default `login-page-04`
5. `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio`
6. Gates:

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio build
pnpm check:package-css-dist-sync
pnpm check:studio-metadata-binding
pnpm check:erp-metadata-pas006-consumer
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
```

7. Document rollback (revert registry + env + block id)

## Completion report

```txt
Promotion stage: (A | B | C)
Pattern id:
Files changed:
Fallback pattern: (login-page-04 unless overridden)
ERP route impact:
CSS impact:
Gates run:
Rollback steps:
Preview URL:
```
