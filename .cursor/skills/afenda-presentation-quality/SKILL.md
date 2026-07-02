---
name: afenda-presentation-quality
description: >-
  ERP presentation quality composer for PAS-006 Phase 1 work. Use when touching
  apps/erp UI, packages/shadcn-studio blocks, Storybook presentation stories,
  metadata operator surfaces, or ERP globals.css. Composes shadcn-studio and
  afenda-tailwind authority with review skills — replaces retired
  ui-consistency-bundle and ui:guard for ERP.
paths:
  - apps/erp/**
  - packages/shadcn-studio/**
  - apps/storybook/**
---

# Afenda Presentation Quality (PAS-006)

Thin composer — **does not duplicate** PAS-006 authority. Read child skills in order when doing ERP presentation work.

**Inventory first:** [`afenda-presentation-atlas`](../afenda-presentation-atlas/SKILL.md) — `/afenda-presentation-atlas` · primitives, blocks, `@afenda/shadcn-studio` exports (read-only).

## When to use

| Trigger | Read first |
| --- | --- |
| MCP block install / studio package edit | `shadcn-studio/SKILL.md` |
| `components-ui/**` primitive edit | `afenda-primitive-contract/SKILL.md` + mismatch frame on E0 |
| ERP refactor / AI-generated TSX review | `afenda-react-surface-quality/SKILL.md` |
| ERP `globals.css`, `preview.css`, or Tailwind in TSX | `afenda-tailwind/SKILL.md` |
| ERP metadata operator route | `shadcn-studio/SKILL.md` + IS-003 consumer gate |
| Storybook presentation lab | `afenda-storybook/SKILL.md` |
| Component structure review | `vercel-composition-patterns` (vendor) |
| React/TS review before merge | `typescript-react-reviewer` (vendor) |
| RSC performance | `vercel-react-best-practices/react-best-practices` (vendor) |
| Bundle size, lazy-load, CVA, dynamic import | `afenda-shadcn-performance/SKILL.md` |

## Phase 1 CSS (PAS-006A — do not optimize)

**Constitutional rule:** Phase 1 is **pure shadcn + Tailwind** — stabilize with stock blocks and utilities first. Do not refactor theme tokens, extract CSS modules, or polish bespoke CSS.

**Composition entries only** — no custom visual rules in app CSS:

| File | Role |
| --- | --- |
| `apps/erp/src/app/globals.css` | ERP composition entry |
| `apps/storybook/.storybook/preview.css` | Storybook mirror of ERP chain |

**Allowed in composition entries:**

- `@layer theme, base, components, utilities;` declaration (optional)
- Four `@import`s in AdminCN order (see below)
- `@source` globs for Tailwind scan scope
- Storybook shell min-height/color on `html, body, #storybook-root` only

**Forbidden in composition entries:**

- `@layer components { … }` bespoke rules (layout, typography, panels)
- BEM or legacy class definitions (`.erp-*`, `.app-shell-*`)
- Duplicate theme token definitions (belong in `shadcn-studio.css` only)
- Extra `@import` between the four canonical imports

**Immutable import order** (AdminCN SSOT — matches `_reference` AdminCN `globals.css`):

```txt
1. tailwindcss
2. tw-animate-css
3. shadcn/tailwind.css
4. @afenda/shadcn-studio/shadcn-studio.css   ← theme + @custom-variant (unlayered)
```

Gate: `pnpm check:downstream-integration` validates this four-import chain on ERP and Storybook entries.

**Where styling lives:**

1. Theme tokens → `packages/shadcn-studio/src/styles/shadcn-studio.css` (+ dist sync)
2. Layout/visual → Tailwind `className` on components/blocks, or shadcn `Button` / studio blocks
3. Never → new rules in `globals.css` to fix a one-off page

**Hard stop:** Reaching for `globals.css` to add layout or visual rules → use Tailwind in TSX or install a shadcn block instead.

Detail: [`afenda-tailwind/SKILL.md`](../afenda-tailwind/SKILL.md)

## MCP block install — quarantine → promotion contract

**Install (inbox):** `pnpm studio:shadcn:quarantine add @ss-blocks/<id> --overwrite --yes` — lands in `src/components-quarantine/` per `components.json` install aliases (ADR-0038).

**Production primitives (existing bucket):** `pnpm studio:shadcn add <name> --yes` — blocks `--overwrite` on `components-ui/*`.

**Credentials:** repo root `.env.secret` (`SHADCN_STUDIO_*`) → `pnpm env:sync` for MCP; CLI needs `EMAIL` + `LICENSE_KEY` — [shadcn-studio/reference/credentials-env.md](../shadcn-studio/reference/credentials-env.md).

**Promotion:** Follow [`components-quarantine/README.md`](../../../packages/shadcn-studio/src/components-quarantine/README.md) — move to `components-layouts/` or `components-ui/` only after contract split, slot markers, and registry lifecycle updates.

Studio CLI `--overwrite` in quarantine replaces raw TSX and **removes** Afenda P06-008-R2 DOM markers. After **promotion** to `components-layouts/`:

1. Restore marker layer from git on production path (see [shadcn-studio/reference/base-vega-install.md](../shadcn-studio/reference/base-vega-install.md))
2. Reconcile **Base UI** triggers (`render` prop — no Radix `asChild`)
3. Run `pnpm check:studio-block-slot-markers` + `pnpm check:studio-metadata-binding`
4. Run `pnpm storybook generate`

**Stack:** `base-vega` + `@base-ui/react` primitives — not Radix `--base radix`.

MCP blocks split into two shapes after install:

| Shape | Example | Story location |
| --- | --- | --- |
| **Folder page block** | `login-page-04/login-page-04.tsx` | `shadcn-studio-blocks-auto.stories.tsx` (codegen, zero props) |
| **Flat prop-driven block** | `statistics-card-01.tsx` | `shadcn-studio-blocks.stories.tsx` + `storybook/*.compositions.tsx` (fixtures required) |

**After every MCP install:** `pnpm storybook generate` (runs codegen **and** stories typecheck). Never hand-edit the auto file.

Manifest SSOT: `packages/shadcn-studio/src/storybook/block-story-manifest.generated.json` → `manualStoryRequired` lists blocks needing curated props.

**Curated flat blocks:** `shadcn-studio-blocks-flat.stories.tsx` (33 blocks · light/dark) · fixtures in `storybook/block-flat-story.compositions.tsx` · multi-block preview in `shadcn-studio-blocks-dashboard-preview.stories.tsx`.

## Mandatory gates (ERP — ADR-0027)

```bash
pnpm check:studio-install-paths
pnpm check:studio-quarantine-isolation
pnpm check:downstream-integration        # ADR-0027 chain + CSS import order
pnpm storybook generate                  # after MCP block install — includes stories typecheck
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio build
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm check:studio-metadata-binding       # block registry / binding changes
pnpm check:studio-block-slot-markers     # data-afenda-slot markers
pnpm check:studio-primitive-contracts  # ui/* contract + adapter gate
pnpm check:erp-metadata-pas006-consumer  # ERP operator surface parity (requires fresh @afenda/shadcn-studio dist — gate auto-builds if @/* aliases remain)
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio  # after CSS src edits
pnpm check:package-css-dist-sync
pnpm quality:boundaries
```

## Retired — do not run for ERP

| Retired | Replacement |
| --- | --- |
| `pnpm ui:guard*` | PAS-006 gates above |
| `ui-consistency-bundle` | This skill + `shadcn-studio` + `afenda-tailwind` |
| `govern-primitive` | N/A — `@afenda/ui` removed (ADR-0027) |
| `css-authority` / PAS-005 slices | `shadcn-studio` CSS chain |
| Legacy BEM classes in ERP TSX | Tailwind + shadcn primitives/blocks |

## Layer order

1. `packages/shadcn-studio` — manufacturing (blocks, binding, theme CSS)
2. `apps/erp/src/lib/metadata` — consumer hydration (IS-003)
3. `apps/erp` route pages — compose templates only; **Tailwind `className` here**
4. `apps/storybook` — presentation lab (optional verify)

## Hard stops

- No `@afenda/kernel` imports in `@afenda/shadcn-studio`
- No parallel metadata binding registries in ERP
- No direct imports from `components-quarantine/` in ERP or Storybook — promote per PAS-006B first
- No custom `@layer components` rules in ERP or Storybook composition CSS
- No restoration of `@afenda/ui` / appshell without new ADR

## References

- North star: `docs/NORTHSTAR/shadcn-studio-presentation-north-star.md`
- Blueprint: `docs/BLUEPRINT/shadcn-studio-presentation-blueprint.md`
- PAS-006: `docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md`
- PAS-006A product runtime: `docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md`
- Lane boundaries: `docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md`
- CSS child skill: `afenda-tailwind/SKILL.md`
- MCP authority: `shadcn-studio/SKILL.md`
- Pro license / env: `shadcn-studio/reference/credentials-env.md`

## Verification

After ERP presentation edits, confirm:

- [ ] `globals.css` / `preview.css` contain **imports + `@source` only** (Phase 1)
- [ ] No legacy package CSS paths in composition entries
- [ ] Theme edits synced: `pnpm sync:package-css-dist` + `pnpm check:package-css-dist-sync`
- [ ] `pnpm check:downstream-integration` passes
- [ ] Studio + ERP typecheck and build pass
- [ ] Metadata binding gates pass when block registry or operator routes changed

```bash
pnpm check:downstream-integration
pnpm --filter @afenda/shadcn-studio typecheck && pnpm --filter @afenda/shadcn-studio build
pnpm --filter @afenda/erp typecheck && pnpm --filter @afenda/erp build
pnpm check:package-css-dist-sync
```
