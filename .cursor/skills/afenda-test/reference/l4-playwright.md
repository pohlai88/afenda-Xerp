# L4 Playwright (Afenda)

On-demand reference for `/afenda-test` and `afenda-test-engineer`. Authority: [`packages/testing/README.md`](../../../../packages/testing/README.md) · [ARCH-TEST-001](../../../../docs/PAS/%5BComplete%5D%20ARCH-TEST-001-vitest-playwright-strategy.md)

## Layer placement

| Claim | Layer | Notes |
| --- | --- | --- |
| Zod schema, registry allowlist, pure transform | L0 | Never Playwright |
| Route handler `GET()` / loader | L1 | Vitest import — no HTTP server |
| Radix click, menu, dialog, membership option list | L2 | `*.interaction.test.tsx` + `@afenda/testing/react` |
| Component in real browser, a11y addon | L3 | Storybook `test:storybook:run` on demand |
| Hydration, multi-route nav, viewport overflow, full auth journey | L4 | Playwright `@smoke` |

**Reject:** Cypress · Jest as new runners · Playwright for claims Vitest already proves.

## Surface and options popout

| Column | Meaning |
| --- | --- |
| **Surface** | L4 view, auth ingress route, or registry artifact |
| **Options popout** | `yes` = row-actions menu, command dialog, dropdown, or membership option list; `no` = render-only or redirect; `n/a` |

**L2 before L4** unless the claim requires real navigation, hydration, or cross-route spine behavior.

## Layout

| App | Spec location | Config | Port |
| --- | --- | --- | --- |
| `@afenda/developer` | `apps/developer/src/app/__tests__/*.spec.ts` | `playwright.config.mts` | 3002 |
| `@afenda/erp` | `apps/erp/e2e/**/*.spec.ts` | `playwright.config.mts` | 3000 |

Extend shared fixtures in `packages/testing/src/e2e/fixtures.ts` only.

## Tags

| Tag | Project | Use |
| --- | --- | --- |
| `@smoke` | `chromium-smoke` | P0 browser smoke |
| `@auth` | Playwright | Dev login / `storageState` |

## Authoring rules

1. Registry SSOT for smoke routes — [l4-spec-patterns.md](l4-spec-patterns.md)
2. Locators: `getByRole`, `getByLabel`, `data-slot`, `data-auth-ingress-*`
3. Auth: Better Auth via `@afenda/testing/e2e/erp-credentials` — not Clerk OSS patterns
4. Viewports: desktop + mobile for route-lab-style surfaces
5. Redundancy: keep lower layer when L1/L2 already proves the claim

## ERP auth spine L4 backlog

`apps/erp/e2e/` is scaffolded; specs planned. See [spine-declaration-table.md](spine-declaration-table.md).

## OSS (non-authoritative)

Personal `playwright-best-practices` may inform mechanics; Afenda imports, gates, and pyramid in this repo win on conflict.
