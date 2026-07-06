# shadcn-studio-v2 Slice Index

## Document Status
- Status: Active slice index
- Audience: Engineers executing `@afenda/shadcn-studio-v2` work.
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md`, `../DEVELOPMENT-ROADMAP.md`, and `../TAXONOMY.md`.
- Action enabled: select and execute one bounded slice without reviving inactive docs or starting later implementation.

## Operating Rule

This directory contains execution specs, not narrative history.

Every slice must state:

- status
- scope
- non-goals
- allowed files
- hard stops
- required gates
- completion evidence

## Active Slice Order

0. [Pre-Flight 0 - Documentation Baseline Lock](PRE-FLIGHT-0-DOCUMENTATION-BASELINE-LOCK.md)
1. [Pre-Flight 1 - Executable Gate Alignment](PRE-FLIGHT-1-EXECUTABLE-GATE-ALIGNMENT.md)
2. [Phase 1 - Clean Package skeleton](PHASE-1-CLEAN-PACKAGE-SKELETON.md)
3. [Phase 2 - Token And CSS Authority](PHASE-2-TOKEN-AND-CSS-AUTHORITY.md)
4. [Phase 3 - Primitive Layer](PHASE-3-PRIMITIVE-LAYER.md)
5. [Phase 4 - Runtime Boundary](PHASE-4-RUNTIME-BOUNDARY.md)
6. [Phase 5 - Layout Chrome](PHASE-5-LAYOUT-CHROME.md)
7. [Phase 7A - Page And Widget Views](PHASE-7A-PAGE-AND-WIDGET-VIEWS.md)
8. [Phase 7B - Workflow Views](PHASE-7B-WORKFLOW-VIEWS.md)
9. [Phase 7C - Auth Presentation](PHASE-7C-AUTH-PRESENTATION.md)
10. [Phase 7 - Public Export Contract](PHASE-7-PUBLIC-EXPORT-CONTRACT.md)
11. [Phase 8 - Verification App And Proof Route](PHASE-8-VERIFICATION-APP-AND-PROOF-ROUTE.md)
12. [Phase 9 - Enterprise Acceptance Gate](PHASE-9-ENTERPRISE-ACCEPTANCE-GATE.md)
13. [Closing Synchronization Gate](CLOSING-SYNCHRONIZATION-GATE.md)

## Universal Non-Goals

- Do not restore old documentation trees.
- Do not compare against old package structure unless the slice explicitly asks for migration evidence.
- Do not edit consumer apps before the proof-route slice.
- Do not create source skeletons before Phase 1.
- Do not implement components, providers, views, or exports before their slice.
- Do not weaken taxonomy, token, CSS, runtime, export, or consumer-proof gates.

## Universal Package Gates

Run the narrowest relevant gates during the slice, then run the full package gate set before declaring completion:

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

## Completion Note Format

Every slice closes with:

```md
## Summary
- 

## Files Changed
| File | Reason |
| --- | --- |

## commands Run
| command | Result |
| --- | --- |

## DoD
- [ ] Scope respected
- [ ] Non-goals avoided
- [ ] Required gates run
- [ ] Remaining gaps named

