# Slice P06-008-R2 — DOM Slot Markers (PAS-006D)

> **Position:** Slice `8-R2` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-008-R1 Delivered · P06-003 block slot registry Delivered

**Status:** Delivered (2026-06-29)

**Type:** Implementation (presentation runtime hook)

**Risk class:** Medium — touches ~33 MCP block TSX surfaces; must not regress ACPA/WCAG evidence

**Clean Core impact:** B→B — adds inspectable DOM hooks on metadata-bound blocks only; no ERP route or kernel vocabulary changes

## Authority decision

P06-008-R2 closes the gap between **registry slot vocabulary** (P06-003 / P06-008-R1) and **rendered block DOM**.

Each metadata-bound MCP block MUST expose its declared `slotId` values on compositional elements via a single presentation-owned attribute:

```html
data-afenda-slot="{slotId}"
```

**Kernel-authority boundary (PAS-001):**

| Question | Answer | Owner |
| --- | --- | --- |
| Does R2 add kernel vocabulary? | **No** — slot IDs remain presentation inventory strings in `@afenda/shadcn-studio` | PAS-006D |
| Does R2 add branded cross-package IDs? | **No** — `slotId` is already wire-safe in `BLOCK_SLOT_REGISTRY` | shadcn-studio |
| Does R2 belong in `@afenda/kernel`? | **No** — DOM rendering hooks are presentation behavior, not platform vocabulary | kernel-authority hard stop |
| Where does ERP validate slot ↔ binding? | Trust boundary at `apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts` (existing) | PAS-001A consumer |
| Do `components/ui/*` primitives get markers? | **No** — metadata-agnostic by design (same rule as P06-008-R1) | PAS-006D |

**Relationship to P06-008-R1:**

```text
P06-008-R1  inventory YES/NO matrix (registry-only — Delivered)
P06-008-R2  DOM projection of YES-binding slotIds into block TSX
PAS-001A-R1 ERP protected-route render + context spine (deferred — separate PAS family)
```

R2 does **not** hydrate metadata values, evaluate permissions, or wire ERP routes. It only makes slot regions **machine-locatable** for later ERP/metadata runtime (PAS-001A-R1).

## Purpose

Deliver Presentation NS §3.5 lifecycle step **Metadata-bound** at the DOM layer: metadata-capable blocks expose registry-declared slots in rendered output so acceptance, Storybook proof, and future ERP hydration can assert slot ↔ binding parity without TSX import enforcement.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-008-r2-dom-slot-markers.md

