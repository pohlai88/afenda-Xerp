# Slice PAS-001-AUD-13 — ERP Localization Context Ingress Attestation

> **Position:** Consumer closure for PAS-001-AUD-13 · Blueprint box: `ERP Integration Spine` · closes G-AUD13-01

**Prerequisite:** PAS-001 Enterprise Accepted · kernel `parseUnknownLocalizationContext` Delivered

**Status:** Delivered (2026-06-29)

**Type:** Consumer attestation (mirror PAS-001-AUD-05 BMD ingress pattern)

**Risk class:** Low — ERP trust boundary only; no kernel vocabulary expansion

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001-aud-13-localization-context-ingress-attestation.md

1. Objective    — ERP user/company settings persistence paths parse kernel LocalizationContext at explicit ingress; governance gate attests wiring registry.
2. Allowed layer— apps/erp/src/lib/localization/** · scripts/governance/check-erp-localization-context-ingress-attestation.mts · package.json (gate registration)
3. Files        —
   apps/erp/src/lib/localization/parse-localization-context.server.ts
   apps/erp/src/lib/localization/localization-context-ingress.contract.ts
   apps/erp/src/lib/localization/persist-user-localization-preferences.server.ts
   apps/erp/src/lib/localization/persist-company-localization-settings.server.ts
   apps/erp/src/lib/localization/__tests__/parse-localization-context.server.test.ts
   apps/erp/src/lib/localization/__tests__/localization-context-persistence.server.test.ts
   scripts/governance/check-erp-localization-context-ingress-attestation.mts
   package.json
4. Prohibited   — packages/kernel/src/** · Intl/formatting in kernel · direct DB I/O in persistence helpers
5. Authority    — PAS-001 §4.5 · PAS-001-AUD-13 · PAS-001-AUD-05 ingress pattern · kernel-authority
6. Gates        —
   pnpm check:erp-localization-context-ingress-attestation
   pnpm --filter @afenda/erp test:run -- src/lib/localization
   pnpm --filter @afenda/erp typecheck
7. Closes       — G-AUD13-01 (ERP localization ingress gate)
8. Evidence     — localization __tests__ · check:erp-localization-context-ingress-attestation PASS
9. Attestation  — Contract · Gate · Integration
```

## Wiring registry

`ERP_LOCALIZATION_INGRESS_WIRING` attests two surfaces:

| id | Ingress delegate | Persistence delegate |
| --- | --- | --- |
| user-preferences | `parseUserLocalizationPreferencesAtIngress` | `persistUserLocalizationPreferences` |
| company-settings | `parseCompanyLocalizationSettingsAtIngress` | `persistCompanyLocalizationSettings` |

Both delegates call kernel `parseUnknownLocalizationContext` via `parseLocalizationContextAtIngress`.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | User wire short fields mapped to kernel wire at ingress | ERP localization tests |
| 2 | Company wire uses kernel-aligned field names | ERP localization tests |
| 3 | Governance gate verifies registry + modules + tests | `pnpm check:erp-localization-context-ingress-attestation` |
| 4 | Gate registered in quality chain | `pnpm quality:erp-localization-context-ingress-attestation` |

## Deferred

- Wire into live user-settings / system-admin server actions when those modules exist on disk
- B112 — RoundingMode / DecimalPrecision kernel primitives (see [b112-rounding-decimal-precision-vocabulary-amendment.md](./b112-rounding-decimal-precision-vocabulary-amendment.md))
