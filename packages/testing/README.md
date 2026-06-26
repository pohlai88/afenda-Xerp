# @afenda/testing

Shared test utilities for the Afenda monorepo.

## Vitest

| Export | Purpose |
| --- | --- |
| `@afenda/testing/setup/node` | Node test env + monorepo `.env` loading |
| `@afenda/testing/setup/react` | jsdom + jest-dom + RTL cleanup |
| `@afenda/testing/react` | Radix/cmdk interaction helpers |
| `@afenda/testing/mocks/next-link` | `next/link` stand-in for Vitest |
| `@afenda/testing/mocks/next-image` | `next/image` stand-in for Vitest |

Authority: [ARCH-TEST-002](../../docs/ARCH/%5BComplete%5D%20ARCH-TEST-002-vitest-monorepo-workspace.md)

### Interaction tests (Vitest jsdom)

File pattern: `*.interaction.test.tsx` under `src/**/__tests__/`.

```bash
pnpm test:interaction              # root — @afenda/testing, @afenda/ui, @afenda/appshell
pnpm test:run:interaction          # alias
pnpm --filter @afenda/ui test:interaction
```

Rules:

- Import `setupUser`, `openMenu`, `openDialog`, etc. from `@afenda/testing/react`.
- Do **not** use `fireEvent` — use `@afenda/testing/react` helpers.
- Full user journeys (auth, CSP, multi-page nav) belong in Playwright, not here.

Governance: `scripts/governance/__tests__/interaction-test-imports.test.ts`

## Playwright E2E (ERP)

| Export / path | Purpose |
| --- | --- |
| `@afenda/testing/e2e/playwright-base` | Canonical `test` / `expect` import for ERP specs |
| `@afenda/testing/e2e/fixtures` | Extended Playwright fixtures (shared cross-app extensions) |
| `@afenda/testing/e2e/erp-credentials` | Dev admin/viewer credential resolution + API sign-in |
| `@afenda/testing/e2e/auth-paths` | ERP `storageState` path helpers |
| `apps/erp/e2e/auth.setup.ts` | Setup project — writes `e2e/.auth/admin.json` and `viewer.json` |

### Tag conventions

| Tag | Runner | Purpose |
| --- | --- | --- |
| `@smoke` | Playwright `chromium-smoke` project | P0 CI smoke (Gate 3j) |
| `@auth` | Playwright (full + smoke) | Requires dev login credentials |
| `*.interaction.test.tsx` | Vitest | Radix/cmdk interaction subset (Gate 3i) |

### Smoke E2E

```bash
pnpm test:e2e:smoke              # root — chromium-smoke project (@smoke)
pnpm --filter @afenda/erp test:e2e:smoke
```

**Projects** (`apps/erp/playwright.config.mts`):

| Project | Scope |
| --- | --- |
| `setup` | `auth.setup.ts` — persists admin/viewer `storageState` when credentials exist |
| `chromium-smoke` | `@smoke` tagged specs (P0 CI target — Gate 3j) |
| `chromium-full` | Non-smoke specs (local / full runs; not CI smoke) |

**Credentials:** set `AFENDA_DEV_LOGIN_PASSWORD` (min 8 chars) in `.env.secret`, then `pnpm env:sync`. Bootstrap: `pnpm db:bootstrap:local && pnpm auth:bootstrap:dev`. Auth-dependent specs skip locally when absent; CI requires `AFENDA_DEV_LOGIN_PASSWORD` secret.

**Debug:**

```bash
pnpm --filter @afenda/erp test:e2e --grep @smoke --headed --debug
```

Authority: [ARCH-TEST-001](../../docs/ARCH/%5BComplete%5D%20ARCH-TEST-001-vitest-playwright-strategy.md)

## Boundaries

`@afenda/testing` is **test-only**. Production imports are blocked by `pnpm quality:boundaries`.
