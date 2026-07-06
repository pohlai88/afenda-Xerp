---
name: afenda-erp-design-system
description: Repo-specific operating guide for Afenda ERP design-system strategy and implementation using shadcn/studio, shadcn/ui, Tailwind CSS v4, Base UI, Storybook, and Geist-inspired interface guidance. Use when planning or building SaaS ERP frontend foundations, @afenda/shadcn-studio-v2 primitives/views/themes, ERP operator surfaces, metadata-driven UI, Storybook design-system evidence, or agent prompts that must stay scalable, KISS, DRY, and aligned with PAS-006 without restoring retired UI stacks.
paths:
  - packages/shadcn-studio-v2/**
  - apps/erp/**
  - apps/developer/**
  - apps/storybook/**
---

# Afenda ERP Design System

Codex/OpenAI interface: `agents/openai.yaml` defines display name and default prompt for non-Cursor agents.

Use this skill to keep ERP presentation work pragmatic: one visual owner, CSS-first tokens, stock shadcn primitives, metadata-aware views, Storybook evidence, and narrow gates. It complements repo skills such as `afenda-coding-session`, `shadcn-studio`, `afenda-tailwind`, `package-css-dist-sync`, and `afenda-storybook`; it does not replace them.

## Load References

Read [repo-authority.md](references/repo-authority.md) before changing or advising on Afenda repo frontend files.

Read [shadcn-tailwind-v4.md](references/shadcn-tailwind-v4.md) when working with shadcn/ui open code, Tailwind v4 CSS-first config, `@theme inline`, OKLCH tokens, or the V2 package/app CSS split.

Read [design-system-fundamentals.md](references/design-system-fundamentals.md) when you need to explain what a design system or frontend layer is, component quality bar, ERP interface defaults, or accessibility/state patterns.

Read [design-system-playbook.md](references/design-system-playbook.md) when choosing design-system architecture, token/component layers, ERP UI patterns, or scope.

Read [research-sources.md](references/research-sources.md) when you need external rationale, source links, or a short evidence trail.

## Operating Order

1. Start with the repo contract.
   - Announce `afenda-coding-session` for coding turns in this repo.
   - State Phase 0 before edits: objective, allowed layer, files, prohibited paths, authority, and gates.
   - Prefer the repo's PAS-006 and `packages/shadcn-studio-v2` docs over generic OSS advice.

2. Identify the layer.
   - Strategy or prompt design: no file edits unless requested.
   - Theme/CSS: `packages/shadcn-studio-v2/src/styles/**`, package CSS dist, app `@import` + `@theme inline` entries.
   - Primitives: `packages/shadcn-studio-v2/src/components/ui/**`.
   - Layout chrome: `packages/shadcn-studio-v2/src/components/layout/**`.
   - Views: `packages/shadcn-studio-v2/src/views/**`.
   - Quarantine: `packages/shadcn-studio-v2/src/components/quarantine/**` (non-public).
   - ERP surface: `apps/erp/**`, `apps/developer/**` consume public package barrels only.
   - Storybook evidence: `apps/storybook/**` documents states, density, a11y, and interaction proof.

3. Discover before creating.
   - Search existing primitives, views, registries, exports, stories, and package docs.
   - Check `components.json`, `package.json` exports, CSS import paths, theme config, and current gates before assuming older instructions are still accurate.
   - Query Storybook MCP docs first when it is available for UI component work.
   - Use Context7 MCP (`/shadcn-ui/ui`, `/tailwindlabs/tailwindcss.com`) for current library behavior.

4. Choose the smallest durable move.
   - Reuse an existing shadcn primitive or view before adding a new abstraction.
   - Use Tailwind class names and semantic shadcn tokens before custom CSS.
   - Add a token only when multiple consumers need the same decision.
   - Add a component wrapper only when it captures real behavior, accessibility, state, or data contract reuse.
   - Add a new package or parallel UI layer only after an ADR; default answer is no.

5. Build through the manufacturing chain.
   - Raw vendor output enters quarantine first.
   - Promote only after normalization, slot/data contract review, theme binding, Storybook proof, and relevant metadata or waiver.
   - Do not mark a block Accepted without a sealed Acceptance Record when PAS-006C applies.
   - Consumer wiring imports from `@afenda/shadcn-studio-v2` public exports only — not package internals or quarantine.

6. Verify with narrow gates.
   - Theme/CSS: build V2 package, sync CSS dist, run drift and APCA checks.
   - Studio V2 package: taxonomy, typecheck, tests, build, drift, APCA as relevant.
   - ERP/developer surface: app typecheck/build plus metadata consumer gates.
   - Storybook work: generate stories and run Storybook tests/a11y when the surface needs visual proof.

## Design Doctrine

Use shadcn/ui as open code, not a black-box component library. Afenda owns the resulting design system through `@afenda/shadcn-studio-v2` contracts, registries, tokens, and tests.

Use Tailwind v4 as the design-token runtime. Package CSS defines OKLCH semantic variables in `:root` / `.dark`; consuming apps compose `@import "tailwindcss"`, `@import "shadcn/tailwind.css"`, package CSS exports, `@source` directives, and `@theme inline` to map vars to utilities like `bg-primary` and `text-muted-foreground`.

Use Base UI (`@base-ui/react`) as the primitive substrate in V2 — unstyled, composable, accessibility-oriented.

Use Geist-inspired typography for calm, precise developer-grade ERP surfaces: sans for UI, mono for IDs/amounts/timestamps/technical evidence, and decorative pixel styles only for rare brand moments.

For SaaS ERP, favor dense but readable operator workflows: tables, forms, filters, status, approvals, dashboards, settings, audit evidence, empty/loading/error/forbidden states, and predictable navigation. Avoid marketing layouts, decorative-only UI, and one-off visual flourishes that do not improve repeated work.

## Hard Stops

Stop and ask for architecture direction before:

- Creating a second design-system package, token registry, primitive layer, or CSS authority.
- Restoring `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/ui-composition`, `@afenda/css-authority`, PAS-005 gates, or `ui:guard*`.
- Importing `@afenda/kernel`, auth/database/runtime packages, or ERP routes into `@afenda/shadcn-studio-v2`.
- Deep-importing `@afenda/shadcn-studio-v2/src/**`, `components/**`, or `views/**` from consumers.
- Wiring `components/quarantine/**` or raw vendor output to ERP, developer lab, or Storybook production paths.
- Running overwrite against existing production primitives.
- Adding app-local tokens, variants, recipes, permission constants, tenant/context resolvers, or metadata schemas inside a consumer surface.
- Introducing forbidden token families (`--brand-*`, `--afenda-*`, `--surface-*`) in package or app CSS.
- Changing package CSS source without syncing/checking dist.
- Claiming "latest" external docs or library behavior without checking Context7 or official docs.

## Completion Checklist

- Authority loaded: PAS-006 family, V2 package docs, and relevant reference files.
- Existing inventory checked before creating new primitives, views, tokens, or stories.
- KISS/DRY decision recorded: reuse, extend, or create with reason.
- No parallel source of truth introduced; public import law respected.
- V2 gates run or explicitly reported as not run:
  - `pnpm --filter @afenda/shadcn-studio-v2 test`
  - `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
  - `pnpm --filter @afenda/shadcn-studio-v2 build`
  - `pnpm --filter @afenda/shadcn-studio-v2 check:drift` (theme/CSS changes)
  - `pnpm --filter @afenda/shadcn-studio-v2 check:apca` (theme changes)
- Completion Report follows the Afenda coding-session format when any files were changed.

## Verification

Skill references stay under 500 lines total in `SKILL.md`; depth lives in `references/`. When advising on tokens or CSS, confirm against live `packages/shadcn-studio-v2/package.json` exports before giving import paths.
