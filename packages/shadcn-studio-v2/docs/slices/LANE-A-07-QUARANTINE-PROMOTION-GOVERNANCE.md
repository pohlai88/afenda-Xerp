# Lane A-07 — Quarantine Promotion Governance

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers promoting MCP/shadcn installs from quarantine to `ui/`
- Authority: `src/components/quarantine/README.md`, `../DESIGN-SYSTEM-GUIDELINE.md`
- Action enabled: Promote quarantined components with gates, not ad hoc copies

## Overview

Formalize the quarantine → `components/ui/` promotion path so new shadcn/studio
MCP installs do not bypass taxonomy, kebab law, or primitive contracts.

## Problem

Many `ui/` files exist from MCP installs without contract tests. Ungoverned
promotion recreates pre-Phase-3 drift.

## Goals

- Document promotion checklist in quarantine README (or linked doc).
- Add drift script check: quarantine files older than N days without promotion decision (optional advisory).
- Ensure promoted files run through `normalize-kebab-stems --check`.
- Wire promotion requirement into `check-design-system-drift.ts` if missing.

## Non-goals

- Bulk-promoting every shadcn component in one slice.
- MCP install automation changes.

## Constraints

- Promotion requires primitive contract slice (A-04–A-06) or explicit deferral note.
- No direct consumer imports from quarantine.

## Proposed design

### Promotion checklist

1. MCP install lands in `components/quarantine/`.
2. Adapt imports to package conventions (kebab paths, `@/` none).
3. Assign contract tier: governed (tests) vs parity-only (documented exception).
4. Move to `components/ui/{kebab}.tsx`.
5. Export from `index.ts` / `clients.ts` per runtime boundary.
6. Run full gates.

## Interfaces / dependencies

- Depends on A-01 kebab law.
- Feeds A-08 proof route if promoted primitives need visual proof.

## Risks and mitigations

- Risk: quarantine becomes permanent junk drawer.
  - Mitigation: drift guard lists quarantine inventory in CI output.

## Rollout and rollback

1. Update quarantine README + drift script.
2. Promote zero or one pilot component as proof of process.
3. Rollback: move file back to quarantine; remove export.

## Required gates

Standard Lane A gates + `check:drift`.

## Done definition

- [x] Written promotion checklist committed (`src/components/quarantine/README.md`).
- [x] Drift guard mentions quarantine policy (`check-design-system-drift.ts` inventory + import/export checks).
- [x] Explicit empty quarantine baseline recorded (`inventory.baseline.json` with `files: []`).

## Evidence

- `src/components/quarantine/README.md` — promotion checklist + gate commands
- `src/components/quarantine/inventory.baseline.json` — empty baseline
- `src/__tests__/quarantine-governance.test.ts` — README, entrypoint, baseline, kebab law
- `scripts/check-design-system-drift.ts` — `quarantine-*` rules + CI inventory line on pass

## Decision

Execute promotion only through the checklist; empty quarantine is the approved baseline until MCP installs land.
