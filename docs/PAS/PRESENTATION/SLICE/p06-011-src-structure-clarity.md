# Slice P06-011 — Source Structure Clarity (PAS-006A)

> **Position:** Slice `11` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-010 Delivered · [ADR-0037](../../../adr/ADR-0037-shadcn-studio-src-layered-structure.md) **Accepted**

**Status:** Delivered (2026-07-01 — Phase 0–2)

**Type:** Documentation + barrel hygiene (no MCP path renames)

**Risk class:** Low (Phase 0) → Medium (Phase 1 barrel export moves)

**Clean Core impact:** B→B — maintainer clarity only; no kernel vocabulary, lifecycle, or ERP route changes

## Authority decision

P06-011 closes the gap between **PAS-006 runtime capability** (P06-001–P06-010 delivered) and **maintainer navigability** of `packages/shadcn-studio/src`.

The slice implements [ADR-0037](../../../adr/ADR-0037-shadcn-studio-src-layered-structure.md): a **four-layer logical model** (L1 Authority · L2 Product · L3 Surfaces · L4 Lab) documented on **unchanged MCP physical paths**.

**Kernel-authority boundary (PAS-001):**

| Question | Answer | Owner |
| --- | --- | --- |
| Does P06-011 add kernel vocabulary? | **No** | PAS-006A |
| Does P06-011 rename MCP install paths? | **No** — `components/ui/` and `components/shadcn-studio/blocks/` frozen | ADR-0017 · ADR-0037 |
| Does P06-011 change block lifecycle or acceptance? | **No** | PAS-006B/C |
| Does P06-011 touch `foundation-disposition.registry.ts`? | **No** | foundation-registry-owner |

## Purpose

Give engineers and agents a single structure contract so they know:

- Which layer they are editing (L1–L4)
- Which “contract” file type applies
- Why `registry/` and `governance/` both exist
- What the public barrel may export vs lab-only surfaces

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md

1. Objective    — Document L1–L4 layered structure; disambiguate contract vocabulary; hygiene public barrel (remove lab from main export); relabel PAS-005A headers to PAS-006.
2. Allowed layer— packages/shadcn-studio/ARCHITECTURE.md · packages/shadcn-studio/README.md · packages/shadcn-studio/src/index.ts · packages/shadcn-studio/package.json (exports) · packages/shadcn-studio/src/** (comment headers only in Phase 1) · apps/storybook/** (import path updates if barrel split) · docs/PAS/PRESENTATION/** · docs/adr/ADR-0037*
3. Files        —
   Phase 0 (required):
     packages/shadcn-studio/ARCHITECTURE.md
     packages/shadcn-studio/README.md
     docs/adr/ADR-0037-shadcn-studio-src-layered-structure.md
     docs/PAS/PRESENTATION/SLICE/p06-011-src-structure-clarity.md
     docs/PAS/PRESENTATION/SLICE/presentation-slice-catalog.md
     docs/PAS/PRESENTATION/SLICE/README.md
     docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md (§2 link only)
   Phase 1 (required):
     packages/shadcn-studio/src/index.ts
     packages/shadcn-studio/package.json
     packages/shadcn-studio/src/lab/index.ts (new — lab barrel)
     apps/storybook/** (consumers of story-parameters)
     packages/shadcn-studio/src/index.ts header comment
     packages/shadcn-studio/src/theme/theme-preset.contract.ts header
     packages/shadcn-studio/src/_storybook/story-parameters.ts header
   Phase 2 (delivered):
     .cursor/skills/shadcn-studio/SKILL.md
     .cursor/skills/afenda-storybook/SKILL.md
     .cursor/skills/afenda-presentation-atlas/SKILL.md
     packages/shadcn-studio/src/**/*.stories.tsx (lab import path)
     packages/shadcn-studio/src/_storybook/block-flat-story.helpers.tsx
     scripts/storybook/generate-block-auto-stories.mjs
     packages/shadcn-studio/tsconfig.stories.json
     apps/storybook/tsconfig.storybook.json
   Phase 3 (deferred — separate approval):
     Physical lab/ folder consolidation — NOT in initial close
