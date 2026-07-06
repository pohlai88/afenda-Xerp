# Phase 8 - Verification App And Proof Route Technical Specification

## Overview

This slice creates one real proof route that consumes V2 only through public
package entrypoints.

## Problem

Package-local tests are necessary but insufficient. Without a real consumer
route, export safety, CSS loading, and composed runtime behavior remain
unproven.

## Goals

* Select one real consumer route.
* Render the required V2 surfaces through public imports only.
* Prove base and named-theme behavior in the consumer environment.

## Non-goals

* Broad app migration.
* Business logic rollout.
* Legacy retirement.

## Constraints

* Public package imports only.
* CSS package exports only.
* Static fixture data only.
* No internal `src/*` imports.

## Proposed design

### Proof surface

The route should render the architecture-required V2 surface mix:

* shell chrome
* page surface
* widgets
* table/form/dialog/settings compositions
* theme controls

### Verification posture

The slice must prove:

* package entrypoint-only imports
* package CSS import-only styling
* light, dark, `swiss-noir`, and `verdant-noir` support
* consumer typecheck, build, and route smoke proof

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../MIGRATION-MAP.md`
* Downstream slices:

  * Phase 9 enterprise acceptance
  * Closing synchronization gate

## Risks and mitigations

* Risk: the route quietly imports internals.

  * Mitigation: keep import-path checks explicit.
* Risk: route proof is too narrow to catch theme/runtime issues.

  * Mitigation: require all supported theme states in the proof route.
* Risk: consumer proof is mistaken for broad migration approval.

  * Mitigation: keep this slice scoped to one bounded route only.

## Rollout and rollback

### Rollout

1. Pick the bounded consumer route.
2. Import only public V2 entrypoints and package CSS exports.
3. Add smoke and build/typecheck proof.

### Rollback

If the route requires internal imports to render, stop and fix the package
export contract before widening consumer proof.

## Open questions

* Which app should own the first proof route if both developer and ERP surfaces
  are available.

---

## Summary

Phase 8 is **complete**. Consumer proof lives in `@afenda/developer` at
`/design-system/v2-proof` — a bounded route outside the `(lab)` shell that
imports only public `@afenda/shadcn-studio-v2` entrypoints and package CSS
exports.

## Files Changed

| File | Reason |
| --- | --- |
| `apps/developer/src/app/design-system/v2-proof/` | Proof route (page + client panel + tests) |
| `apps/developer/src/lib/v2-proof/fixtures.ts` | Static fixture data |
| `apps/developer/src/app/globals.css` | Package CSS stack (`shadcn-default`, `afenda-brand`, app `@theme`) |
| `apps/developer/src/app/layout.tsx` | V2 `StudioPresentationProviders` + `ThemeScript` |
| `apps/developer/src/app/__tests__/v2-proof-smoke.spec.ts` | Playwright smoke + hydration/runtime error probe |
| `apps/developer/scripts/check-developer-presentation-runtime.mjs` | Provider import boundary |
| `apps/developer/scripts/check-developer-hydration-governance.mjs` | Hydration prevention |
| `apps/developer/vitest.config.ts` | V2 subpath aliases for unit tests |

## Commands Run

| Command | Result |
| --- | --- |
| `pnpm --filter @afenda/developer verify:v2-proof` | PASS |
| `pnpm --filter @afenda/developer build` | PASS |
| Next.js MCP `get_errors` (port 3002, `/design-system/v2-proof`) | PASS — zero session errors |

## DoD

- [x] Consumer route renders (`/design-system/v2-proof`)
- [x] Public imports only (`v2-proof-import-boundary.test.ts`)
- [x] CSS package import only (globals.css + boundary test)
- [x] Required surfaces visible (AppShell01, PageSurface, MetricWidget ×2 stand-in for EvidenceWidget, DataTableSurface, FormSurface, ConfirmDialogSurface, SettingsSurface, ThemeToggle, ThemeCustomizer)
- [x] Theme switching works (light/dark + `shadcn-default`, `swiss-noir`, `verdant-noir`, `afenda-brand`)
- [x] No internal `src/*` imports in proof sources
- [x] Consumer typecheck passes
- [x] Consumer build passes
- [x] Route smoke / unit proof passes

## Remaining gaps

| Gap | Owner | Notes |
| --- | --- | --- |
| `EvidenceWidget` not exported | Phase 7B / future slice | MetricWidget stand-in documented in fixtures |
| Playwright smoke requires running dev server | `verify:greenlight` | Production smoke harness covers full route-lab set |
| ERP consumer proof | Out of Phase 8 scope | Developer route lab owns first bounded proof per ADR-0039 |

## Decision

**`PROCEED`** — Phase 8 signed off 2026-07-06. Ready for Phase 9 enterprise acceptance.
