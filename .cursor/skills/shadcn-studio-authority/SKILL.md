---
name: shadcn-studio-authority
description: Enforces @afenda/shadcn-studio — shadcn/studio theme surface, preset runtime, MCP install targets, and governed presentation inventory (PAS-005A). Use when touching packages/shadcn-studio, theme presets, ThemeCustomizer, PAS-005A slices, or shadcn-studio MCP cwd.
paths:
  - packages/shadcn-studio/**
  - docs/PAS/PAS-005A*.md
---

# @afenda/shadcn-studio — Authority Skill (PAS-005A)

## PAS rollout status (mirror header — sync on slice close)

| Field | Value |
| --- | --- |
| **Runtime status** | B42p delivered — ERP + Storybook import `@afenda/shadcn-studio/shadcn-studio.css`; delegating-flip policy registry (68 rows); legacy `shadcn-studio/` path deleted (B42h); strangler complete |
| **Remaining slices** | B44–B49 under [PAS-005B](../../../docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) — appshell consolidation (B48); optional delegating per block |

> Canonical: [`docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md`](../../../docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) · Parent: [`PAS-005`](../../../docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md) · Retirement: [`PAS-005B`](../../../docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) · Closure: [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md)

---

## Boundary (one sentence)

`@afenda/shadcn-studio` owns **shadcn/studio theme surface, preset vocabulary, runtime preset application, MCP install targets, and governed presentation blocks/primitives**; it never owns CSS-TOKEN registry authority, Afenda `--afenda-*` token decisions, AppShell chrome, ERP wiring, or business behavior.

---

## When to use this skill

Apply when touching:

- `packages/shadcn-studio/**`
- theme presets, `ThemeCustomizer`, `settings-context.tsx`
- `shadcn-studio.config.json`, `.cursor/mcp/shadcn-studio.mjs`
- PAS-005A slices (`b38`–`b42p`)
- MCP `/rui`, `/cui`, `install-theme` install targets
- PAS-005B B48 appshell presentation consolidation

**Integration rule (B42+):** ERP and appshell consume this package via public exports and CSS. Package source must not import `@afenda/css-authority` TS — CSS dist alignment only per PAS-005A §3.3.

**PAS-005B hard rule:** shadcn-studio owns presentation product/block truth — not CSS-TOKEN registry (PAS-005 / css-authority).

---

## Decision matrix

| Question | If yes → | In shadcn-studio? |
| --- | --- | --- |
| shadcn CSS variable or preset palette? | Theme surface | **Yes** |
| Runtime preset switching / ThemeCustomizer? | Presentation runtime | **Yes** |
| MCP-installed primitive or block? | Inventory | **Yes** |
| CSS-TOKEN-* registry entry? | Authority JSON | **No** — PAS-005 |
| `--afenda-*` semantic token? | Afenda extension | **No** — PAS-005 |
| `--app-shell-*` geometry? | AppShell | **No** — `@afenda/appshell` |
| Governed UI governed primitive props? | UI governance | **No** until B42 |
| ERP routes / server data? | Application | **No** — `apps/erp` |
| Migrating appshell legacy studio? | Wrong approach | **No** — re-seed MCP; delete on B42 |
| Lab/Storybook preset proof? | Product verification | **Yes** (B41) |

---

## Hard stops

### Prohibited imports (Phase 1)

```
@afenda/css-authority   @afenda/design-system   @afenda/ui
@afenda/appshell        @afenda/metadata-ui     @afenda/kernel
@afenda/permissions     @afenda/database        apps/erp
```

### Must never own

```
CSS-TOKEN-* registry edits
--afenda-* token source
Foundation phase 04 primitive governance
AppShell chrome blocks
ERP wiring
Legacy appshell studio migration (copy/move)
Direct _reference/ runtime imports
Permission / tenant resolution
```

### Documentation-only slices

When task is docs/skill only:

```
Do not modify packages/shadcn-studio/src/**
Do not mark runtime capability complete
Do not retarget ERP imports
```

---

## Phase 0 — change contract

Before editing shadcn-studio files:

```
1. Objective       — exact change, one sentence
2. Allowed layer   — packages/shadcn-studio/** (+ slice-listed config paths)
3. Files to change — explicit list from slice handoff field 3
4. Prohibited      — handoff field 4 + Phase 1 Afenda imports
5. Authority       — PAS-005A · ADR-0017 · slice handoff
6. Gates           — pnpm --filter @afenda/shadcn-studio typecheck
                     pnpm --filter @afenda/shadcn-studio test:run
                     pnpm --filter @afenda/shadcn-studio build
                     (+ slice-specific gates)
```

---

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio   # when CSS exists
pnpm check:package-css-dist-sync                                # when CSS exists
pnpm check:foundation-disposition
pnpm quality:boundaries
```

B42 integration adds: `pnpm check:css-visual-regression`, `pnpm ui:guard:scan`, `pnpm ui:guard`

---

## MCP install rules

| Workflow | Target |
| --- | --- |
| `install-theme` | `src/styles/shadcn-studio.css` |
| `/rui` | `src/components/ui/` |
| `/cui` | `src/blocks/` |

**Cwd:** `packages/shadcn-studio` (after B38)

**Rule:** Collect all items before install. Credentials in `.env.secret` only.

---

## Slice sequence

| Slice | Doc | Scope |
| --- | --- | --- |
| B38 | `b38-pas005a-scaffold.md` | Package scaffold + MCP retarget |
| B39 | `b39-pas005a-theme-presets.md` | Presets + ThemeCustomizer |
| B40 | `b40-pas005a-mcp-seed.md` | MCP seed |
| B41 | `b41-pas005a-lab-verification.md` | Storybook lab | Delivered |
| B42 | deferred | Afenda integration |

---

## Doctrine

PAS-005 owns the **words** (CSS-TOKEN registry). PAS-005A owns the **presentation product** (theme experience + studio inventory). B42 owns the **bridge**.

> Build the product first. Bridge to Afenda second. Delete legacy — never migrate it.
