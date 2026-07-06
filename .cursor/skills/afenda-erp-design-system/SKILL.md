---
name: afenda-erp-design-system
description: Repo-specific guide for Afenda V2 design system — shadcn-studio-v2, Tailwind v4, composition, react-best-practices P1–P8, ERP surface scan B/A/C/Y/T, operator UI. Use when building or reviewing @afenda/shadcn-studio-v2 primitives/views/themes, ERP/developer React surfaces, or PAS-006 presentation work.
disable-model-invocation: true
paths:
  - packages/shadcn-studio-v2/**
  - apps/erp/**
  - apps/developer/**
  - apps/storybook/**
---

# Afenda ERP Design System

Codex/OpenAI interface: `agents/openai.yaml` defines display name and default prompt for non-Cursor agents.

Single entry point for V2 design-system work **and** ERP presentation surface quality (consolidates former `afenda-react-surface-quality` scan tiers). Complements `afenda-coding-session`, `shadcn-studio`, `afenda-tailwind`, `package-css-dist-sync`, `afenda-storybook`, `afenda-presentation-quality`; does not replace implementer bundle or v1 `afenda-primitive-contract`.

## Load References

Pick files from [references/README.md](references/README.md) for the task — **do not read all references**.

Always start with [repo-authority.md](references/repo-authority.md) before file edits.

## Operating Order

1. **Repo contract** — announce `afenda-coding-session`; Phase 0 before edits; PAS-006 + V2 package docs over generic OSS advice.

2. **Identify layer**
   - Theme/CSS: `packages/shadcn-studio-v2/src/styles/**`, CSS dist, app `@theme inline`
   - Primitives: `src/components/ui/**` → composition + react-best-practices P1–P8
   - Views: `src/views/**` → composition + operator-ui-quality
   - ERP/lab: `apps/erp/**`, `apps/developer/**` → surface-quality-scan + rsc-refactor-playbook
   - Storybook: `apps/storybook/**`
   - v1 `packages/shadcn-studio/src/components-ui/**` → stop; use `afenda-primitive-contract`

3. **Discover before creating** — inventory primitives, views, exports, stories, gates; Storybook MCP + Context7 for library behavior.

4. **Smallest durable move** — reuse primitives; compound parts over behavior booleans; semantic tokens before custom CSS; ADR before new package.

5. **Manufacturing chain** — quarantine → normalize → theme → Storybook → public export only.

6. **Verify** — narrow gates per layer (checklist below).

## Design Doctrine

shadcn/ui as **open code** owned via `@afenda/shadcn-studio-v2`. Tailwind v4 + OKLCH semantic vars. Base UI substrate. Geist-inspired ERP density. **Closed named sets** for tokens, variants, and APIs — see agent-design-constraints.

## Hard Stops

Stop and ask before:

- Second design-system package, token registry, or CSS authority
- Restoring `@afenda/ui`, PAS-005, `ui:guard*`
- Kernel/auth/ERP routes inside shadcn-studio-v2
- Deep imports or quarantine wired to consumers
- Boolean behavior props on L1 when compound part exists
- App-local tokens, forbidden `--brand-*` / `--afenda-*` families
- CSS source edits without dist sync
- Moving `"use client"` upward to fix a leaf (redesign split instead)
- Mirroring server truth in client `useState` (B8)

## Completion Checklist

- Authority + relevant references loaded for target layer
- Inventory checked; KISS/DRY decision recorded
- Composition + P1–P8 (primitives) or B/A/C/Y/T (surfaces) applied
- V2 gates run or reported not run:
  - `pnpm studio:v2:primitives` (after `components/ui/**` changes)
  - `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
  - `pnpm --filter @afenda/shadcn-studio-v2 build`
  - `pnpm --filter @afenda/shadcn-studio-v2 check:biome-suppressions` (primitive adds)
  - `pnpm --filter @afenda/shadcn-studio-v2 check:drift` / `check:apca` (theme)
  - `pnpm --filter @afenda/shadcn-studio-v2 test` / `quality` when broader package proof needed
- ERP surface changes: `pnpm --filter @afenda/erp typecheck`; `pnpm test:interaction` when flows change
- After MCP bulk imports: `pnpm studio:v2:normalize-biome`
- Completion Report per `afenda-coding-session` when files changed

## Verification

Keep `SKILL.md` under 500 lines; depth in `references/`. Confirm live `packages/shadcn-studio-v2/package.json` exports before advising import paths.
