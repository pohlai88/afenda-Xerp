# Slice B35 — PAS-005 PKGR02 Disposition Sync (PAS-005 §14 P2)

**Prerequisite:** [B34 Registry Expansion](b34-pas005-registry-expansion.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Disposition sync

**Risk class:** Low — registry knownGap closure only

## Handoff block

```
Handoff from: docs/PAS/slice/b35-pas005-disposition-sync.md

1. Objective    — Close PKG004_DESIGN knownGap css-token-authority-migrating-to-PKGR05_CSS_AUTHORITY after B34 proves --afenda-* tokens are in css-authority registry.
2. Allowed layer— packages/architecture-authority/src/data/foundation-disposition.registry.ts · docs/architecture/foundation-disposition.md · docs/PAS/** 
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/PAS/slice/b35-pas005-disposition-sync.md
   docs/PAS/pas-status-index.md
   docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md
4. Prohibited   — delete @afenda/design-system CSS exports · expand design-system token.registry.ts
5. Authority    — PAS-005 · Architecture Authority · foundation-disposition registry
6. Gates        —
   pnpm check:foundation-disposition
   pnpm --filter @afenda/architecture-authority test:run
7. Closes       — PKG004_DESIGN.knownGaps css-token-authority-migrating-to-PKGR05_CSS_AUTHORITY
8. Evidence     —
   packages/css-authority/src/authorities/afenda-extensions.json (465 tokens)
   foundation-disposition.registry.ts PKG004_DESIGN.knownGaps = []
9. Attestation  — css-authority owns CSS-TOKEN rows for --afenda-*; design-system retains TIP-004 TS governance
```

## Delivery notes

- **Scope boundary:** Closing the knownGap means `@afenda/css-authority` now owns registry rows for `--afenda-*` CSS variables. `@afenda/design-system` retains TIP-004 variant/recipe TS governance; the B30 CSS shim remains until post-v1 per PAS-005.
