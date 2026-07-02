# Slice P06-015 — Dashboard Compositions (PAS-006E)

> **Position:** Slice `15` in PAS-006 family · Blueprint box: **Developer Route Lab**

**Prerequisite:** P06-014 Delivered · `/dashboard/sales` live on :3002

**Status:** Delivered

**Type:** Route composition — second dashboard screen

**Risk class:** Low

## Purpose

Add `/dashboard/finance` — second reference-inspired dashboard composition using the same page law (thin page → `lib/lab/load-dashboard-finance-page.server.ts` → `_components/`) to prove reusable route-lab patterns before ERP promotion.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-015-dashboard-compositions.md

1. Objective    — /dashboard/finance route: loader + _components/ + studio blocks; match P06-014 page law.
2. Allowed layer— apps/developer/**
3. Files        — apps/developer/src/app/(lab)/dashboard/finance/** · apps/developer/src/lib/lab/load-dashboard-finance-page.server.ts
4. Prohibited   — kernel/auth imports · _reference runtime · src/views/
5. Authority    — PAS-006E §7 · reference-borrow-map
6. Gates        — pnpm --filter @afenda/developer typecheck · build
7. Closes       — Finance dashboard composition on :3002
8. Evidence     — Route renders · gates pass
9. Attestation  — Build · Visual review
```

## Delivery criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `/dashboard/finance` route | Borrow map row |
| 2 | Same loader/page/_components law as sales | PAS-006E §7 |
| 3 | Studio blocks only — no local primitive forks | `@afenda/shadcn-studio` imports |

## Related

- [reference-borrow-map.md](./reference-borrow-map.md) — `/dashboard/finance` ← reference `/dashboard/finance`
- [P06-014](./p06-014-developer-app-scaffold.md)
