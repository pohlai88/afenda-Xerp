---
name: css-authority
description: Enforces @afenda/css-authority — CSS token authority via authority JSON sources, generated CSS-TOKEN-* registry, vendored shadcn theme, and consumption validation. Use when touching packages/css-authority, adding CSS custom properties, PAS-005 slices, or check:css-governance gates.
paths:
  - packages/css-authority/**
  - docs/PAS/PAS-005*.md
  - docs/architecture/css-authority.md
---

# @afenda/css-authority — Authority Skill (PAS-005)

## PAS rollout status (mirror header — sync on slice close)

| Field | Value |
| --- | --- |
| **Runtime status** | B26–B37 delivered — 605-token registry (465 afenda + 44 appshell + 50 auth-editorial + 46 shadcn); consumption R23–R30 + domain-sync + bridge + visual contract + docs pixel baselines pass |
| **Remaining slices** | none — optional enhancements only |

> Canonical: [`docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md`](../../docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md) · Closure: [`pas-status-index.md`](../../docs/PAS/pas-status-index.md)

---

## Boundary (one sentence)

`@afenda/css-authority` **owns CSS token authority — authority JSON sources, generated CSS Authority Registry (`CSS-TOKEN-*`), vendored shadcn theme, Afenda extension CSS, and consumption validation; it never owns Governed UI variant/recipe/state registries, React UI primitives, AppShell block TSX, or app composition beyond CSS exports.**

**Constitutional sentence:** CSS truth is proven through authority sources, a generated CSS Authority Registry, and validation gates — not developer memory or ad-hoc custom properties.

---

## When to use this skill

Apply when touching:

- `packages/css-authority/**`
- any `@afenda/css-authority` import or CSS bundle export
- CSS custom property allowlists (`CSS-TOKEN-*`, `--background`, etc.)
- PAS-005 slices under `docs/PAS/slice/`
- `check:css-governance` / R22–R30 consumption gates

**Design-system boundary:** `@afenda/design-system` retains Governed UI variant/recipe TS governance in v1. CSS monolith is a **B30 deprecation shim** — runtime bridge lives in `@afenda/css-authority`. Do not expand `token.registry.ts` palette or hand-edit generated CSS.

---

## Hard stops

### Prohibited imports — never add runtime dependencies on:

```
@afenda/architecture-authority
@afenda/database
@afenda/design-system
@afenda/metadata
@afenda/metadata-ui
@afenda/kernel
@afenda/ui
@afenda/appshell
apps/erp
React
Next.js
```

### Must never hand-edit

```
src/generated/css-authority-registry.ts
src/generated/css-authority-registry.json
```

Regenerate: `pnpm --filter @afenda/css-authority generate:css-authority-registry`

### Must never own (v1)

```
Variant/recipe/state registries (Governed UI)
Governed UI primitive components
Studio block TSX
ERP business logic
```

---

## Authority hierarchy

```txt
PAS-005 (docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md)
  → src/authorities/*.json (token domains + css-files inventory + id-sequence)
  → pnpm generate:css-authority-registry
  → src/generated/css-authority-registry.*
  → check:css-authority-conformance
  → check:css-authority-consumption · check:css-authority-domain-sync · check:css-authority-bridge-sync · check:css-visual-regression
  → check:css-governance (R6–R30)
  → dist/css/afenda-css-authority.css
```

---

## Required gates

```bash
pnpm --filter @afenda/css-authority typecheck
pnpm --filter @afenda/css-authority test:run
pnpm --filter @afenda/css-authority build
pnpm check:css-authority-conformance
pnpm check:css-authority-consumption
pnpm check:css-authority-domain-sync
pnpm check:css-authority-bridge-sync
pnpm check:css-visual-regression
pnpm check:css-governance
pnpm check:foundation-disposition
pnpm quality:boundaries
```

---

## Registry lane

`PKGR05_CSS_AUTHORITY` · `PKG-025` · [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts)

---

## Adding a CSS token

1. Allocate id in `src/authorities/id-sequence.json` (increment `nextTokenId` after assign)
2. Add row to the correct domain JSON under `src/authorities/`
3. Regenerate registry + rebuild
4. Extend tests if new invariants apply
5. Do **not** add ad-hoc `--*` vars in apps without registry row

---

## Canonical docs

| Doc | Path |
| --- | --- |
| PAS-005 | [`docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md`](../../docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md) |
| Derived view | [`docs/architecture/css-authority.md`](../../docs/architecture/css-authority.md) |
| Package pointer | [`packages/css-authority/PAS-005-CSS-AUTHORITY-STANDARD.md`](../../packages/css-authority/PAS-005-CSS-AUTHORITY-STANDARD.md) |
