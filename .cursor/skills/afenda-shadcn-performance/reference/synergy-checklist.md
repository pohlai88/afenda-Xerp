# Synergy Checklist — shadcn + Tailwind v4 + React

Use per change type. All three layers apply to most ERP UI work.

## New studio primitive or block

### JavaScript

- [ ] Named exports and named imports only
- [ ] No deep imports from `@afenda/shadcn-studio/src/...` in ERP
- [ ] CVA variants trimmed to shipped sizes/variants only
- [ ] New dependency checked with `npx bundle-phobia <package>`
- [ ] Peer deps minimal (`clsx`, `tailwind-merge`, `class-variance-authority`, Base UI only as needed)

### CSS

- [ ] All `className` strings are statically analyzable (no template dynamic segments)
- [ ] Semantic tokens (`bg-primary`) not raw palette (`bg-gray-900`) in ERP
- [ ] No new rules in `globals.css` or `preview.css`
- [ ] If theme CSS changed: `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio`

### React

- [ ] `"use client"` only when hooks/events/browser APIs required
- [ ] No `@afenda/shadcn-studio` import in `error.tsx` / `global-error.tsx`

### Afenda gates

- [ ] `pnpm check:studio-import-zones`
- [ ] `pnpm check:studio-metadata-binding` (blocks)
- [ ] `pnpm --filter @afenda/shadcn-studio typecheck`

---

## ERP route or module surface

### JavaScript

- [ ] Heavy deps lazy-loaded with `next/dynamic` (>50KB or modal-only)
- [ ] `Skeleton` loading state for lazy components
- [ ] Lucide icons imported by name

### CSS

- [ ] Layout via Tailwind utilities on components — not globals.css patches
- [ ] `@source` globs unchanged unless new scan roots added (rare)

### React

- [ ] Server Component default for data-fetching pages
- [ ] Client islands colocated in `_components/` with clear boundary
- [ ] Module UI not placed in `apps/erp/src/components/` (use module `_components/`)

### Afenda gates

- [ ] `pnpm --filter @afenda/erp typecheck`
- [ ] MCP `get_errors` clean after route changes

---

## Performance regression fix

### Before changing code

- [ ] Run `pnpm --filter @afenda/erp analyze` or Lighthouse on affected route
- [ ] Record largest chunk and gzipped initial JS

### After changing code

- [ ] Re-run same measurement
- [ ] Document delta in PR / completion report
- [ ] Verify no new dynamic class patterns introduced

---

## Storybook story (presentation lab)

- [ ] Story imports from `@afenda/shadcn-studio` barrel
- [ ] No duplicate theme CSS in story files
- [ ] Heavy demo blocks lazy-loaded in story if they pull chart/editor deps

---

## Red flags (stop and fix)

| Signal | Layer |
| --- | --- |
| `` `text-${size}` `` or `` `bg-${color}-500` `` | CSS |
| `import * from '@/lib/utils'` or barrel re-export abuse | JS |
| `ssr: false` on contentful above-fold component | React |
| New `@layer components` rule in globals.css | CSS / Phase 1 violation |
| Full `lodash` or `date-fns` namespace import | JS |
