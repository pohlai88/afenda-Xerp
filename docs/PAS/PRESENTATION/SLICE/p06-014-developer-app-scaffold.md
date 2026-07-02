# Slice P06-014 — Developer App Scaffold (PAS-006E)

> **Position:** Slice `14` in PAS-006 family · Blueprint box: **Developer Route Lab**

**Prerequisite:** P06-013 Delivered · ADR-0039 Accepted · `@afenda/developer` registry row (foundation-registry-owner)

**Status:** Delivered

**Type:** Application scaffold — lab-lane only

**Risk class:** Low

**Clean Core impact:** B→B — presentation route lab; no kernel spine

## Purpose

Scaffold `apps/developer` on port **3002**: root layout with demo banner, `(lab)/layout.tsx` with `force-dynamic` + AppShell + nav, thin RSC pages, `lib/lab/load-*-page.server.ts`, route `_components/`, production guard (`NODE_ENV=production` without `AFENDA_DEVELOPER_SANDBOX`), and initial route `/dashboard/sales`.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-014-developer-app-scaffold.md

1. Objective    — Scaffold @afenda/developer (port 3002): package.json, Next app, PAS-006E layout annex, / + /dashboard/sales, production hard-fail guard.
2. Allowed layer— apps/developer/** · package.json (workspace) · turbo.json (if required) · foundation-disposition.registry.ts (registry-owner only)
3. Files        — apps/developer/** (new) · registry via foundation-registry-owner
4. Prohibited   — @afenda/kernel · @afenda/auth · _reference runtime imports · src/views/ · ERP route changes
5. Authority    — ADR-0039 · PAS-006E §7 · afenda-nextjs-best-practice
6. Gates        —
   pnpm --filter @afenda/developer typecheck
   pnpm --filter @afenda/developer build
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Route lab app bootstrapped · /dashboard/sales live on :3002
8. Evidence     — dev server :3002 · typecheck + build pass
9. Attestation  — Registry · Documentation · Build
```

## Delivery criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `@afenda/developer` lab-lane registry row | foundation-disposition.registry.ts |
| 2 | Port 3002 dev script | apps/developer/package.json |
| 3 | Production guard | ADR-0039 hard-fail implemented |
| 4 | Layout annex compliance | No `src/views/` · thin pages · loaders |
| 5 | `/dashboard/sales` route | Loader + `_components/` + studio blocks |
| 6 | Demo banner on all routes | Root layout |
| 7 | `error.tsx` no studio import | App root error boundary |

## Related

- [P06-013](./p06-013-developer-route-lab-docs.md) — docs prerequisite
- [PAS-006E](../PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md)
- [reference-borrow-map.md](./reference-borrow-map.md)