1. Objective    — Add data-afenda-slot DOM markers on all YES-binding MCP blocks; gate slot DOM parity against BLOCK_SLOT_REGISTRY.
2. Allowed layer— packages/shadcn-studio/src/contracts · components/shadcn-studio/blocks/** · registry · __tests__ · scripts/governance · index.ts · docs/PAS/PRESENTATION
3. Files        —
   packages/shadcn-studio/src/contracts/block-slot-dom-marker.contract.ts
   packages/shadcn-studio/src/components/shadcn-studio/blocks/** (YES-binding blocks only)
   packages/shadcn-studio/src/registry/assert-block-slot-dom-marker-coverage.ts
   packages/shadcn-studio/src/__tests__/block-slot-dom-marker-coverage.test.ts
   packages/shadcn-studio/src/index.ts
   scripts/governance/check-studio-block-slot-markers.mjs
   package.json
   docs/PAS/PRESENTATION/SLICE/p06-008-r2-dom-slot-markers.md
   docs/PAS/PRESENTATION/PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md
   docs/PAS/PRESENTATION/SLICE/presentation-slice-catalog.md
4. Prohibited   — @afenda/kernel in shadcn-studio · components/ui/** edits for markers · waiver blocks (NO path) · ERP route/page changes · metadata value hydration · permission evaluation · foundation-disposition.registry.ts · PAS-001A-R1 scope
5. Authority    — PAS-006D · Presentation NS §3.5 · P06-008-R1 · kernel-authority (boundary: not kernel) · shadcn-studio skill
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm check:studio-metadata-binding
   pnpm check:studio-block-slot-markers
   pnpm check:studio-block-acpa-acceptance
   pnpm quality:boundaries
7. Closes       — NS §3.5 Metadata-bound DOM hook · PAS-006D remaining slice (inventory → DOM) · Enterprise score path toward 9.0+ presentation metadata
8. Evidence     —
   packages/shadcn-studio/src/contracts/block-slot-dom-marker.contract.ts
   packages/shadcn-studio/src/registry/assert-block-slot-dom-marker-coverage.ts
   packages/shadcn-studio/src/__tests__/block-slot-dom-marker-coverage.test.ts
   scripts/governance/check-studio-block-slot-markers.mjs
9. Attestation  — Contract · Test · Governance · Documentation
```

## P06-008-R2 MUST rules

1. Only blocks with a **YES** metadata binding (not waiver) require DOM slot markers.
2. Every `slotId` declared in `BLOCK_SLOT_REGISTRY` for a YES-binding block MUST appear exactly once as `data-afenda-slot="{slotId}"` in that block's compositional TSX (block folder under `components/shadcn-studio/blocks/**`).
3. DOM markers MUST NOT be added to `components/ui/**` primitives.
4. Marker attribute name MUST be centralized in `block-slot-dom-marker.contract.ts` (`AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE = "data-afenda-slot"`).
5. Marker values MUST match registry `slotId` strings exactly — no invented slot names in TSX.
6. Waiver blocks (P06-008-R1 NO path) MUST NOT receive markers — gate excludes them explicitly.
7. `@afenda/kernel` MUST NOT be imported by shadcn-studio for this slice.
8. Markers are **structural hooks only** — no metadata schema, atom text, or permission logic in marker layer.
9. Adding a marker MUST NOT remove or weaken existing ACPA/WCAG evidence (re-run auth-adjacent gates when auth blocks touched).
10. Governance gate MUST fail when YES-binding block slot registry ⊄ DOM marker set (100% parity for in-scope blocks).
11. ERP hydration and protected-route rendering remain **out of scope** (PAS-001A-R1).
12. Slot source of truth for marker validation remains `BLOCK_SLOT_REGISTRY` intersected with `METADATA_BINDING_REGISTRY` — not TSX inference alone.

## Implementation sequence

| Step | Action | Why |
| ---: | --- | --- |
| 1 | `block-slot-dom-marker.contract.ts` + optional thin `BlockSlotMarker` wrapper | Single attribute constant; avoids drift |
| 2 | `assert-block-slot-dom-marker-coverage.ts` | Shared enforcement — registry slots vs static TSX scan |
| 3 | Patch YES-binding block TSX (~33 blocks) | DOM projection — largest diff |
| 4 | `block-slot-dom-marker-coverage.test.ts` | Vitest matrix parallel to R1 coverage pattern |
| 5 | `check-studio-block-slot-markers.mjs` | CI gate |
| 6 | Barrel exports + PAS-006D / catalog sync | Public contract + PAS truth |

### Marker placement guidance

| Slot role | Preferred host element |
| --- | --- |
| `form-field` | Wrapper around label+control region (not inner `<input>` unless sole host) |
| `form-action` | `<button>` or action container |
| `content` / `metric` | Semantic section wrapper (`article`, `section`, or role-equivalent div) |
| `branding` | Header / aside branding container |
| `table` | Table root or `<thead>` landmark wrapper |
| `navigation` | `<nav>` or menu list root |

Use the thinnest compositional wrapper that preserves ACPA structure — markers are attributes, not layout changes.

### Enforcement model

```text
METADATA_BINDING_REGISTRY (YES blockIds)
  ∩ BLOCK_SLOT_REGISTRY (slotIds per block)
  → expected marker set per block
  → static scan of components/shadcn-studio/blocks/<blockId>/**/*.tsx
  → assert parity (expected ⊆ found, no orphan markers)
  → check:studio-block-slot-markers
```

**Not in R2:** Playwright ERP hydration, live metadata value injection, or Server Component data binding.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 100% YES-binding blocks expose all registry slotIds in DOM | `block-slot-dom-marker-coverage.test.ts` |
| 2 | Waiver blocks have zero `data-afenda-slot` markers | same test suite |
| 3 | Governance gate executable and green | `pnpm check:studio-block-slot-markers` |
| 4 | No kernel import in shadcn-studio; ACPA gate unchanged | `pnpm quality:boundaries` · `pnpm check:studio-block-acpa-acceptance` |
| 5 | Centralized attribute constant exported | `block-slot-dom-marker.contract.ts` + typecheck |

**Field 8 evidence map (post-delivery):**

| DoD # | Evidence path |
| --- | --- |
| 1 | `packages/shadcn-studio/src/__tests__/block-slot-dom-marker-coverage.test.ts` |
| 2 | `packages/shadcn-studio/src/registry/assert-block-slot-dom-marker-coverage.ts` |
| 3 | `scripts/governance/check-studio-block-slot-markers.mjs` |
| 4 | `pnpm quality:boundaries` output |
| 5 | `packages/shadcn-studio/src/contracts/block-slot-dom-marker.contract.ts` |

## Enterprise score impact (expected)

| Capability | After R1 | After R2 (target) |
| --- | ---: | ---: |
| Metadata binding contract | 85% | 88% |
| DOM inspectability | 40% | 85% |
| Metadata-driven UI runtime | 45% | 55% |
| **Overall presentation metadata** | 85% | **~90%** |

Full **9.5+** still requires PAS-001A-R1 ERP protected-route render + operating-context spine.

## Out of scope

| Item | Deferred to |
| --- | --- |
| ERP route protected render | PAS-001A-R1 |
| OperatingContext assembly spine | PAS-001A-R1 |
| Metadata field value hydration | PAS-001A-R1 + metadata domain |
| OpenAPI / HTTP contract changes | Only if R1 adds new endpoints — orthogonal |
| Kernel slot vocabulary export | **Never** — presentation inventory owns slotId strings |

## Related

- [P06-008-R1](./p06-008-r1-metadata-binding-enforcement.md) · [P06-008](./p06-008-metadata-binding-contract.md)
- [PAS-006D](../PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md)
- [Presentation NS §3.5](../../../NORTHSTAR/shadcn-studio-presentation-north-star.md)
- [PAS-001A ERP Integration Spine](../../KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) — consumer boundary only
