# Wave V2 — Post-Foundation Improvement Index

## Document status

- Status: **Complete**
- Audience: Engineers working on `@afenda/shadcn-studio-v2` and Storybook v2 catalog
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md`, `../TAXONOMY.md`
- Action enabled: Execute bounded post-foundation slices without reopening Lane B or ERP wiring

## Overview

Foundation (Phases 1–9, Lane A, Lane B) is complete. This wave closed **consumer-readiness gaps inside the package**: L4 Storybook catalog completeness, title semantics, AuthShell variants, ConfirmDialog interaction proof, editorial theme stories, and quarantine promotion pilot deferral.

## Non-goals

- ERP route wiring, auth cutover, developer lab page chrome
- Full 40-primitive Storybook inventory
- Acceptance records, PAS doc sync, foundation registry edits
- v1 restoration

## Slice index

| Slice | Title | Status | Depends on |
| --- | --- | --- | --- |
| V2-W1 | L4 catalog — EvidenceWidget | Complete | — |
| V2-W2 | Title semantics hardening | Complete | — |
| V2-W3 | AuthShell variant presets | Complete | W2 |
| V2-W4 | ConfirmDialog interaction proof | Complete | W2 |
| V2-W5 | Editorial theme Storybook | Complete | — |
| V2-W6 | MCP quarantine promotion pilot | Deferred | W5 optional |

**Recommended order:** W1 → W2 → (W3 ∥ W4) → W5 → W6

## W2 decision

**Option A:** `CardTitle` renders semantic heading (`h3` default) with optional `as` prop for `h1`/`h2` overrides. AuthShell uses `as="h1"`; ConfirmDialog uses `as="h2"`.

## Wave sign-off

- [x] Slices V2-W1–W5 complete; W6 deferred with evidence ([V2-W6 handoff](V2-W6-QUARANTINE-PROMOTION-PILOT.md))
- [x] `pnpm --filter @afenda/shadcn-studio-v2 quality`
- [x] `pnpm --filter @afenda/storybook test:storybook:run`

## Handoffs

| Slice | Handoff |
| --- | --- |
| V2-W6 | [V2-W6-QUARANTINE-PROMOTION-PILOT.md](V2-W6-QUARANTINE-PROMOTION-PILOT.md) |
