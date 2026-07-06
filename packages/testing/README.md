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

Authority: [ARCH-TEST-002](../../docs/PAS/%5BComplete%5D%20ARCH-TEST-002-vitest-monorepo-workspace.md) · pyramid rules in [platform-test-coverage SKILL](../../.cursor/skills/platform-test-coverage/SKILL.md)

## Test pyramid (one rule)

Push each claim to the **lowest** layer that can prove it:

| Layer | Runner | Use for |
| --- | --- | --- |
| L0 | Vitest node | Contracts, registries, pure transforms |
| L1 | Vitest route import | `GET()` / loaders — no HTTP server |
| L2 | Vitest jsdom + `@afenda/testing/react` | Radix clicks — `*.interaction.test.tsx` |
| L3 | Storybook addon-vitest (`lab-smoke` / `a11y-smoke`) | Component in real browser — on demand |
| L4 | Playwright `@smoke` | Hydration, theme persistence, multi-route nav, viewport overflow |

Do **not** use Playwright for Zod schemas, registry allowlists, or copy markers Vitest already asserts.

## Run discipline

Before running tests, answer: **claim?** · **layer?** · **one assertion that would fail?**

If vague → `vitest run path/to/file.test.ts` — not full workspace.

| Changed | Run first |
| --- | --- |
| `packages/*` util/contract | `pnpm --filter @afenda/<pkg> test` (watch) |
| Route handler / lab policy | App/package Vitest for that file |
| Radix / shell UI | `pnpm --filter @afenda/developer test:interaction` or `pnpm --filter @afenda/erp test:interaction` |
| v2 primitive | `pnpm --filter @afenda/shadcn-studio-v2 test:primitives` |
| Storybook / CSS | `pnpm --filter @afenda/storybook test:storybook:run` |
| Browser-only behavior | `pnpm --filter @afenda/developer test:e2e:smoke` |
| Release / prod parity | `pnpm --filter @afenda/developer verify:greenlight` once |

**Avoid while iterating:** `pnpm test:run` after every edit · `verify:greenlight` for slice checks · Cypress/Jest as new runners.

**Factory SSOT:** this package only. Lighthouse via `/afenda-webperf` on demand — not daily.

## Interaction tests (Vitest jsdom)

File pattern: `*.interaction.test.tsx` under `src/**/__tests__/`. Render-only suites use `*.test.tsx`.

```bash
pnpm test:interaction              # @afenda/testing + @afenda/developer + @afenda/erp
pnpm test:run:interaction          # alias
pnpm --filter @afenda/developer test:interaction
pnpm --filter @afenda/erp test:interaction
```

Rules:

- Import `setupUser`, `openMenu`, `openDialog`, etc. from `@afenda/testing/react`.
- Do **not** use `fireEvent` — use `@afenda/testing/react` helpers.
- Full user journeys (auth, CSP, multi-page nav) belong in Playwright, not here.

Governance: `scripts/governance/__tests__/interaction-test-imports.test.ts`

## Playwright E2E

| Export / path | Purpose |
| --- | --- |
| `@afenda/testing/e2e/playwright-base` | Canonical `test` / `expect` import for app specs |
| `@afenda/testing/e2e/fixtures` | Extended Playwright fixtures |
| `@afenda/testing/e2e/erp-credentials` | Dev admin/viewer credential resolution + API sign-in |
| `@afenda/testing/e2e/auth-paths` | ERP `storageState` path helpers |

### Developer route lab (`@afenda/developer`)

```bash
pnpm --filter @afenda/developer test:e2e:smoke    # @smoke, dev server on :3002
pnpm --filter @afenda/developer verify:greenlight # build + prod + full smoke
```

### ERP (`@afenda/erp`)

ERP E2E is **deferred** — `apps/erp/e2e/` has no specs yet. Config is a minimal `@smoke` scaffold.

```bash
pnpm --filter @afenda/erp test:e2e:smoke          # --pass-with-no-tests until specs return
```

### Tag conventions

| Tag | Runner | Purpose |
| --- | --- | --- |
| `@smoke` | Playwright `chromium-smoke` | P0 browser smoke |
| `@auth` | Playwright | Requires dev login credentials |
| `*.interaction.test.tsx` | Vitest | Radix/cmdk interaction (Gate 3i) |

Authority: [ARCH-TEST-001](../../docs/PAS/%5BComplete%5D%20ARCH-TEST-001-vitest-playwright-strategy.md)

## Boundaries

`@afenda/testing` is **test-only**. Production imports are blocked by `pnpm quality:boundaries`.

Legacy `@afenda/shadcn-studio` v1 is retired (LANE-B-15) — not in the Vitest workspace. Use `@afenda/shadcn-studio-v2` and Storybook `lab-smoke` for presentation proof.