## Decision
- `PROCEED`
- `HOLD`
- `REJECT`
```

## Greenfield baseline status (2026-07-06)

Phases 1–9 and the closing synchronization gate are **complete** for the
current `@afenda/shadcn-studio-v2` package. Consumer proof:
`/design-system/v2-proof` in `@afenda/developer`. Ledger: `../MIGRATION-MAP.md`.

## Lane A — post-acceptance internal stabilization (active)

**Authority:** [Lane A internal stabilization index](LANE-A-INTERNAL-STABILIZATION-INDEX.md)

Execute in numeric order. Lane B planning is unlocked after A-11; execution stays per-slice.

| # | Slice | Status |
| --- | --- | --- |
| A-01 | [Kebab stem normalization](LANE-A-01-KEBAB-STEM-NORMALIZATION.md) | Complete |
| A-02 | [Widget manifest and evidence adapter](LANE-A-02-WIDGET-MANIFEST-AND-EVIDENCE-ADAPTER.md) | Complete |
| A-03 | [Auth shell proof integration](LANE-A-03-AUTH-SHELL-PROOF-INTEGRATION.md) | Complete |
| A-04 | [Primitive contract — form controls](LANE-A-04-PRIMITIVE-CONTRACT-FORM-CONTROLS.md) | Complete |
| A-05 | [Primitive contract — overlays](LANE-A-05-PRIMITIVE-CONTRACT-OVERLAYS.md) | Complete |
| A-06 | [Primitive contract — navigation and data chrome](LANE-A-06-PRIMITIVE-CONTRACT-NAV-DATA.md) | Complete |
| A-07 | [Quarantine promotion governance](LANE-A-07-QUARANTINE-PROMOTION-GOVERNANCE.md) | Complete |
| A-08 | [Proof route state matrix](LANE-A-08-PROOF-ROUTE-STATE-MATRIX.md) | Complete |
| A-09 | [Manifest workflow kinds](LANE-A-09-MANIFEST-WORKFLOW-KINDS.md) | Complete |
| A-10 | [Lane A synchronization gate](LANE-A-10-SYNCHRONIZATION-GATE.md) | Complete |
| A-11 | [Lane A internal sign-off](LANE-A-11-INTERNAL-SIGN-OFF-GATE.md) | Complete |

## Lane B — v1 migration and formal deprecation (active)

**Authority:** [Lane B v1 migration and retirement index](LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md)

B-01–B-14 **Complete** (2026-07-06). Formal v1 deprecation only at B-15 **PROCEED**.

| # | Slice | Status |
| --- | --- | --- |
| B-01 | [Consumer import inventory](LANE-B-01-CONSUMER-IMPORT-INVENTORY.md) | Complete |
| B-02 | [ADR — drag library and board frame](LANE-B-02-ADR-DRAG-LIBRARY-AND-BOARD-FRAME.md) | Complete |
| B-03 | [ERP theme and CSS v2 chain](LANE-B-03-ERP-THEME-CSS-V2-CHAIN.md) | Complete |
| B-04 | [Developer lab shell cutover](LANE-B-04-DEVELOPER-LAB-SHELL-CUTOVER.md) | Complete |
| B-05 | [TanStack datatable headless composer](LANE-B-05-TANSTACK-DATATABLE-COMPOSER.md) | Complete |
| B-06 | [ERP app shell and navigation cutover](LANE-B-06-ERP-APP-SHELL-NAV-CUTOVER.md) | Complete |
| B-07 | [ERP surface wave — system admin](LANE-B-07-ERP-SURFACE-WAVE-SYSTEM-ADMIN.md) | Complete |
| B-08 | [ERP surface wave — metadata and procurement](LANE-B-08-ERP-SURFACE-WAVE-METADATA-PROCUREMENT.md) | Complete |
| B-09 | [Workflow board runtime](LANE-B-09-WORKFLOW-BOARD-RUNTIME.md) | Complete |
| B-10 | [Manifest workflow kind promotion](LANE-B-10-MANIFEST-WORKFLOW-KIND-PROMOTION.md) | Complete |
| B-11 | [Storybook v2 alignment](LANE-B-11-STORYBOOK-V2-ALIGNMENT.md) | Complete |
| B-12 | [Developer lab v1 dependency removal](LANE-B-12-DEVELOPER-LAB-V1-REMOVAL.md) | Complete |
| B-13 | [v1 import freeze and retirement candidate](LANE-B-13-V1-IMPORT-FREEZE-AND-RETIREMENT-CANDIDATE.md) | Complete |
| B-14 | [Lane B synchronization gate](LANE-B-14-LANE-B-SYNCHRONIZATION-GATE.md) | Complete |
| B-15 | [v1 formal deprecation sign-off](LANE-B-15-V1-FORMAL-DEPRECATION-SIGN-OFF.md) | Planned |
