# Slice B44 — Migration Study + Readiness Gate (PAS-005B §8–§9)

**Prerequisite:** [B43 Author PAS-005B](b43-pas005b-author-retirement-pas.md) delivered · PAS-005 B26–B37 ✓ · PAS-005A B42p ✓ · [ADR-0025](../../../adr/ADR-0025-design-system-retirement.md) **Accepted**

**Status:** Authored (2026-06-29) — execute when retirement track resumes

**Type:** Implementation + governance gate attestation

**Risk class:** Medium — cross-package import scan; doc/registry sync; no package delete in this slice

**Clean Core impact:** A→A (readiness proof only)

## Purpose

Deliver PAS-005B §8 mandatory gate: formal migration study, `check:design-system-retirement-readiness` attestation, and appshell presentation parity inventory — **without** B45–B47 execution unless pre-flight proves already complete.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b44-pas005b-migration-study-readiness-gate.md

1. Objective    — Close B44: formalize migration study table (§Migration study below); verify `pnpm check:design-system-retirement-readiness` green; document appshell vs shadcn-studio block parity gaps; sync pas-status-index + runtime matrix + PAS-005B §9 row to Delivered.
2. Allowed layer— scripts/governance/check-design-system-retirement-readiness.mts (verify only — gate exists) · docs/PAS/CSS-AUTHORITY/** · docs/architecture/afenda-runtime-truth-matrix.md · docs/architecture/afenda-architecture-blueprint.md · .cursor/skills/css-authority/SKILL.md (SYNC header only)
3. Files        —
   docs/PAS/CSS-AUTHORITY/SLICE/b44-pas005b-migration-study-readiness-gate.md
   docs/PAS/CSS-AUTHORITY/SLICE/css-authority-slice-catalog.md
   docs/PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md (§9 B44 status only)
   docs/PAS/pas-status-index.md (PAS-005B section)
   docs/architecture/afenda-runtime-truth-matrix.md (PAS-005B row)
4. Prohibited   — packages/design-system/** recreate · foundation-disposition.registry.ts (delegate registry-owner) · B45 CSS cutover unless B44 attestation records pre-flight green · B47 package delete · expand design-system or token.registry.ts in ui
5. Authority    — PAS-005B §8 · ADR-0025 · PAS-005 §13 (inherited readiness) · css-authority skill · coding-consistency-bundle
6. Gates        —
   pnpm check:design-system-retirement-readiness
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm check:css-authority-domain-sync
   pnpm check:css-governance
7. Closes       — PAS-005B §8 readiness gate · dual token authority blind-spot · B44 slice row · ADR-0025 acceptance criterion #2
8. Evidence     —
   scripts/governance/check-design-system-retirement-readiness.mts (gate output green)
   docs/PAS/CSS-AUTHORITY/SLICE/b44-pas005b-migration-study-readiness-gate.md (§Migration study + §Appshell parity)
   docs/PAS/pas-status-index.md (B44 Delivered)
9. Attestation  — Governance · Documentation · Architecture (retirement readiness)
```

## Pre-flight state (2026-06-29 — verify at execution)

| Check | Expected | Verify command |
| --- | --- | --- |
| Readiness gate | Green | `pnpm check:design-system-retirement-readiness` |
| UI CSS chain | `@afenda/css-authority` only in `afenda-ui.css` | Read `packages/ui/src/styles/afenda-ui.css` |
| Design-system package | Absent from workspace | `Test-Path packages/design-system` → false |
| Registries internalized | Under `packages/ui/src/design-authority/registries/` | Gate §4 `checkDesignAuthorityInternalized` |
| ADR-0025 | Accepted | Read `docs/adr/ADR-0025-design-system-retirement.md` |

If all pre-flight rows pass at execution, mark B44 **Delivered** and queue **B45** only if CSS chain or storybook alias gaps remain.

## Migration study (PAS-005B §8 deliverable)

| Asset (legacy design-system) | Disposition | Destination today | B44 outcome |
| --- | --- | --- | --- |
| `afenda-tokens.css` / `--afenda-*` generation | **Migrate** | `packages/css-authority/src/css/afenda-tokens.css` + `afenda-extensions.json` (465 tokens) | Gate parity ✓ |
| `afenda-design-system.css` monolith | **Retire** | Removed with package | Package absent ✓ |
| `token.registry.ts` TS mirror | **Retire** | css-authority JSON SSOT; optional mirror under `ui/design-authority/registries/token.registry.ts` for Governed UI only | No dual CSS authority |
| `recipe.registry.ts` | **Internalize** | `packages/ui/src/design-authority/registries/recipe.registry.ts` | Present ✓ |
| `variant.registry.ts` | **Internalize** | `packages/ui/src/design-authority/registries/variant.registry.ts` | Present ✓ |
| `state.registry.ts` | **Internalize** | `packages/ui/src/design-authority/registries/state.registry.ts` | Present ✓ |
| `motion.registry.ts` | **Internalize** | `packages/ui/src/design-authority/registries/motion.registry.ts` | Present ✓ |
| `accessibility.registry.ts` | **Internalize** | `packages/ui/src/design-authority/registries/accessibility.registry.ts` | Present ✓ |
| Governance scripts | **Relocate** | `@afenda/ui` governance gates + `ui:guard` | Maintain |
| `@afenda/ui` bridge | **Keep** | `packages/ui/src/governance/design-system.ts` re-exports design-authority | Bridge only — no app imports |

**B44 study outcome for `@afenda/ui`:** **KEEP ui** (default) — registries already internalized; B46 scope is attestation/doc sync unless shrink path ADR opened.

## Appshell parity inventory (PAS-005B §8.3)

| Surface | Authority | B44 action |
| --- | --- | --- |
| Governed blocks | `packages/appshell/src/presentation/blocks/` | Inventory row count vs `@afenda/shadcn-studio` MCP catalog — document gaps in pas-status-index if any |
| Wrapper strangler | `presentation-mcp-wrapper.registry.ts` | Confirm B42p 68-row policy registry unchanged |
| Studio CSS | `afenda-appshell-studio.css` | Confirm internal-only manifest; no app direct import |
| Bridge re-exports | `packages/appshell/src/shadcn-studio-bridge/` | List public exports — no duplicate CSS-TOKEN registry |

At execution: append gap count or "zero gaps" to §Delivery notes.

## Rules frozen

1. Readiness gate must pass before B45 CSS unify or B47 delete.
2. Do not recreate `packages/design-system/`.
3. Registry mutations (`PKGR05B`, PKG004 deprecation) → `foundation-registry-owner` only.
4. B44 does not claim B45–B47 delivered — only readiness + study formalization.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Migration study table committed in this slice (§Migration study) | Manual review |
| 2 | `pnpm check:design-system-retirement-readiness` exit 0 | Shell output in Completion Report |
| 3 | Appshell parity inventory documented (§Appshell parity or "zero gaps") | Manual review |
| 4 | pas-status-index B44 → Delivered; PAS-005B §9 updated | `pnpm check:documentation-drift` |
| 5 | Runtime matrix PAS-005B row reflects B44 closure | `pnpm check:documentation-drift` |

## Delivery notes

*(Implementer fills on slice close.)*
