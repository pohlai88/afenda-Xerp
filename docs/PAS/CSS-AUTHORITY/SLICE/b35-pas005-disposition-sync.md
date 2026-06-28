# Slice B35 ÔÇö PAS-005 PKGR02 Disposition Sync (PAS-005 ┬º14 P2)

**Prerequisite:** [B34 Registry Expansion](b34-pas005-registry-expansion.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Disposition sync

**Risk class:** Low ÔÇö registry knownGap closure only

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b35-pas005-disposition-sync.md

1. Objective    ÔÇö Close PKG004_DESIGN knownGap css-token-authority-migrating-to-PKGR05_CSS_AUTHORITY after B34 proves --afenda-* tokens are in css-authority registry.
2. Allowed layerÔÇö packages/architecture-authority/src/data/foundation-disposition.registry.ts ┬À docs/architecture/foundation-disposition.md ┬À docs/PAS/** 
3. Files        ÔÇö
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/PAS/CSS-AUTHORITY/SLICE/b35-pas005-disposition-sync.md
   docs/PAS/pas-status-index.md
   docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md
4. Prohibited   ÔÇö delete @afenda/design-system CSS exports ┬À expand design-system token.registry.ts
5. Authority    ÔÇö PAS-005 ┬À Architecture Authority ┬À foundation-disposition registry
6. Gates        ÔÇö
   pnpm check:foundation-disposition
   pnpm --filter @afenda/architecture-authority test:run
7. Closes       ÔÇö PKG004_DESIGN.knownGaps css-token-authority-migrating-to-PKGR05_CSS_AUTHORITY
8. Evidence     ÔÇö
   packages/css-authority/src/authorities/afenda-extensions.json (465 tokens)
   foundation-disposition.registry.ts PKG004_DESIGN.knownGaps = []
9. Attestation  ÔÇö css-authority owns CSS-TOKEN rows for --afenda-*; design-system retains Governed UI TS governance
```

## Delivery notes

- **Scope boundary:** Closing the knownGap means `@afenda/css-authority` now owns registry rows for `--afenda-*` CSS variables. `@afenda/design-system` retains Governed UI variant/recipe TS governance; the B30 CSS shim remains until post-v1 per PAS-005.
