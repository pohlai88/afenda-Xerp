# shadcn-studio-v2 Design System Guideline

## Document status

| field | Value |
| --- | --- |
| Mode | Internal quality law (gates + boundaries) |
| Audience | Engineers editing `@afenda/shadcn-studio-v2` or V2 consumers |
| Authority chain | `DESIGN-SYSTEM-ARCHITECTURE.md` → this file → tests / drift scripts |
| Executable SSOT | Tests and scripts listed below — this doc mirrors them; tests win on conflict |

## Purpose

State the **minimum quality bar** for the greenfield V2 package: tokens, CSS,
exports, runtime boundaries, and consumer import law. Narrative architecture
lives in `DESIGN-SYSTEM-ARCHITECTURE.md`; folder law lives in `TAXONOMY.md`.

### File naming (kebab-only)

Structural file stems are defined in `TAXONOMY.md` → **File stem law** and **Prefix law (IF logic)**:

- kebab-case stems only; no PascalCase/camelCase filenames
- **IF** a prefix lane applies (`use-`, `widget-`, `appshell-`), the stem starts with that prefix
- hyphen segment count is not fixed
- enforced by `src/__tests__/taxonomy.test.ts`

## Non-goals

- Replacing `TAXONOMY.md` or slice specs
- Customer-facing documentation or API portal content
- Broad ERP migration planning (see `MIGRATION-MAP.md`)

---

## 1. Token and CSS authority

### Approved package CSS files

Only these files may exist under `src/styles/` unless this guideline and
`TAXONOMY.md` are amended in the same slice:

| File | Role |
| --- | --- |
| `shadcn-default.css` | Canonical semantic baseline (`:root` / `.dark`) |
| `afenda-brand.css` | Brand overlay (`kind: brand` in `theme-config.ts`) |
| `swiss-noir.css` | Editorial overlay |
| `verdant-noir.css` | Editorial overlay |

### Token rules

- Use **canonical shadcn token names only** — see `CANONICAL_THEME_TOKEN_NAMES` in `configs/theme-config.ts`.
- **Forbidden families** in package CSS and reusable TSX: `--afenda-*`, `--brand-*`, `--surface-*`, `--luxury-*`, `--shadow-*`, `--gradient-*`, and near-duplicates such as `--primary-2`, `--background-alt`, `--muted-2`.
- Theme overlay files may override **only** tokens declared in `shadcn-default.css`.
- selectors in theme CSS: `:root` and `.dark` only.
- Values: literal **OKLCH** in CSS authority files — no `oklch(var(--token))` double-wrap.
- Text pairs (e.g. `background` / `foreground`) must meet **WCAG AA 4.5:1** in light and dark (`check:apca`, `style-governance.test.ts`).

### Package CSS must not contain

Tailwind app directives: `@import "tailwindcss"`, `@tailwind`, `@apply`, `@theme`, `@plugin`, `@utility`, `@custom-variant`, `@source`, or app `@layer base` blocks with `:root` / `.dark`.

**App boundary:** consuming apps own Tailwind entry, `@theme inline`, radius, shadows, and font mapping in `globals.css` — not inside package token files.

### CSS consumption

- Apps import **package CSS exports only** (`@afenda/shadcn-studio-v2/shadcn-default.css`, `@afenda/shadcn-studio-v2/themes/*`).
- Never import `packages/shadcn-studio-v2/src/styles/*` from consumers.
- After editing package CSS sources, run `pnpm --filter @afenda/shadcn-studio-v2 build` (dist copy) before consumer visual verification.

---

## 2. Reusable surface styling (TSX)

- **No raw hex** in reusable component or view TSX under `src/components/` and `src/views/`.
- Use **semantic Tailwind utilities** tied to canonical tokens (`bg-primary`, `border-border`, `text-muted-foreground`, etc.).
- Primitives prove token-safe class helpers via `primitive-baseline.test.ts` and `primitive-extension.test.ts`.

---

## 3. Public export and import law

### Package entrypoints

| Export | Role |
| --- | --- |
| `@afenda/shadcn-studio-v2` | Neutral surfaces, slot constants, types |
| `@afenda/shadcn-studio-v2/clients` | Client providers, hooks, composed views, primitives used in client trees |
| `@afenda/shadcn-studio-v2/server` | Server-safe helpers only |
| `@afenda/shadcn-studio-v2/metadata` | Metadata builders |
| `@afenda/shadcn-studio-v2/theme` | Theme runtime boundary (prefer `/clients` in Turbopack dev consumers) |
| `@afenda/shadcn-studio-v2/*.css` | CSS exports |

### Consumer rules

- **No deep imports** into `@afenda/shadcn-studio-v2/components`, `/views`, `/contexts`, `/src`, or internal style paths.
- **Provider + hook entrypoint alignment:** when a consumer uses `useTheme` from `/clients`, wire `StudioPresentationProviders` from `/clients` as well (avoids split theme-provider graphs under Turbopack).
- Proof route import boundary: `apps/developer/src/app/design-system/v2-proof/__tests__/v2-proof-import-boundary.test.ts`.

---

## 4. Runtime boundary

- `theme-provider`, `studio-provider`, theme hooks, and theme UI live in **client** surfaces (`clients.ts`, `contexts/theme-boundary.ts`).
- `index.ts` and `server.ts` must **not** export client runtime providers (`runtime-boundary.test.ts`).
- Theme persistence is configurable via `storageKey`; SSR/hydration-sensitive UI must use mounted gates in consumers (see developer `hydration-resolution.metadata.ts`).

---

## 5. Theme promotion gate

Before adding a new named theme file:

1. Amend `TAXONOMY.md` `styles/` list.
2. Add overlay CSS under `src/styles/` with `:root` / `.dark` only.
3. Register theme in `configs/theme-config.ts` with literal OKLCH token maps.
4. Add `package.json` export + dist copy in build script.
5. Extend `check:drift`, `check:apca`, and `style-governance.test.ts` expectations.
6. Prove on consumer proof route (`/design-system/v2-proof`) before claiming production readiness.

---

## 6. Primitive contract pointer

Phase 3 primitive API rules are defined in `PRIMITIVE-API-CONSISTENCY.md` and
enforced by:

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:primitives
```

---

## 7. Required verification gates

### Package (every slice touching V2)

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 check:apca
pnpm exec biome ci packages/shadcn-studio-v2
```

### Consumer proof (after export or CSS changes)

```bash
pnpm --filter @afenda/developer verify:v2-proof
pnpm --filter @afenda/developer build
```

### Drift and governance scripts

| Script | Enforces |
| --- | --- |
| `scripts/check-design-system-drift.ts` | Tokens, themes, hex, deep imports, legacy paths |
| `scripts/check-theme-apca.ts` | APCA contrast on theme token pairs |
| `src/__tests__/style-governance.test.ts` | CSS file set, exports, `components.json` tailwind path |
| `src/__tests__/public-exports.test.ts` | Export surface stability |
| `src/__tests__/runtime-boundary.test.ts` | Client/server export separation |

---

## 8. When to amend this file

Amend **only** when adding or removing an executable gate, token family rule, or
export boundary. Do not use this file for slice narratives or migration status —
use `docs/slices/*` and `MIGRATION-MAP.md`.
