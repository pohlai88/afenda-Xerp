# Lane A-02 — Widget Manifest And Evidence Adapter

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers extending board widget adapters in-package
- Authority: `PHASE-7B-WORKFLOW-VIEWS.md`, ADR-0041 (grid sizes)
- Action enabled: Add widget kinds via manifest registry + adapter pattern

## Overview

Deliver metadata SSOT for workspace board widget kinds and the `EvidenceWidget`
presentation adapter, sharing `widget-board-adapter.ts` with `widget-metric`.

## Problem

Board widgets need declarative layout hints without duplicating drag/resize logic
or scattering default sizes across consumers.

## Goals

- `workspace-board-manifest-registry.ts` with `metric` and `evidence` rows.
- Export `EvidenceWidget`, `defineEvidenceWidgetMetadata`, manifest helpers.
- Proof route renders real `EvidenceWidget` (not a stand-in).

## Non-goals

- ERP bridge consuming manifest (Lane B).
- Drag/resize frame (Lane B + ADR).

## Constraints

- Adapters set `data-workspace-board-adapter="true"` only.
- No `draggable` / `resize` in adapter markup (test-enforced).
- Widget file stems use `widget-` prefix.

## Proposed design

### Delivered artifacts

- `src/metadata/registries/workspace-board-manifest-registry.ts`
- `src/views/widgets/widget-evidence.tsx`
- `src/views/widgets/widget-board-adapter.ts`
- `src/views/widgets/widget-metric.tsx` (uses shared adapter)
- Tests: `workspace-board-manifest-registry.test.ts`, `composed-views.test.tsx`

## Interfaces / dependencies

- `@afenda/shadcn-studio-v2/metadata` exports registry.
- `@afenda/shadcn-studio-v2/clients` exports `EvidenceWidget`.

## Risks and mitigations

- Risk: layout hints duplicated in ERP bridge.
  - Mitigation: single registry SSOT; bridge deferred to Lane B.

## Rollout and rollback

Completed in-package. Rollback: remove evidence export and proof fixture.

## Required gates

Standard Lane A package gates + `verify:v2-proof`.

## Done definition

- [x] Manifest registry with ADR grid defaults.
- [x] Evidence adapter exported and tested.
- [x] Proof route shows evidence checkpoint.

## Decision

`PROCEED` — complete.
