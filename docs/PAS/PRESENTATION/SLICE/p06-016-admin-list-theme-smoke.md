# Slice P06-016 — Admin List + Theme Smoke (PAS-006E)

> **Position:** Slice `16` in PAS-006 family · Blueprint box: **Developer Route Lab**

**Prerequisite:** P06-015 Delivered (or P06-014 minimum if finance deferred)

**Status:** Delivered

**Type:** Route completion + advisory CI smoke

**Risk class:** Low

## Purpose

Complete v1 borrow map: `/admin/users` (datatable density from reference `/apps/users/list`) and `/settings/appearance` (theme provider from `config/theme-config.ts`). Add Playwright smoke on port **3002** — advisory CI, no auth.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-016-admin-list-theme-smoke.md

1. Objective    — /admin/users + /settings/appearance routes; Playwright smoke :3002 (advisory CI, no auth).
2. Allowed layer— apps/developer/** · .github/workflows/ (advisory smoke if new workflow)
3. Files        — apps/developer routes · e2e/smoke or playwright config scoped to :3002
4. Prohibited   — auth flows · production deploy · kernel/API wiring
5. Authority    — PAS-006E · reference-borrow-map · ADR-0039
6. Gates        —
   pnpm --filter @afenda/developer typecheck
   pnpm --filter @afenda/developer build
   Playwright smoke :3002 (advisory)
7. Closes       — v1 borrow map complete · smoke signal in CI
8. Evidence     — All 5 v1 routes render · smoke job green
9. Attestation  — CI advisory · Build
```

## Delivery criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `/admin/users` list density | reference-borrow-map |
| 2 | `/settings/appearance` theme UX | theme-config wiring |
| 3 | Playwright smoke on :3002 | Advisory workflow / local run |
| 4 | No auth in smoke paths | Demo banner routes only |
| 5 | v1 borrow map 5/5 routes | reference-borrow-map.md |

## Related

- [reference-borrow-map.md](./reference-borrow-map.md)
- [ADR-0039](../../../adr/ADR-0039-developer-presentation-sandbox.md) — verification gates
