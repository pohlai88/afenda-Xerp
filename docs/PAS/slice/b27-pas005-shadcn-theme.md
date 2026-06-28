# Slice B27 — Vendored shadcn Theme + Registry Generator (PAS-005 §11)

**Prerequisite:** B26 greenfield scaffold delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — css-authority package only; no runtime cutover

**Clean Core impact:** A→A — generated registry + vendored CSS; consumers unchanged until B29

## Handoff block

```
Handoff from: docs/PAS/slice/b27-pas005-shadcn-theme.md

1. Objective    — Vendor immutable shadcn neutral/new-york :root theme CSS; sync shadcn-theme.json from vendored vars; emit full afenda-css-authority.css bundle with @theme inline; expand registry tests.
2. Allowed layer— packages/css-authority/** · docs/PAS/slice/b27-pas005-shadcn-theme.md · docs/PAS/pas-status-index.md
3. Files        —
   packages/css-authority/src/css/vendored/shadcn-theme.css
   packages/css-authority/scripts/sync-shadcn-theme-authority.ts
   packages/css-authority/scripts/generate-css-authority-registry.ts
   packages/css-authority/src/authorities/shadcn-theme.json
   packages/css-authority/src/authorities/id-sequence.json
   packages/css-authority/src/authorities/css-files.json
   packages/css-authority/src/css/afenda-css-authority.css
   packages/css-authority/src/generated/css-authority-registry.ts
   packages/css-authority/src/generated/css-authority-registry.json
   packages/css-authority/src/__tests__/css-authority-registry.test.ts
   packages/css-authority/src/__tests__/shadcn-theme-sync.test.ts
   docs/PAS/slice/b27-pas005-shadcn-theme.md
   docs/PAS/pas-status-index.md
4. Prohibited   — packages/design-system/** edits; packages/ui/** cutover (B29); hand-edit src/generated/*; foundation-disposition.registry.ts
5. Authority    — PAS-005 · PKGR05_CSS_AUTHORITY · css-authority skill
6. Gates        —
   pnpm --filter @afenda/css-authority build
   pnpm --filter @afenda/css-authority typecheck
   pnpm --filter @afenda/css-authority test:run
   pnpm check:css-authority-conformance
7. Closes       — vendored-shadcn-theme-not-yet-committed knownGap; seed-only registry
8. Evidence     —
   packages/css-authority/src/css/vendored/shadcn-theme.css
   packages/css-authority/src/generated/css-authority-registry.json
9. Attestation  — Registry · TypeScript · Generator
```
