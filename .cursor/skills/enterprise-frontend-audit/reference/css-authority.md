# CSS Authority Audit Reference (PAS-005)

Read this file **before** [design-system.md](design-system.md) during Phase 3.

Canonical authority: [`docs/architecture/css-authority.md`](../../../docs/architecture/css-authority.md) ·
[`.cursor/skills/css-authority/SKILL.md`](../../css-authority/SKILL.md)

---

## Shared contract (both enterprise-frontend-audit and ui-consistency-bundle)

### shadcn-first consumption rule (ERP new code)

- Prefer `var(--foreground)`, `var(--muted-foreground)`, `var(--border)`, `bg-primary` — not `var(--afenda-semantic-*)`
- Layout/spacing may use `var(--afenda-spacing-*)` until extension cutover
- Audit proof uses `CSS-TOKEN-*` from `packages/css-authority/src/generated/css-authority-registry.ts`

### css-authority hard stops

```
Hand-editing packages/css-authority/src/css/vendored/shadcn-theme.css
Hand-editing packages/css-authority/src/generated/css-authority-registry.*
Defining @theme outside @afenda/css-authority or design-system shim
Prefixing runtime shadcn vars (--afenda-background) — prefix files/records only
Adding new --afenda-semantic-* aliases that only mirror shadcn vars
Importing afenda-appshell-studio.css from apps
```

### CSS gate set (run after CSS/token edits — B28–B33 wired)

```bash
pnpm quality:css
pnpm check:css-authority-conformance
pnpm check:css-authority-consumption
pnpm check:css-authority-bridge-sync
pnpm check:css-visual-regression
pnpm check:css-governance
pnpm check:package-css-dist-sync   # after package CSS src edits
```

---

## Phase 3.0 — Authority inventory

Before any CSS edit, map the shadcn-first chain:

```txt
Layer 0 — @afenda/css-authority
  src/css/vendored/shadcn-theme.css     IMMUTABLE — --background, --primary, --border, …
Layer 1 — @afenda/css-authority
  src/css/afenda-runtime-bridge.css     @theme + bridge (generated bundle)
  src/authorities/*.json                authority JSON sources
Layer 2 — @afenda/design-system (B30 deprecation shim + token shim)
  css/afenda-tokens.css                 --afenda-* raw tokens (transitional)
  css/afenda-design-system.css          @deprecated — re-exports tokens + css-authority bundle
Layer 3 — @afenda/ui
  afenda-ui.css                         imports tokens shim + css-authority bundle
Layer 4 — @afenda/appshell
  --app-shell-*, .app-shell-studio-*    geometry only — prefer shadcn utilities
```

**Discovery checklist:**

```
[ ] Read packages/css-authority/src/authorities/shadcn-theme.json — vendored version
[ ] Confirm shadcn-theme-sync.test.ts passes (checksum / version alignment)
[ ] List in-scope CSS-TOKEN-* rows from generated registry
[ ] Verify afenda-ui.css import order: design-system tokens → css-authority bundle
[ ] Confirm apps import afenda-appshell.css only — never studio CSS directly
[ ] Flag --afenda-semantic-* in ERP CSS — candidate for shadcn var migration
```

---

## Phase 3.0.1 — shadcn-first conformance

| File | Editable? | Rule |
|------|-----------|------|
| `packages/css-authority/src/css/vendored/shadcn-theme.css` | **No** | Regen via `sync-shadcn-theme-authority.ts` only |
| `packages/css-authority/src/generated/css-authority-registry.*` | **No** | `pnpm --filter @afenda/css-authority generate:css-authority-registry` |
| `packages/css-authority/src/authorities/*.json` | Yes | Allocate id in `id-sequence.json` first |
| `packages/design-system/src/registries/token.registry.ts` | Strangler only | Do not expand palette; no new semantic re-aliases |
| `packages/appshell/src/styles/afenda-appshell-studio.css` | Yes | Thin 1:1 shadcn mirrors over time |

**Forbidden:**

- Prefixing runtime vars (`--afenda-background` instead of `--background`)
- New `--afenda-semantic-*` that only re-wrap `--card`, `--muted`, etc.
- Hand-editing vendored theme for brand tweaks — use optional `afenda-brand-overrides.css` extension file instead

---

## Phase 3.0.2 — Consumption audit

Grep patterns to flag in consumer CSS (ERP, appshell, metadata-ui):

```
oklch(          # outside authority token files
#[0-9a-fA-F]{3,8}   # raw hex in consumer CSS
--afenda-semantic-  # new ERP code — migrate to shadcn vars
@theme              # outside css-authority or design-system shim
afenda-appshell-studio.css   # direct app import
```

**Correct consumption:**

| Violation | shadcn-first fix |
|-----------|------------------|
| `var(--afenda-semantic-text-secondary)` | `var(--muted-foreground)` |
| `var(--afenda-semantic-border-default)` | `var(--border)` |
| `var(--afenda-semantic-surface-card)` | `var(--card)` |
| Unregistered new `--my-custom-*` in package CSS | Add `CSS-TOKEN-*` row or use existing shadcn var |

---

## Phase 3.0.3 — Extension registry

Adding a new CSS custom property:

1. Increment `nextTokenId` in `packages/css-authority/src/authorities/id-sequence.json`
2. Add row to correct domain JSON (`afenda-extensions.json`, `appshell.json`, etc.)
3. Run `pnpm --filter @afenda/css-authority generate:css-authority-registry`
4. Run `pnpm --filter @afenda/css-authority build`
5. Extend tests if new invariants apply

Full workflow: [css-authority SKILL §Adding a CSS token](../../css-authority/SKILL.md)

---

## Phase 3.0.4 — Bridge drift

```
[ ] pnpm check:css-authority-bridge-sync passes
[ ] Studio §A bridge vars that mirror shadcn 1:1 flagged for deletion
    (e.g. --app-shell-studio-surface-card: var(--card) → use var(--card) inline)
[ ] Auth editorial scrims documented as explicit override zone (not shadcn-default)
[ ] No Part B hand-written bridge drift vs vendored shadcn theme
```

Studio pattern map: `packages/appshell/src/shadcn-studio/STUDIO-PATTERN-MAP.md`

---

## Phase 3.0.5 — Gates (Phase 12 verification)

| Command | When |
|---------|------|
| `pnpm quality:css` | Every audit turn touching CSS |
| `pnpm check:css-authority-conformance` | Registry + authority JSON alignment |
| `pnpm check:css-authority-consumption` | Unregistered custom property scan (R23–R27) |
| `pnpm check:css-authority-bridge-sync` | Bridge / vendored theme drift |
| `pnpm check:css-visual-regression` | B33 import-chain + Storybook composed spot-check |
| `pnpm check:css-governance` | Monorepo CSS registry + R6–R20 rules |
| `pnpm --filter @afenda/css-authority build` | After authority JSON or CSS source edits |
| `pnpm check:package-css-dist-sync` | After appshell/ui/metadata-ui CSS src edits |

---

## Dual authority model (CSS vs TS)

| Concern | Authority | Path |
|---------|-----------|------|
| CSS tokens (runtime) | `@afenda/css-authority` | `src/authorities/`, vendored shadcn theme |
| CSS registry IDs | Generated | `CSS-TOKEN-*` in registry |
| TIP-004 variants/recipes | `@afenda/design-system` (v1) | TS registries — not new CSS palette |
| Docs editorial | `apps/docs` | `--docs-editorial-*` (separate stack) |
