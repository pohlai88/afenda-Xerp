# shadcn-studio-v2 Slice Index

## Document Status
- Status: Active slice index
- Audience: Engineers executing `@afenda/shadcn-studio-v2` work.
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md`, `../DEVELOPMENT-ROADMAP.md`, and `../TAXONOMY.md`.
- Action enabled: Select and execute one bounded slice without reviving inactive docs or starting later implementation.

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
2. [Phase 1 - Clean Package Skeleton](PHASE-1-CLEAN-PACKAGE-SKELETON.md)
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

## Commands Run
| Command | Result |
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
