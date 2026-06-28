# Slice B36 — PAS-005 Post-B34/B35 Risk Mitigation (PAS-005 §14 P6–P7)

**Prerequisite:** [B35 Disposition Sync](b35-pas005-disposition-sync.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Risk mitigation + governance gates

**Risk class:** Low — registry emit performance, drift gates, appshell CSS defect

## Handoff block

```
Handoff from: docs/PAS/slice/b36-pas005-risk-mitigation.md

1. Objective    — Mitigate PAS-005 post-B34/B35 risks: thin registry TS emit, domain-sync drift gate, R28–R30 consumption rules, P6 --app-shell-content-padding-inline fix, PAS documentation closure.
2. Allowed layer— packages/css-authority/** · packages/appshell/src/styles/afenda-appshell.css (P6) · scripts/governance/check-css-authority-*.mts · root package.json (check script) · docs/PAS/**
3. Files        —
   packages/css-authority/scripts/generate-css-authority-registry.ts
   packages/css-authority/scripts/sync-shadcn-theme-authority.ts
   packages/css-authority/src/policy/css-authority.policy.ts
   packages/css-authority/src/__tests__/css-authority-registry.test.ts
   packages/css-authority/src/__tests__/domain-authority-sync.test.ts
   packages/appshell/src/styles/afenda-appshell.css
   scripts/governance/check-css-authority-domain-sync.mts
   scripts/governance/check-css-authority-consumption.mts
   package.json
   docs/PAS/slice/b36-pas005-risk-mitigation.md
   docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md
   docs/PAS/pas-status-index.md
4. Prohibited   — delete @afenda/design-system CSS exports · edit packages/ui · apps/** · hand-edit generated registry JSON without build
5. Authority    — PAS-005 · CSS Authority · @afenda/css-authority
6. Gates        —
   pnpm --filter @afenda/design-system build
   pnpm --filter @afenda/css-authority build
   pnpm --filter @afenda/css-authority typecheck
   pnpm --filter @afenda/css-authority test:run
   pnpm sync:package-css-dist -- --package @afenda/appshell
   pnpm check:package-css-dist-sync
   pnpm check:css-authority-conformance
   pnpm check:css-authority-consumption
   pnpm check:css-authority-domain-sync
   pnpm check:css-authority-bridge-sync
   pnpm check:css-visual-regression
   pnpm check:css-governance
   pnpm check:foundation-disposition
   pnpm --filter @afenda/appshell test:run
   pnpm quality:boundaries
7. Closes       — PAS-005 §14 P6 (padding var) · P7 (domain-sync + extended consumption) · Risk 1–3 registry/gate gaps
8. Evidence     —
   src/generated/css-authority-registry.ts (<100 lines, JSON import wrapper)
   appshell.json 44 tokens · merged registry 569 tokens
   check:css-authority-domain-sync · R28–R30 consumption rules
9. Attestation  — design-system B30 shim retains css-authority import; no design-system CSS deletion
```

## Delivery notes

- **Thin registry:** Generated `css-authority-registry.ts` imports `css-authority-registry.json`; `CssTokenId` is `string` validated via `isCssTokenId()` Set lookup.
- **Domain sync gate:** `check:css-authority-domain-sync` compares authority JSON token counts to CSS definition sites; fails with rebuild instruction on drift.
- **Extended consumption:** R28 (`--afenda-*`), R29 (`--app-shell-*`), R30 (`--auth-editorial-*`) mirror R23 shadcn definition-authority pattern.
- **P6 fix:** `--app-shell-content-padding-inline: var(--app-shell-gap-xl)` added to `.app-shell-root` block.