4. Prohibited   — Rename components/ui/ or components/shadcn-studio/blocks/ · shadcn --overwrite on existing ui/* · @afenda/kernel import · foundation-disposition.registry.ts · ERP route changes · PAS-005 slice re-execution · moving contracts/registry/governance under components/
5. Authority    — ADR-0037 · PAS-006A · ADR-0027 · shadcn-studio skill · afenda-primitive-contract skill
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm check:studio-import-zones
   pnpm check:studio-metadata-binding
   pnpm check:studio-block-slot-markers
   pnpm --filter @afenda/storybook typecheck (Phase 1)
   pnpm check:documentation-drift
7. Closes       — Maintainer structure contract · ADR-0037 implementation · PAS-006A §2 architecture link
8. Evidence     —
   packages/shadcn-studio/ARCHITECTURE.md
   packages/shadcn-studio/README.md
   docs/adr/ADR-0037-shadcn-studio-src-layered-structure.md
   pnpm check:studio-import-zones (green)
9. Attestation  — Documentation · Barrel · Governance gate · ADR Accepted
```

## P06-011 MUST rules

1. MCP install paths (`components/ui/`, `components/shadcn-studio/blocks/`) MUST NOT move or rename.
2. L1 Authority folders (`contracts/`, `registry/`, `governance/`) MUST remain at `src/` root — not nested under `components/`.
3. Zone A/B import policy MUST remain enforced by `pnpm check:studio-import-zones`.
4. `ARCHITECTURE.md` MUST define all four contract vocabulary terms (primitive, block, wire, data).
5. Main barrel (`index.ts` / package `"."` export) MUST NOT export L4 lab story parameters after Phase 1.
6. Lab exports MUST move to `@afenda/shadcn-studio/lab` subpath or Storybook-local relative imports.
7. PAS-005A user-facing header comments in touched files MUST relabel to PAS-006A (no slice id resurrection).
8. Phase 3 physical lab moves are **out of scope** for initial slice close.
9. No primitive contract/adapter file splits in this slice — documentation and exports only.
10. `governance/` MUST be documented as gate aggregation, not parallel inventory SSOT.

## Implementation sequence

| Phase | Action | Closes |
| ---: | --- | --- |
| **0** | ADR-0037 + `ARCHITECTURE.md` + package `README.md` + catalog sync | Structure vocabulary live |
| **1** | Lab barrel split; PAS-006 header relabel; Storybook import fix | Public contract hygiene |
| **2** | PAS-006A §2 link; shadcn-studio skill cross-link | Doc authority chain |
| **3** | (Deferred) `lab/` folder consolidation | Future slice if needed |

### Phase 0 deliverable checklist

- [x] ADR-0037 reviewed and **Accepted**
- [x] `ARCHITECTURE.md` layer diagram + file naming table
- [x] `README.md` quick start (commands, links, layer summary)
- [x] Catalog + SLICE README list P06-011

### Phase 1 deliverable checklist

- [x] `package.json` adds `"./lab"` export pointing to `dist/lab/index.js`
- [x] `src/lab/index.ts` re-exports `_storybook/story-parameters` (and lab-only helpers)
- [x] `src/index.ts` removes L4 exports
- [x] Storybook stories import via `./lab/index.js` (in-package) per import zone gate
- [x] Header comments: `PAS-005A` → `PAS-006A` in `index.ts`, `theme-preset.contract.ts`, `_storybook/story-parameters.ts`

### Phase 2 deliverable checklist

- [x] `shadcn-studio` skill links `ARCHITECTURE.md` + documents lab subpath
- [x] `afenda-storybook` skill documents lab import matrix
- [x] `afenda-presentation-atlas` links `ARCHITECTURE.md`
- [x] Codegen emits `./lab/index.js` imports
- [x] `tsconfig.stories.json` + `tsconfig.storybook.json` resolve `@afenda/shadcn-studio/lab`

## DoD

| # | Criterion | Gate / evidence |
| --- | --- | --- |
| 1 | Four-layer model documented and matches ADR-0037 | `ARCHITECTURE.md` review |
| 2 | Contract vocabulary table present | `ARCHITECTURE.md` § naming |
| 3 | MCP paths unchanged | `components.json` diff empty |
| 4 | Import zones green | `pnpm check:studio-import-zones` |
| 5 | Main barrel has no lab exports (Phase 1) | `src/index.ts` grep + typecheck |
| 6 | Storybook typecheck green (Phase 1) | `pnpm --filter @afenda/storybook typecheck` |
| 7 | Package build + tests green | `pnpm --filter @afenda/shadcn-studio test:run` · `build` |
| 8 | PAS catalog lists P06-011 Delivered | `presentation-slice-catalog.md` |

## Out of scope

| Item | Deferred to |
| --- | --- |
| Primitive contract batch upgrades | afenda-primitive-contract skill / future slices |
| ERP operator route expansion | PAS-001A · apps/erp |
| Physical rename `shadcn-studio/blocks` → `blocks` | Requires ADR + MCP alias migration |
| Merge `governance/` into `registry/` | Phase 3+ only with gate refactor |
| PAS-005 doc tree edits | Retired lane — historical only |

## Related

- [ADR-0037](../../../adr/ADR-0037-shadcn-studio-src-layered-structure.md)
- [PAS-006A](../PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md)
- [P06-SHELL-001](./p06-shell-001-app-shell-authority.md) — L3 Surfaces reference
- [Presentation slice catalog](./presentation-slice-catalog.md)
